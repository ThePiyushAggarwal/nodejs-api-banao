const mongoose = require('mongoose')

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Please login first'],
      ref: 'User',
    },
    title: {
      type: String,
      minLength: 10,
      maxLength: 100,
      required: [true, 'Please add a title to the post'],
    },
    category: {
      type: String,
      enum: ['Entertainment', 'Travel', 'Experience', 'Life Advice'],
      required: [true, 'Please add a category to the post'],
    },
    description: {
      type: String,
      minLength: 30,
      maxLength: 1000,
      required: [true, 'Please add description to your post'],
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Post', postSchema)
