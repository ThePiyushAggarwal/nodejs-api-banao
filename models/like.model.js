const mongoose = require('mongoose')

const likeSchema = mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Post added is not right'],
    ref: 'Post',
  },
  like: {
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, 'Please login to like or unlike'],
          ref: 'User',
        },
      },
    ],
  },
})

module.exports = mongoose.model('Like', likeSchema)
