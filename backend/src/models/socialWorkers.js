import bcrypt from 'bcrypt'
import { db } from './administrators.js'

export const collectionSocialWorkers = db.collection('Social Workers')

export const socialWorkers = {
  async login (email, password) {
    try {
      const response = await this.matchPassword(password, email)
      if (response) {
        const socialWorker = await collectionSocialWorkers.findOne({ email })
        return socialWorker
      } else {
        return response
      }
    } catch (error) {
      console.log(error.message)
    }
  },
  async getSocialWorkers () {
    try {
      const socialWorkers = await collectionSocialWorkers.find({}, { projection: { ci: 1, name: 1, lastname: 1, email: 1 } }).toArray()
      return socialWorkers
    } catch (error) {
      console.log(error.message)
      return error
    }
  },
  async updatePassword (password, email, newPassword) {
    try {
      const response = await this.matchPassword(password, email)
      if (response) {
        const newPass = await this.encryptPassword(newPassword)
        const socialWorker = await collectionSocialWorkers.findOneAndUpdate({ email },
          { $set: { password: newPass } },
          { returnDocument: 'after' })
        return true
      } else {
        return false
      }
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
  async matchPassword (password, email) {
    const { password: UserPassword } = await collectionSocialWorkers.findOne({ email })
    const response = await bcrypt.compare(password, UserPassword)
    return response
  },
  async createToken (ci) {
    const tempToken = Math.random().toString(36).slice(2)
    await collectionSocialWorkers.findOneAndUpdate({ ci }, { $set: { token: tempToken } })
    return tempToken
  }
}
