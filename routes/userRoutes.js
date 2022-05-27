const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getUser,
  forgotPassword,
  setNewPassword,
} = require('../controllers/userController')
const protect = require('../middleware/authorise')

// User registration route
router.post('/', registerUser)
// User login route
router.post('/login', loginUser)
// User details route
router.get('/me', protect, getUser)
// User forgot password routes
router.post('/forgot-password', forgotPassword) // This sends a verification code to user email
router.post('/set-new-password', setNewPassword) // This confirms the entered code and sets the new password

module.exports = router
