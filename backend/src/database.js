import mongoose from 'mongoose'
import { config } from 'dotenv'
config()

const URI = process.env.MONGO_URI_LOCAL

export const connectDB = async () => {
  try {
    await mongoose.connect(URI)
    console.log('MongoDB connected....')
    const client = mongoose.connection.getClient()
    return client.db('Solca')
  } catch (error) {
    console.log(error.message)
    throw error
  }
}
