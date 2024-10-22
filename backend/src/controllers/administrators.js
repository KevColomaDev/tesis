import { administrators } from '../models/administrators.js'
import { validateLogin } from '../schemas/login.js'
import { validateRegisterInRoom } from '../schemas/registerInRoom.js'
// import { validateRegisterPatient } from '../schemas/registerPatient.js'
import jwt from 'jsonwebtoken'

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
