const asyncHandler = require('express-async-handler')
const Comment = require('../models/comment.model')

// Add a comment
// POST /api/posts/comment
// Private
const addComment = asyncHandler(async (request, response) => {
  const { postId, comment } = request.body
  const user = request.user

  // If post ID and comment are not received
  if (!postId || !comment) {
    response.status(400)
    throw new Error('Please enter post ID and comment')
  }

  // Checking if post exists or not
  const postExists = await Comment.findOne({ post: postId })
  if (!postExists) {
    response.status(400)
    throw new Error('Please enter correct post ID')
  }

  const newComment = await Comment.findOneAndUpdate(
    { post: postId },
    {
      $push: {
        comment: { user: user._id, comment },
      },
    },
    { new: true, runValidators: true, upsert: true }
  )

  if (!newComment) {
    response.status(500)
    throw new Error('Something went wrong')
  }

  response.status(201).json(newComment)
})

// Delete a comment
// DELETE /api/posts/comment
// Private
const deleteComment = asyncHandler(async (request, response) => {
  const { postId, commentId } = request.body
  const user = request.user

  const deleted = await Comment.findOneAndUpdate(
    { post: postId, 'comment.user': user._id, 'comment._id': commentId },
    {
      $pull: {
        comment: { user: user._id, _id: commentId },
      },
    },
    {
      new: true,
      runValidators: true,
    }
  )

  if (!deleted) {
    response.status(500)
    throw new Error('Comment not deleted. Something went wrong.')
  }

  response.status(200)
  response.json({ success: 'Comment deleted' })
})

// Update a comment
// PUT /api/posts/comment
// Private
const updateComment = asyncHandler(async (request, response) => {
  const { postId, commentId, comment } = request.body
  const user = request.user

  const updated = await Comment.findOneAndUpdate(
    { post: postId, 'comment.user': user._id, 'comment._id': commentId },
    {
      $set: { 'comment.$[elem].comment': comment },
    },
    {
      arrayFilters: [{ 'elem.user': user.id, 'elem._id': commentId }],
      new: true,
      runValidators: true,
    }
  )

  if (!updated) {
    response.status(500)
    throw new Error('Comment not deleted. Something went wrong.')
  }

  response.status(200)
  response.json({ success: 'Comment updated', allCommentsOnThisPost: updated })
})

module.exports = {
  addComment,
  deleteComment,
  updateComment,
}
