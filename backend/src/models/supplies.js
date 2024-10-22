import { db, collectionRooms } from './administrators.js'
export const collectionSuplies = db.collection('Supplies')

export const supplies = {
  async getSupplies () {
    try {
      const supplies = await collectionSuplies.find().toArray()
      return supplies[0]
    } catch (error) {
      console.log(error.message)
    }
  },

  async registerSupplies (supplies) {
    try {
      const newSupplies = await collectionSuplies.findOneAndUpdate({ name: supplies.name }, { $set: supplies }, { upsert: true })
      return newSupplies
    } catch (error) {
      console.log(error.message)
    }
  },
  async registerSupliesRoom (supplies) {
    try {
      const findRoom = await collectionRooms.findOne({ h_number: supplies.h_number })
      const newSupplies = await collectionSuplies.findOneAndUpdate({ name: supplies.name }, { $set: supplies }, { upsert: true })
      console.log(findRoom)
      console.log(newSupplies)
      return newSupplies
    } catch (error) {
      console.log(error.message)
    }
  }
}
