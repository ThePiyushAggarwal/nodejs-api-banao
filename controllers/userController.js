// asyncHandler to avoid using try catch
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const generateToken = require('../utilities/jwt')
const bcryptjs = require('bcryptjs')

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
    name: user.name,
    username: user.username,
  })
})

module.exports = { registerUser, loginUser, getUser }
