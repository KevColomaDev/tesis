import { supplies, collectionSuplies } from '../models/supplies.js'
import { validateRegisterSupplies } from '../schemas/registerSupplies.js'

export const getSupplies = async (req, res) => {
  try {
    const getSupplies = await supplies.getSupplies()
    const { _id, ...others } = getSupplies
    return res.status(200).json(others)
  } catch (error) {
    console.log(error)
  }
}

export const suppliesRegister = async (req, res) => {
  try {
    const suppliesInput = validateRegisterSupplies(req.body)
    console.log(suppliesInput)
    const oldSupplies = await collectionSuplies.findOne({ name: supplies.name })
    // console.log(oldSupplies)
    let toothPaste = oldSupplies.toothPaste
    let soap = oldSupplies.soap
    let toothBrush = oldSupplies.toothBrush
    let towel = oldSupplies.towel
    if (suppliesInput.toothPaste) {
      toothPaste += suppliesInput.toothPaste
    }
    if (suppliesInput.soap) {
      soap += suppliesInput.soap
    }
    if (suppliesInput.toothBrush) {
      toothBrush += suppliesInput.toothBrush
    }
    if (suppliesInput.towel) {
      towel += suppliesInput.towel
    }
    const updateSupplies = {
      toothPaste,
      soap,
      toothBrush,
      towel
    }
    await supplies.registerSupplies(updateSupplies)
    return res.status(200).json({ msg: 'Supplies registered', updateSupplies })
  } catch (error) {
    console.log(error)
  }
}

export const assignSupplies = async (req, res) => {
  try {
    const suppliesInput = validateRegisterSupplies(req.body)
    console.log(suppliesInput)
    const oldSupplies = await collectionSuplies.findOne({ name: suppliesInput.name })
    if (oldSupplies.toothPaste < suppliesInput.toothPaste || oldSupplies.soap < suppliesInput.soap || oldSupplies.toothBrush < suppliesInput.toothBrush || oldSupplies.towel < suppliesInput.towel) {
      return res.status(401).json({ msg: 'Not enough supplies' })
    }

    const newSupplies = {
      toothPaste: oldSupplies.toothPaste - suppliesInput.toothPaste,
      soap: oldSupplies.soap - suppliesInput.soap,
      toothBrush: oldSupplies.toothBrush - suppliesInput.toothBrush,
      towel: oldSupplies.towel - suppliesInput.towel
    }
    await supplies.registerSupplies(newSupplies)
    return res.status(200).json({ msg: 'Supplies assigned', newSupplies })
  } catch (error) {
    console.log(error)
  }
}
