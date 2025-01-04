import { administrators, manageRooms, managePatients, manageReports } from '../models/administrators.js'
import { validateLogin } from '../schemas/login.js'
import { validateRegisterInRoom } from '../schemas/registerInRoom.js'
import { validateRoom } from '../schemas/rooms.js'
import { validateRegisterPatient } from '../schemas/registerPatient.js'
import { validateReport } from '../schemas/roomsReport.js'
import jwt from 'jsonwebtoken'
import { validateSocialWorker } from '../schemas/registerSocialWorker.js'
import { collectionSocialWorkers, socialWorkers } from '../models/socialWorkers.js'
import { sendMailToSocialWorker } from '../config/nodemailer.js'
import mongoose from 'mongoose'

export const login = async (req, res) => {
  try {
    const administrator = validateLogin(req.body)
    if (!administrator.email || !administrator.password || administrator.email === '' || administrator.password === '') {
      return res.status(401).json({ msg: 'Neccesary email and password' })
    }
    const administratorLogin = await administrators.login(administrator.email, administrator.password)
    let socialWorkersLogin = {}
    if (!administratorLogin) {
      socialWorkersLogin = await socialWorkers.login(administrator.email, administrator.password)
      if (!socialWorkersLogin) {
        return res.status(401).json({ msg: 'Wrong email or password' })
      }
      const token = jwt.sign({ socialWorkersLogin }, process.env.JWT_SECRET)
      console.log(token)
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        partitioned: true
      })

      const { _id, password, ...others } = socialWorkersLogin
      return res.status(200).json({ socialWorkersLogin: others })
    } else {
      const token = jwt.sign({ administratorLogin }, process.env.JWT_SECRET)
      console.log(token)
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        partitioned: true
      })

      const { _id, password, ...others } = administratorLogin
      return res.status(200).json({ administratorLogin: others })
    }
  } catch (error) {
    console.log(error)
  }
}
export const getRole = async (req, res) => {
  try {
    const role = req.user
    return res.status(200).json(role)
  } catch (error) {
    return res.status(500).json(error)
  }
}
export const getSocialWorkers = async (req, res) => {
  const allSocialWorkers = await socialWorkers.getSocialWorkers()
  return res.status(200).json(allSocialWorkers)
}
export const registerSocialWorker = async (req, res) => {
  const socialWorkerValidation = validateSocialWorker(req.body)
  if (Object.keys(socialWorkerValidation).includes('issues')) {
    return res.status(400).json(socialWorkerValidation.errors)
  }
  // Verify if CI exists
  const ci = await collectionSocialWorkers.findOne({ ci: socialWorkerValidation.ci })
  if (ci) { return res.status(400).json({ msg: 'CI already exists' }) }
  // Verify if email exists
  const verifyEmail = await collectionSocialWorkers.findOne({ email: socialWorkerValidation.email })
  if (verifyEmail) { return res.status(400).json({ msg: 'Email already exists' }) }
  const password = Math.random().toString(36).slice(-8)
  const encryptPassword = await socialWorkers.encryptPassword(password)
  socialWorkerValidation.password = encryptPassword
  await collectionSocialWorkers.insertOne(socialWorkerValidation)
  const token = await socialWorkers.createToken(socialWorkerValidation.ci)

  sendMailToSocialWorker(socialWorkerValidation.email, password, token)

  res.status(200).json({ msg: 'An email was sent to the social worker.' })
}
export const deleteSocialWorker = async (req, res) => {
  const { id } = req.params
  if (!mongoose.isValidObjectId(id)) { return res.status(400).json({ msg: 'Not valid ID' }) }
  try {
    const deletedSocialWorker = await collectionSocialWorkers.findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) })
    if (!deletedSocialWorker) {
      return res.status(400).json({ msg: 'Social Worker doesnt exists.' })
    }
    return res.status(200).json({ msg: 'Social Worker deleted successfully.' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: error.message })
  }
}

