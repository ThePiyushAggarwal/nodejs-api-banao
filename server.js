require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const connectDB = require('./config/db')
const errorHandler = require('./middleware/errorHandler')

// Connecting to the database
connectDB()

// Body parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes for user login and registration
app.use('/api/users/', require('./routes/userRoutes'))

app.get('/', (request, response) => {
  response.send('Hello Moto')
})

// Custom error Handler
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
