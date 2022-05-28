const mongoose = require('mongoose')
const Post = require('./postModel')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 30,
      required: [true, 'Please add a name'],
      match: [
        /^(?!\s)(?!.*\s\s)(?!.*\s$)[a-zA-Z\s]+$/,
        'Please enter a valid name.',
      ],
    },
    email: {
      type: String,
      trim: true,
      minLength: 6,
      maxLength: 40,
      required: [true, 'Please add your email'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    username: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 30,
      required: [true, 'Please add a name'],
      match: [/^[\w_]+$/, 'Please enter a valid username'],
    },
    password: {
      type: String,
      required: [true, 'Please add your password'],
    },
    forgotPasswordConfirmationCode: {
      type: Number,
      minLength: 4,
      maxLength: 4,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('User', userSchema)