/*
export const registerPatient = async (req, res) => {
  const validateDate = (date) => {
    let regex = /^\d{1}\/\d{1}\/\d{4}$/
    if (regex.test(date)) {
      return date
    } else {
      regex = /^\d{2}\/\d{2}\/\d{4}$/
      if (regex.test(date)) {
        return date
      }
    }
  }

  try {
    const patient = validateRegisterPatient(req.body)
    console.log(patient)
    if (!patient.name || !patient.habitation) {
      return res.status(401).json({ msg: 'Neccesary name and habitation' })
    }
    const validAdmissionDate = validateDate(patient.admissionDate)
    // const validDepartureDate = validateDate(patient.departureDate)

    if (!validAdmissionDate) {
      return res.status(401).json({ msg: 'Invalid admission date' })
    }

    await administrators.registerPatient(patient)
    return res.status(200).json({ msg: 'Patient registered' })
  } catch (error) {
    console.log(error)
  }
}
*/

export const registerInRoom = async (req, res) => {
  const validateDate = (date) => {
    const regex = /^(0?[1-9]|[12][0-9]|3[01])\/(0?[1-9]|1[0-2])\/\d{4}$/
    return regex.test(date) ? date : null
  }

  try {
    const patient = validateRegisterInRoom(req.body)
    console.log(patient)

    if (!patient.h_number || !patient.name) {
      return res.status(401).json({ msg: 'Neccesary name and room' })
    }

    const validAdmissionDate = validateDate(patient.admissionDate)
    if (!validAdmissionDate) {
      return res.status(401).json({ msg: 'Invalid admission date' })
    }

    const currentDate = new Date()
    const currentAdmissionDate = currentDate.toLocaleDateString('es-ES')
    console.log(currentAdmissionDate)

    if (currentAdmissionDate !== patient.admissionDate) {
      return res.status(401).json({ msg: 'Invalid admission date' })
    }

    await administrators.registerInRoom(patient)
    return res.status(200).json({ msg: 'Patient registered' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'Internal server error' })
  }
}

export const getDataRoom = async (req, res) => {
  try {
    const hNumber = parseInt(req.params.hNumber)
    const roomData = await administrators.getDataRoom(hNumber)
    console.log(roomData)
    return res.status(200).json(roomData)
  } catch (error) {
    console.log(error)
  }
}

export const setParamsinBlank = async (req, res) => {
  try {
    const hNumber = parseInt(req.params.hNumber)
    const roomData = await administrators.getDataRoom(hNumber)

    // Obtener la fecha y hora actuales
    const currentDate = new Date()
    const date = formatDate(currentDate)
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    // Asignar la fecha y hora al objeto roomData
    roomData.departureDate = date
    roomData.departureTime = time

    console.log(roomData)

    const reportData = {
      h_number: roomData.h_number,
      name: roomData.name,
      ci: roomData.ci,
      condition: roomData.condition,
      food: roomData.food,
      admissionDate: roomData.admissionDate,
      admissionTime: roomData.admissionTime,
      departureDate: roomData.departureDate,
      departureTime: roomData.departureTime,
      observations: roomData.observations
    }

    const report = await manageReports.createReport(reportData)
    console.log(report)

    await managePatients.updatePatientState(roomData.ci, false)

    // Limpiar los datos del paciente
    roomData.name = '---'
    roomData.ci = '---'
    roomData.condition = '---'
    roomData.food = '---'
    roomData.admissionDate = '--/---/----'
    roomData.departureDate = '--/---/----'
    roomData.admissionTime = '--:--'
    roomData.departureTime = '--:--'
    roomData.observations = ''

    const { _id, departureDate, ...others } = roomData

    await administrators.setParamsinBlank(roomData)
    return res.status(200).json(others)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'Error processing request' })
  }
}

// Función para formatear la fecha
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0') // Asegura que el día tenga dos dígitos
  const month = String(date.getMonth() + 1).padStart(2, '0') // Asegura que el mes tenga dos dígitos (los meses son 0-indexados)
  const year = date.getFullYear()

  return `${day}/${month}/${year}` // Formato DD/MM/YYYY
}

export const dietData = async (req, res) => {
  try {
    const allRooms = await administrators.getAllRooms()
    const totalRooms = allRooms.length
    let availableRooms = 0
    let normalDiet = 0
    let blandDiet = 0
    let liquidDiet = 0
    for (let i = 0; i < totalRooms; i++) {
      const room = allRooms[i]
      if (room.name === '---') {
        availableRooms += 1
      }
      if (room.food === 'Blanda') {
        blandDiet += 1
      }
      if (room.food === 'Normal') {
        normalDiet += 1
      }
      if (room.food === 'Liquida') {
        liquidDiet += 1
      }
    }
    // console.log(availableRooms)
    return res.status(200).json({ availableRooms, normalDiet, blandDiet, liquidDiet })
  } catch (error) {
    console.log(error)
  }
}

