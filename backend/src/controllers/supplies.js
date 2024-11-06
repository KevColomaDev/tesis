import { supplies, collectionSuplies } from '../models/supplies.js'
import { validateSupply } from '../schemas/createSupply.js'
import { validateAddSupplies } from '../schemas/addSupplies.js'
import mongoose from 'mongoose'
import { validateAssignSupplies } from '../schemas/assignSupplies.js'
import { collectionReportsSupplies } from '../models/reportsSupplies.js'

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
    if (Object.values(itemInput)[0] === '') {
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
    if (suppliesInput.quantity === 0) {
      return res.status(200).json({ msg: 'No quantity registered' })
    }
    const { name: nameInput } = req.params
    const { quantity } = await collectionSuplies.findOne({ name: nameInput })
    const updateSupplies = await collectionSuplies.findOneAndUpdate(
      { name: nameInput },
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
  try {
    const { room: numberRoom } = req.params
    const assignInput = validateAssignSupplies(req.body)
    if (Object.keys(assignInput).includes('issues')) {
      return res.status(400).json({ errors: assignInput.issues })
    }
    const updatedSupplies = []
    // Check if existences exists
    for (let i = 0; i < assignInput.supplies.length; i++) {
      try {
        const { quantity } = await collectionSuplies.findOne({ name: assignInput.supplies[i].name })
        if (quantity < assignInput.supplies[i].quantity) {
          return res.status(400).json({ msg: 'Not enough existencies.' })
        } else {
          const updatedSupply = await collectionSuplies.findOneAndUpdate(
            { name: assignInput.supplies[i].name },
            { $set: { quantity: quantity - assignInput.supplies[i].quantity } },
            { returnDocument: 'after' })
          updatedSupplies.push(updatedSupply)
        }
      } catch (error) {
        return res.status(400).json({ msg: 'Supply or supplies doesnt exist.' })
      }
    }
    // Make report
    const report = {
      room: numberRoom,
      assignedSupplies: assignInput.supplies,
      assignDate: new Date().toLocaleDateString()
    }
    await collectionReportsSupplies.insertOne(report)
    return res.status(200).json(report)
  } catch (error) {
    console.log(error)
  }
}