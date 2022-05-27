const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getUser,
} = require('../controllers/userController')
const protect = require('../middleware/authorise')

// User registration route
router.post('/', registerUser)
// User login route
router.post('/login', loginUser)
// User details route
router.get('/me', protect, getUser)

module.exports = router
