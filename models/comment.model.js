const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, 'Post added is not right'],
    ref: 'Post',
  },
  comment: {
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        comment: {
          type: String,
          minLength: 5,
        },
      },
    ],
  },
})

module.exports = mongoose.model('Comment', commentSchema)
