require('dotenv').config()
const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000

app.get('/', (request, response) => {
  response.send('Hello Moto')
})

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}}`))
