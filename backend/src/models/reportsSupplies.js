import { db } from './administrators.js'
export const collectionReportsSupplies = db.collection('ReportsSupplies')

export const reportsSupplies = {
  async getReportsSupplies () {
    try {
      const reports = await collectionReportsSupplies.find().toArray()
      return reports
    } catch (error) {
      console.log(error.message)
      return error
    }
  }
}