export const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    partitioned: true
  })
  return res.status(200).json({ msg: 'Logged out' })
}

export const verifyToken = async (req, res) => {
  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({ msg: 'Unauthorized' })
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    return res.status(200).json({ msg: 'Authorized' })
  } catch (error) {
    console.log(error)
  }
}

// Manage Rooms

export const createRoom = async (req, res) => {
  try {
    const room = validateRoom(req.body)
    const roomExists = await administrators.verifyRoom(room.h_number)
    if (roomExists) {
      return res.status(401).json({ msg: 'Room already exists' })
    }
    await manageRooms.createRoom(room)
    return res.status(200).json({ msg: 'Room created' })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'Internal server error' })
  }
}

export const deleteRoom = async (req, res) => {
  try {
    const hNumber = parseInt(req.params.hNumber)
    await manageRooms.deleteRoom(hNumber)
    return res.status(200).json({ msg: 'Room deleted' })
  } catch (error) {
    console.log(error)
  }
}

export const getRooms = async (req, res) => {
  try {
    const rooms = await manageRooms.getAllRooms()
    return res.status(200).json(rooms.length)
  } catch (error) {
    console.log(error)
  }
}

// Manage Patients

export const createPatient = async (req, res) => {
  try {
    const patient = validateRegisterPatient(req.body)
    console.log(patient)
    if (!patient.ci || !patient.name) {
      return res.status(400).json({ msg: 'Neccesary name and ci' })
    }
    const patientExists = await managePatients.getPatientByCi(patient.ci)
    console.log('El paciente existe?')
    console.log(patientExists)
    if (patientExists === null) {
      await managePatients.createPatient(patient)
      return res.status(200).json({ msg: 'Patient created' })
    }
    if (patientExists) {
      if (patientExists.state === true) {
        return res.status(400).json({ msg: 'Patient already admitted' })
      } else {
        await managePatients.updatePatientState(patient.ci, true)
        return res.status(200).json({ msg: 'Patient state updated' })
      }
    }
    await managePatients.createPatient(patient)
    return res.status(200).json({ msg: 'Patient created' })
  } catch (error) {
    console.log(error)
  }
}
export const getPatientByCi = async (req, res) => {
  try {
    const ci = req.params.ci
    const patient = await managePatients.getPatientByCi(ci)
    if (!patient) {
      console.log('Patient not found')
      return res.status(404).json({ msg: 'Patient not found' })
    }
    if (patient.state === true) {
      return res.status(401).json({ msg: 'Patient already admitted' })
    }
    const { _id, ...others } = patient
    return res.status(200).json(others)
  } catch (error) {
    console.log(error)
  }
}

export const getPatientState = async (req, res) => {
  try {
    const ci = req.params.ci
    const state = await managePatients.getPatientState(ci)
    console.log(state)
    return res.status(200).json(state)
  } catch (error) {
    console.log(error)
  }
}

export const updatePatientState = async (req, res) => {
  try {
    const ci = req.params.ci
    console.log(ci)
    const state = req.body.state
    await managePatients.updatePatientState(ci, state)
    await managePatients.getPatientState(ci)
    return res.status(200).json({ msg: 'Patient state updated', state })
  } catch (error) {
    console.log(error)
  }
}

// Manage Reports

export const createReport = async (req, res) => {
  try {
    const report = validateReport(req.body)
    await manageReports.createReport(report)
    return res.status(200).json({ msg: 'Report created' })
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
    const formattedStartDate = `${String(start.getDate()).padStart(2, '0')}/${String(start.getMonth() + 1).padStart(2, '0')}/${start.getFullYear()}`
    const formattedEndDate = `${String(end.getDate()).padStart(2, '0')}/${String(end.getMonth() + 1).padStart(2, '0')}/${end.getFullYear()}`

    console.log(formattedEndDate, formattedStartDate) // Imprimir las fechas formateadas

    const reports = await manageReports.getReports(formattedStartDate, formattedEndDate)

    return res.status(200).json(reports)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'Error retrieving reports' })
  }
}
