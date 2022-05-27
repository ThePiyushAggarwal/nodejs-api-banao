// asyncHandler to avoid using try catch
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const generateToken = require('../utilities/jwt')
const bcryptjs = require('bcryptjs')
const sendConfirmationCode = require('../mailer/mailer')

// Register User
// POST /api/users
// Public
const registerUser = asyncHandler(async (request, response) => {
  const { name, email, username, password } = request.body

  // Checking if all the users' details are entered
  if (!name || !email || !username || !password) {
    response.status(400)
    throw new Error(
      'Please enter all fields including name, email, username and password'
    )
  }

  // Checking if user already exists in the database
  const byEmail = await User.findOne({ email })
  const byUsername = await User.findOne({ username })
  if (byEmail || byUsername) {
    response.status(400)
    throw new Error('It seems that user already exists. Please login instead!')
  }

  // Hashing the password
  const salt = await bcryptjs.genSalt()
  const passwordHashed = await bcryptjs.hash(password, salt)

  const user = await User.create({
    name,
    email,
    username,
    password: passwordHashed,
  })

  response.send({
    success: 'User registered',
    username: user.username,
    token: generateToken(user._id),
  })
})

// Login User
// POST /api/users
// Public
const loginUser = asyncHandler(async (request, response) => {
  const { email, username, password } = request.body

  // Checking if required fields are entered
  if (username || email) {
    if (!password) {
      throw new Error('Please enter your password')
    }
  } else {
    response.status(400)
    throw new Error('Please enter Email(or username) and password')
  }

  // Checking if user exists in the database
  const byEmail = await User.findOne({ email })
  const byUsername = await User.findOne({ username })
  const user = byEmail || byUsername
  if (!user) {
    throw new Error('User does not exist. Please register first!')
  }

  // Checking if the password is correct
  if (!(await bcryptjs.compare(password, user.password))) {
    response.status(400)
    throw new Error('Invalid credentials!')
  }

  response.send({
    success: 'Logged in',
    username: user.username,
    token: generateToken(user._id),
  })
})

// Get User Details
// GET /api/users/me
// Private
const getUser = asyncHandler(async (request, response) => {
  const user = request.user
  response.json({
    success: 'User details fetched',
    name: user.name,
    username: user.username,
  })
})

// Forgot Password, sends a verification code to email
// POST /api/users/forgot-password
// Public
const forgotPassword = asyncHandler(async (request, response) => {
  const { email } = request.body

  // Checking if email is entered
  if (!email) {
    response.status(400)
    throw new Error('Please enter the email!')
  }

  const user = await User.findOne({ email })

  // If the user email is not found, throw error
  if (!user) {
    response.status(400)
    throw new Error('Please check the entered email. It seems to be incorrect.')
  }

  // Sending the generated code to the database
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { forgotPasswordConfirmationCode: Math.floor(Math.random() * 9000 + 1000) },
    { new: true, runValidators: true }
  )

  // This sends the email with the code to user email
  sendConfirmationCode(updatedUser)

  response.json({
    success:
      'A code has been sent to your email. Please enter code, email and new password in the follow up request API.',
  })
})

// Set new password, takes in the code from email
// POST /api/users/set-new-password
// Public
const setNewPassword = asyncHandler(async (request, response) => {
  const { email, newPassword, code } = request.body

  // Checking if all the fields are entered
  if (!email || !newPassword || !code) {
    response.status(400)
    throw new Error('Please enter all fields!')
  }

  const user = await User.findOne({ email })

  // If the user email is not found, throw error
  if (!user) {
    response.status(400)
    throw new Error('Please check the entered email. It seems to be incorrect.')
  }

  // If the entered code is wrong
  if (user.forgotPasswordConfirmationCode !== parseInt(code)) {
    await User.findByIdAndUpdate(
      user._id,
      {
        forgotPasswordConfirmationCode: Math.floor(Math.random() * 9000 + 1000),
      },
      { new: true, runValidators: true }
    )
    response.status(401)
    throw new Error(
      'Confirmation code entered is incorrect. Please request for another code.'
    )
  }

  // Hashing the new password
  const salt = await bcryptjs.genSalt()
  const newHashedPassword = await bcryptjs.hash(newPassword, salt)

  // If the code is correct, update password and reset code
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      password: newHashedPassword,
      forgotPasswordConfirmationCode: Math.floor(Math.random() * 9000 + 1000),
    },
    { new: true, runValidators: true }
  )

  if (!updatedUser) {
    response.status(500)
    throw new Error('Internal Server Error')
  }

  response.json({
    success: 'Password updated successfully!',
  })
})

module.exports = {
  registerUser,
  loginUser,
  getUser,
  forgotPassword,
  setNewPassword,
}
