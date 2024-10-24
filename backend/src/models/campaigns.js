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
  }
}
