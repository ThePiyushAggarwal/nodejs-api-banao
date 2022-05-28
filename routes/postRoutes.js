const express = require('express')
const router = express.Router()
const {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  getMyPost,
  updateMyPost,
  deleteMyPost,
} = require('../controllers/postController')
const protect = require('../middleware/authorise')

// Create post route
router.post('/new', protect, createPost)

// Get all posts
router.get('/all', protect, getAllPosts)
// Get single post
router.get('/all/:id', protect, getPostById)

// Get my posts
router.get('/me', protect, getMyPosts)
// Get my post by id
router.get('/me/:id', protect, getMyPost)

// Update my post
router.put('/me/:id', protect, updateMyPost)
// Delete my post
router.delete('/me/:id', protect, deleteMyPost)

module.exports = router
