import { administrators, manageRooms } from '../models/administrators.js'
import { validateLogin } from '../schemas/login.js'
import { validateRegisterInRoom } from '../schemas/registerInRoom.js'
import { validateRoom } from '../schemas/rooms.js'
// import { validateRegisterPatient } from '../schemas/registerPatient.js'
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
    if (!administratorLogin) {
      return res.status(401).json({ msg: 'Wrong email or password' })
    }
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
  } catch (error) {
    console.log(error)
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
const registerAdministrator = async (req,res) => {
  // const {
  //   nombre_usuario,
  //   password,
  //   email
  // } = req.body

  // if (Object.values(req.body).includes('')) { return res.status(400).json({ msg: 'Lo sentimos, debes llenar todos los campos' }) }
  // const verificarNombreUsuario = await Administradores.findOne({nombre_usuario})
  // if(verificarNombreUsuario) {return res.status(400).json({msg:"Lo sentimos, el nombre de usuario ya existe"})}

  // const verificarEmail = await Administradores.findOne({email})
  // if(verificarEmail) {return res.status(400).json({msg:"Lo sentimos, el email ya existe"})}
  
  // const admin = new Administradores({
  //     nombre_usuario,
  //     password,
  //     email
  // })

  // admin.password = await admin.encrypPassword(password)
  // const token = admin.crearToken()
  // await admin.save()
  // sendMailToAdmin(email,token)

  // res.status(200).json({res:'Registro exitoso, se ha enviado un correo electrónico al administrador.'})
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
    const patient = validateRegisterInRoom(req.body)
    console.log(patient)
    if (!patient.h_number || !patient.name) {
      return res.status(401).json({ msg: 'Neccesary name and room' })
    }

    const validAdmissionDate = validateDate(patient.admissionDate)
    if (!validAdmissionDate) {
      return res.status(401).json({ msg: 'Invalid admission date' })
    }
    await administrators.registerInRoom(patient)
    return res.status(200).json({ msg: 'Patient registered' })
  } catch (error) {
    console.log(error)
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
    console.log(roomData)
    roomData.name = '---'
    roomData.ci = '---'
    roomData.condition = '---'
    roomData.food = '---'
    roomData.admissionDate = '--/---/----'
    roomData.departureDate = '--/---/----'
    const { _id, departureDate, ...others } = roomData

    await administrators.setParamsinBlank(roomData)
    return res.status(200).json(others)
  } catch (error) {
    console.log(error)
  }
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

export const generateReport = async (req, res) => {
  try {
    const hNumber = parseInt(req.params.hNumber)
    const roomData = await administrators.getDataRoom(hNumber)
    console.log(roomData)
    return res.status(200).json(roomData)
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
    console.log(rooms.length)
    return res.status(200).json(rooms.length)
  } catch (error) {
    console.log(error)
  }
}
