import bcrypt from 'bcrypt'
import { db } from './administrators.js'

export const collectionSocialWorkers = db.collection('Social Workers')

export const socialWorkers = {
  async getSocialWorkers () {
    try {
      const socialWorkers = await collectionSocialWorkers.find({}, { projection: { ci: 1, name: 1, lastname: 1, email: 1 } }).toArray()
      return socialWorkers
    } catch (error) {
      console.log(error.message)
      return error
    }
  },
  async encryptPassword (password) {
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password, salt)
    return passwordEncryp
  },
  // Check BDD password with the user input
  async matchPassword (password, ci) {
    const { password: UserPassword } = await collectionSocialWorkers.findOne({ ci })
    console.log(password)
    console.log(UserPassword)
    const response = await bcrypt.compare(password, UserPassword)
    return response
  },
  async createToken (ci) {
    const tempToken = Math.random().toString(36).slice(2)
    await collectionSocialWorkers.findOneAndUpdate({ ci }, { $set: { token: tempToken } })
    return tempToken
  }
}
