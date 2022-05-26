const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add your email'],
  },
  username: {
    type: String,
    required: [true, 'Please add a name'],
  },
  password: {
    type: String,
    required: [true, 'Please add your password'],
  },
})

module.exports = mongoose.model('User', userSchema)
