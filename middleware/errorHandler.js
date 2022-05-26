// This allows custom errors without making us send a error response everytime
const errorHandler = (error, request, response, next) => {
  const statusCode = response.statusCode || 500

  response.status(statusCode)
  response.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  })
  console.log(error)
}

module.exports = errorHandler
