// In this modules we make a function which generates a token
// based on the id passed to it

const jwt = require('jsonwebtoken')

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '10d',
  })
}

module.exports = generateToken
