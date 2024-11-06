import { collectionCampaigns } from '../models/campaigns.js'
import { donations, collectionDonations } from '../models/donations.js'
import { validateCampaign } from '../schemas/createCampaign.js'
import { beneficiaries } from '../models/beneficiaries.js';

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
    if (items.length === 0) {
      return res.status(400).json({ msg: 'At least you need an item.' })
    }
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

// ---------------------------------- ESTO ----------------------------------------------------//

export const verifyCedula = async (req, res) => {
  const { cedula } = req.body;  


  if (!cedula || typeof cedula !== 'string' || cedula.trim().length === 0) {
    return res.status(400).json({ msg: 'La cédula es obligatoria y debe ser válida' });
  }

  try {
    const beneficiary = await beneficiaries.verifyBeneficiaryByCedula(cedula);

    if (beneficiary) {
      return res.status(200).json({
        found: true,
        beneficiary: {
          nombre: beneficiary.nombre,
          apellido: beneficiary.apellido,
          email: beneficiary.email,
          telefono: beneficiary.telefono
        }
      });
    } else {
      return res.status(404).json({ found: false, msg: 'Beneficiario no encontrado' });
    }
  } catch (error) {
    console.error('Error interno del servidor:', error);  
    return res.status(500).json({ msg: 'Error interno del servidor', error: error.message });
  }
};


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
