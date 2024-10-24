import { collectionCampaigns } from '../models/campaigns.js'
import { donations, collectionDonations } from '../models/donations.js'
import { validateCampaign } from '../schemas/createCampaign.js'

export const getCampaigns = async (req, res) => {
  try {
    const getDonations = await donations.getCampaigns()
    const { _id, ...others } = getDonations
    return res.status(200).json(others)
  } catch (error) {
    console.log(error)
  }
}

export const getDonations = async (req, res) => {
  try {
    const getDonations = await donations.getDonations()
    const { _id, ...others } = getDonations
    return res.status(200).json(others)
  } catch (error) {
    console.log(error)
  }
}

export const createCampaign = async (req, res) => {
  try {
    const campaignInput = validateCampaign(req.body)
    // If return Zod issues send back them with 400 status
    if (Object.keys(campaignInput).includes('issues')) {
      return res.status(400).json(campaignInput.errors)
    }
    // Verify if name field is empty
    if (Object.values(campaignInput)[0] === '') {
      return res.status(400).json({ msg: 'Complete the name field.' })
    }
    const items = campaignInput.items
    items.forEach(async item => {
      const donationExist = await collectionDonations.findOne({ name: item.name })
      if (donationExist) {
        const { quantity } = donationExist
        await collectionDonations.findOneAndUpdate({ name: item.name }, { $set: { quantity: quantity + item.quantity } })
      } else {
        await collectionDonations.insertOne(item)
      }
    })
    await collectionCampaigns.insertOne(campaignInput)
    return res.status(200).json(campaignInput)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'Internal Server Error' })
  }
}

export const assignBeneficiary = async (req, res) => {
  // try {
  //   const suppliesInput = validateAddSupplies(req.body)
  //   console.log(suppliesInput)
  //   const oldSupplies = await collectionSuplies.findOne({ name: suppliesInput.name })
  //   if (oldSupplies.toothPaste < suppliesInput.toothPaste || oldSupplies.soap < suppliesInput.soap || oldSupplies.toothBrush < suppliesInput.toothBrush || oldSupplies.towel < suppliesInput.towel) {
  //     return res.status(401).json({ msg: 'Not enough supplies' })
  //   }

  //   const newSupplies = {
  //     toothPaste: oldSupplies.toothPaste - suppliesInput.toothPaste,
  //     soap: oldSupplies.soap - suppliesInput.soap,
  //     toothBrush: oldSupplies.toothBrush - suppliesInput.toothBrush,
  //     towel: oldSupplies.towel - suppliesInput.towel
  //   }
  //   await supplies.registerSupplies(newSupplies)
  //   return res.status(200).json({ msg: 'Supplies assigned', newSupplies })
  // } catch (error) {
  //   console.log(error)
  // }
}
