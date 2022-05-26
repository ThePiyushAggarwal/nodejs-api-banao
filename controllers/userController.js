// asyncHandler to avoid using try catch
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const generateToken = require('../utilities/jwt')

// Register User
// POST /api/users
// Public
const registerUser = asyncHandler(async (request, response) => {
  const { name, email, username, password } = request.body

  // Checking if all the users are entered
  if (!name || !email || !username || !password) {
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

  const user = await User.create({
    name,
    email,
    username,
    password,
  })

  if (!user) {
    throw new Error('Something went wrong. Couldnt sign up')
  }

  response.send({
    username,
    token: generateToken(user._id),
  })
})

module.exports = { registerUser }
