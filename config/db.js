const mongoose = require('mongoose')

// This functions lets us connect to the mongodb using a URI present in Env variables
const connectDB = async () => {
  try {
    console.log('Connecting to Database...')
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Database Connected!')
  } catch (error) {
    console.log(error)
    process.exit()
  }
}

module.exports = connectDB
