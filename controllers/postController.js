const asyncHandler = require('express-async-handler')
const Post = require('../models/postModel')
const Like = require('../models/like.model')
const Comment = require('../models/comment.model')

// Create Post
// POST /api/posts/new
// Private
const createPost = asyncHandler(async (request, response) => {
  const { title, category, description } = request.body
  // User has been received from middleware so need to recheck
  const user = request.user

  // Checking if request object contains required information
  if (!title || !category || !description) {
    response.status(400)
    throw new Error('Please enter all fields')
  }

  // Creating a new post
  const post = await Post.create({
    user: user.id,
    title,
    category,
    description,
  })

  if (!post) {
    response.status(500)
    throw new Error('Post could not be created')
  }

  // Creating a corresponding like and comment schema for the post
  const likes = await Like.create({
    post: post._id,
  })
  const comments = await Comment.create({
    post: post._id,
  })

  // This includes required user details in every post
  const postWithUserDetail = await Post.findByIdAndUpdate(
    post._id,
    { likes, comments },
    { new: true, runValidators: true }
  ).populate('user', 'name username')

  response.status(201).json(postWithUserDetail)
})

// Get all Posts
// GET /api/posts/all
// Private
const getAllPosts = asyncHandler(async (_, response) => {
  const postsWithUserDetail = await Post.find()
    .populate('user', 'name username')
    .populate('likes', 'like')
    .populate('comments', 'comment')
  response.status(200).json(postsWithUserDetail)
})

// Get single by Id
// GET /api/posts/all/:id
// Private
const getPostById = asyncHandler(async (request, response) => {
  const postWithUserDetail = await Post.findById(request.params.id)
    .populate('user', 'name username')
    .populate('likes', 'like')
    .populate('comments', 'comment')
  response.status(200).json(postWithUserDetail)
})

// Get all of my Posts
// GET /api/posts/me
// Private
const getMyPosts = asyncHandler(async (request, response) => {
  // This comes from authorise middleware
  const user = request.user

  const postsWithUserDetail = await Post.find({ user: user._id })
    .populate('user', 'name username')
    .populate('likes', 'like')
    .populate('comments', 'comment')
  response.status(200).json(postsWithUserDetail)
})

// Get my post by Id
// GET /api/posts/me/:id
// Private
const getMyPost = asyncHandler(async (request, response) => {
  // This comes from authorise middleware
  const user = request.user
  const postWithUserDetail = await Post.find({
    user: user._id,
    _id: request.params.id,
  })
    .populate('user', 'name username')
    .populate('likes', 'like')
    .populate('comments', 'comment')
  response.status(200).json(postWithUserDetail)
})

// Update my post by Id
// GET /api/posts/me/:id
// Private
const updateMyPost = asyncHandler(async (request, response) => {
  // This comes from authorise middleware
  const user = request.user

  const { title, category, description } = request.body

  const updatedPostWithUserDetail = await Post.findOneAndUpdate(
    {
      user: user._id,
      _id: request.params.id,
    },
    { title, category, description },
    { new: true, runValidators: true }
  )
    .populate('user', 'name username')
    .populate('likes', 'like')
    .populate('comments', 'comment')

  // If the user is not updated
  if (!updatedPostWithUserDetail) {
    response.status(400)
    throw new Error('Please make sure the details entered are correct.')
  }

  response.status(200).json(updatedPostWithUserDetail)
})

// Delete my post by Id
// DELETE /api/posts/me/:id
// Private
const deleteMyPost = asyncHandler(async (request, response) => {
  // This comes from authorise middleware
  const user = request.user
  const deleted = await Post.findOneAndDelete({
    user: user._id,
    _id: request.params.id,
  })
  await Like.findOneAndDelete({
    post: request.params.id,
  })
  await Comment.findOneAndDelete({
    post: request.params.id,
  })

  // If the object is not deleted, we get 'null'
  if (!deleted) {
    response.status(400)
    throw new Error('It seems that the post has already been deleted.')
  }

  response.status(200).json({ success: true })
})

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  getMyPost,
  updateMyPost,
  deleteMyPost,
}
