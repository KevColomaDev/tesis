import { db } from './administrators.js'
export const collectionCampaigns = db.collection('Campaigns')

export const campaigns = {
  async getCampaigns () {
    try {
      const campaigns = await collectionCampaigns.find().toArray()
      return campaigns
    } catch (error) {
      console.log(error.message)
      return error
    }
  },
  async getReports (initialDate, finalDate) {
    try {
      const reportsData = await collectionCampaigns.find({ donationDate: { $gte: initialDate, $lte: finalDate } }).toArray()
      return reportsData
    } catch (error) {
      console.log(error)
    }
  }
}
