import { supplies, collectionSuplies } from '../models/supplies.js'
import { validateSupply } from '../schemas/createSupply.js'
import { validateAddSupplies } from '../schemas/addSupplies.js'
import mongoose from 'mongoose'

export const getSupplies = async (req, res) => {
  try {
    const getSupplies = await supplies.getSupplies()
    const { _id, ...others } = getSupplies
    return res.status(200).json(others)
  } catch (error) {
    console.log(error)
  }
}

export const createSupply = async (req, res) => {
  try {
    const itemInput = validateSupply(req.body)
    // If return Zod issues send back them with 400 status
    if (Object.keys(itemInput).includes('issues')) {
      return res.status(400).json(itemInput.errors)
    }
    // Verify if name field is empty
    if (Object.values(itemInput).includes('')) {
      return res.status(400).json({ msg: 'Complete the name field.' })
    }
    // Verify if item already exists
    const existItem = await collectionSuplies.findOne({ name: itemInput.name })
    if (existItem) {
      return res.status(400).json({ msg: 'Item already exists.' })
    }
    await collectionSuplies.insertOne(itemInput)
    return res.status(200).json(itemInput)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'Internal Server Error' })
  }
}

export const deleteSupply = async (req, res) => {
  try {
    const { id } = req.params
    const { quantity } = await collectionSuplies.findOne({ _id: new mongoose.Types.ObjectId(id) })
    if (quantity === 0) {
      const deletedSupply = await collectionSuplies.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) })
      if (!deletedSupply) {
        return res.status(400).json({ msg: 'Item doesnt exists.' })
      }
      return res.status(200).json({ msg: 'Item deleted successfully.' })
    } else {
      return res.status(400).json({ msg: 'There is still stock.' })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'Internal Server Error' })
  }
}

export const addStock = async (req, res) => {
  try {
    const suppliesInput = validateAddSupplies(req.body)
    if (Object.keys(suppliesInput).includes('issues')) {
      return res.status(400).json({ errors: suppliesInput.issues })
    }
    const { id } = req.params
    const { quantity } = await collectionSuplies.findOne({ _id: new mongoose.Types.ObjectId(id) })
    const updateSupplies = await collectionSuplies.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      { $set: { quantity: quantity + suppliesInput.quantity } },
      { returnDocument: 'after' }
    )
    if (!updateSupplies) {
      return res.status(404).json({ msg: 'Supply not found' })
    }
    return res.status(200).json({ msg: 'Supplies registered', updateSupplies })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}

export const assignSupplies = async (req, res) => {
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
