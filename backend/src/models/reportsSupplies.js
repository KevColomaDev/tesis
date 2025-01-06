import { db } from './administrators.js'
export const collectionReportsRoomSupplies = db.collection('Reports Room Supplies')
export const collectionReportsSupplies = db.collection('Reports Supplies')

export const reportsSupplies = {
  async getReportsRoomSupplies () {
    try {
      const reports = await collectionReportsRoomSupplies.find().toArray()
      return reports
    } catch (error) {
      console.log(error.message)
      return error
    }
  },
  async getReportsSupplies () {
    try {
      const reports = await collectionReportsSupplies.find().toArray()
      return reports
    } catch (error) {
      console.log(error.message)
      return error
    }
  },
  async getReportsbyNameAndDay (name, date) {
    try {
      const reports = await collectionReportsSupplies.findOne({ name, date })
      return reports
    } catch (error) {
      console.log(error.message)
      return error
    }
  },
  async getReports (initialDate, finalDate) {
    try {
      const reportsData = await collectionReportsSupplies.find({ date: { $gte: initialDate, $lte: finalDate } }).toArray()
      const reportsDataTry = await collectionReportsSupplies.find({ date: { $gte: '04/01/2025', $lte: '06/01/2025' } }).toArray()
      const reportsDataTryMD = await collectionReportsSupplies.find({ date: { $gte: '01/06/2025', $lte: '01/04/2025' } }).toArray()
      console.log(reportsDataTry)
      console.log(reportsDataTryMD)
      return reportsData
    } catch (error) {
      console.log(error)
    }
  },
  async getRoomsReports (initialDate, finalDate) {
    try {
      const reportsData = await collectionReportsRoomSupplies.find({ assignDate: { $gte: initialDate, $lte: finalDate } }).toArray()
      return reportsData
    } catch (error) {
      console.log(error)
    }
  }
}
