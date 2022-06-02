const asyncHandler = require('express-async-handler')
const Like = require('../models/like.model')

// Toggle like
// POST /api/posts/like
// Private
const toggleLike = asyncHandler(async (request, response) => {
  const { postId } = request.body
  const user = request.user

  // If post ID is not received
  if (!postId) {
    response.status(400)
    throw new Error('Please enter post ID')
  }

  // Checking if post exists or not
  const postExists = await Like.findOne({ post: postId })
  if (!postExists) {
    response.status(400)
    throw new Error('Please enter correct post ID')
  }

  // If the user has already liked the post, UNLIKE
  const alreadyLikedThenUnlike = await Like.findOneAndUpdate(
    { post: postId, 'like.user': user._id },
    {
      $pull: {
        like: { user: user._id },
      },
      // Note: don't know why but this works without any new:true or upsert:true
      // Update: It was working but returned object was not the updated one
    },
    {
      new: true,
      runValidators: true,
    }
  )

  if (alreadyLikedThenUnlike) {
    response.status(200)

    return response.json({
      message: 'The post has been unliked',
      'Number of likes on this post': alreadyLikedThenUnlike.like.length,
    })
  }

  // If the post hasn't been liked by the user
  const like = await Like.findOneAndUpdate(
    { post: postId },
    {
      $push: {
        like: { user: user._id },
      },
    },
    { new: true, runValidators: true, upsert: true }
  )

  if (like) {
    response.status(201)
    return response.json({
      'Number of likes on this post': like.like.length,
    })
  }

  // Populate function for future reference only
  // const populateAndSend = await Like.populate(like, {
  //   path: 'like.user',
  //   select: 'name username',
  // })
})

module.exports = {
  toggleLike,
}
