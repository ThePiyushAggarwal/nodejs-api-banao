const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler')

const protect = asyncHandler(async (request, response, next) => {
  if (
    request.headers.authorization &&
    request.headers.authorization.startsWith('Bearer')
  ) {
    const token = request.headers.authorization.split(' ')[1]

    const { id } = jwt.verify(
      token,
      process.env.JWT_SECRET,
      (error, decoded) => {
        if (!error) {
          return decoded
        }
        response.status(400)
        throw new Error('You are not authorized to access this')
      }
    )

    request.user = await User.findById(id)

    next()
  } else {
    response.status(400)
    throw new Error('Please login to access this!')
  }
})

module.exports = protect
