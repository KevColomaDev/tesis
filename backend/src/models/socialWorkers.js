import { db } from './administrators.js'

export const collectionSocialWorkers = db.collection('Social Workers')

export const socialWorkers = {
  async getSocialWorkers () {
    try {
      const socialWorkers = await collectionSocialWorkers.find().toArray()
      return socialWorkers
    } catch (error) {
      console.log(error.message)
      return error
    }
  }
}
