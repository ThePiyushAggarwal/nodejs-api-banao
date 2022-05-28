require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')
const morgan = require('morgan')

// Connecting to the database
connectDB()

// Logger for requests made to the server - morgan
app.use(morgan('tiny'))

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Routes for user login and registration
app.use('/api/users', require('./routes/userRoutes'))

// Routes for accessing posts
app.use('/api/posts', require('./routes/postRoutes'))

app.get('/', (request, response) => {
  response.send('Welcome to Node API App')
})

// Custom error Handler
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
