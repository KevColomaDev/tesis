import { supplies, collectionSuplies } from '../models/supplies.js'
import { validateSupply } from '../schemas/createSupply.js'
import { validateAddSupplies } from '../schemas/addSupplies.js'
import mongoose from 'mongoose'
import { validateAssignSupplies } from '../schemas/assignSupplies.js'
import { collectionReportsRoomSupplies, collectionReportsSupplies, reportsSupplies } from '../models/reportsSupplies.js'
import { socialWorkers } from '../models/socialWorkers.js'
import { sendSupplyShortageNotification } from '../config/nodemailer.js'

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
    if (itemInput.quantity > 0) {
      const todayDate = new Date().toLocaleDateString('es-ES')
      const reports = await reportsSupplies.getReportsbyNameAndDay(itemInput.name, todayDate)
      if (reports) {
        const updatedReport = await collectionReportsSupplies.findOneAndUpdate(
          { name: itemInput.name, date: todayDate },
          { $set: { quantity: reports.quantity + itemInput.quantity } },
          { returnDocument: 'after' }
        )
        console.log(updatedReport)
      } else {
        const newReport = {
          name: itemInput.name,
          quantity: itemInput.quantity,
          date: new Date().toLocaleDateString('es-ES')
        }
        await collectionReportsSupplies.insertOne(newReport)
      }
    }
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
        return res.status(400).json({ msg: 'El suministro selecionado no existe.' })
      }
      return res.status(200).json({ msg: 'Suministro eliminado correctamente.' })
    } else {
      return res.status(400).json({ msg: 'Todavia quedan existencias de este suministro.' })
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
      return res.status(400).json({ msg: 'La cantidad debe ser mayor a cero' })
    }
    const { name: nameInput } = req.params
    const { quantity } = await collectionSuplies.findOne({ name: nameInput })
    const updateSupplies = await collectionSuplies.findOneAndUpdate(
      { name: nameInput },
      { $set: { quantity: quantity + suppliesInput.quantity } },
      { returnDocument: 'after' }
    )
    if (!updateSupplies) {
      return res.status(404).json({ msg: 'Suministro no encontrado' })
    }
    const todayDate = new Date().toLocaleDateString('es-ES')
    const reports = await reportsSupplies.getReportsbyNameAndDay(nameInput, todayDate)
    if (reports) {
      const updatedReport = await collectionReportsSupplies.findOneAndUpdate(
        { name: nameInput, date: todayDate },
        { $set: { quantity: reports.quantity + suppliesInput.quantity } },
        { returnDocument: 'after' }
      )
      console.log(updatedReport)
    } else {
      const newReport = {
        name: nameInput,
        quantity: suppliesInput.quantity,
        date: new Date().toLocaleDateString('es-ES')
      }
      await collectionReportsSupplies.insertOne(newReport)
    }
    return res.status(200).json({ msg: 'Suministros registrados exitosamente.', updateSupplies })
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
    if (assignInput.supplies.length < 1) {
      return res.status(400).json({ msg: 'Suministros no encontrados.' })
    }
    const updatedSupplies = []
    // Check if existences exists
    for (let i = 0; i < assignInput.supplies.length; i++) {
      try {
        const { quantity } = await collectionSuplies.findOne({ name: assignInput.supplies[i].name })
        if (quantity < assignInput.supplies[i].quantity) {
          return res.status(400).json({ msg: 'No hay suficientes existencias.' })
        } else {
          const updatedSupply = await collectionSuplies.findOneAndUpdate(
            { name: assignInput.supplies[i].name },
            { $set: { quantity: quantity - assignInput.supplies[i].quantity } },
            { returnDocument: 'after' })
          // Send emails to notify
          if (updatedSupply.quantity < 10) {
            await sendMailsToSocialWorkers(updatedSupply.name)
          }
          updatedSupplies.push(updatedSupply)
        }
      } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: 'No existe ese suministro creado.' })
      }
    }
    // Make report
    const report = {
      room: numberRoom,
      assignedSupplies: assignInput.supplies,
      assignDate: new Date().toLocaleDateString('es-ES')
    }
    await collectionReportsRoomSupplies.insertOne(report)
    return res.status(200).json({ msg: 'Los suministros han sido asignados correctamente.' })
  } catch (error) {
    console.log(error)
  }
}
export const getReports = async (req, res) => {
  try {
    const startDate = req.body.fechaInicial
    const endDate = req.body.fechaFinal

    if (!startDate || !endDate) {
      return res.status(400).json({ msg: 'Start date and end date are required' })
    }

    // Convertir las fechas a objetos Date
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Formatear las fechas en el formato DD/MM/YYYY
    const formattedStartDate = `${String(start.getDay())}/${String(start.getMonth() + 1)}/${start.getFullYear()}`
    const formattedEndDate = `${String(end.getDay())}/${String(end.getMonth() + 1)}/${end.getFullYear()}`

    const reports = await reportsSupplies.getReports(formattedStartDate, formattedEndDate)

    return res.status(200).json(reports)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'Error retrieving reports' })
  }
}
export const getRoomsReports = async (req, res) => {
  try {
    const startDate = req.body.fechaInicial
    const endDate = req.body.fechaFinal

    if (!startDate || !endDate) {
      return res.status(400).json({ msg: 'Start date and end date are required' })
    }

    // Convertir las fechas a objetos Date
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Formatear las fechas en el formato DD/MM/YYYY
    const formattedStartDate = `${String(start.getDate()).padStart(2, '0')}/${String(start.getMonth() + 1).padStart(2, '0')}/${start.getFullYear()}`
    const formattedEndDate = `${String(end.getDate()).padStart(2, '0')}/${String(end.getMonth() + 1).padStart(2, '0')}/${end.getFullYear()}`

    console.log(formattedEndDate, formattedStartDate) // Imprimir las fechas formateadas

    const reports = await reportsSupplies.getRoomsReports(formattedStartDate, formattedEndDate)

    return res.status(200).json(reports)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'Error retrieving reports' })
  }
}

// Helpers
const sendMailsToSocialWorkers = async (supply) => {
  const allSocialWorkers = await socialWorkers.getSocialWorkers()
  for (let i = 0; i < allSocialWorkers.length; i++) {
    sendSupplyShortageNotification(allSocialWorkers[i].email, supply)
  }
}
