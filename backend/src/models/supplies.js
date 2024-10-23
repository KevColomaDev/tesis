import { db, collectionRooms } from './administrators.js'
export const collectionSuplies = db.collection('Supplies')

export const supplies = {
  async getSupplies () {
    try {
      const supplies = await collectionSuplies.find().sort({ quantity: -1 }).toArray()
      return supplies
    } catch (error) {
      console.log(error.message)
      return error
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
