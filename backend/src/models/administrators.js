import { connectDB } from '../database.js'

export const db = await connectDB()
const collectionAdmin = db.collection('Administrators')
const collectionPatients = db.collection('Patients')
export const collectionRooms = db.collection('Rooms')

export const administrators = {
  async login (email, password) {
    try {
      const administrator = await collectionAdmin.findOne({ email, password })
      return administrator
    } catch (error) {
      console.log(error.message)
    }
  },
  async registerPatient (patient) {
    try {
      const newPatient = await collectionPatients.insertOne(patient)
      return newPatient
    } catch (error) {
      console.log(error)
    }
  },
  async registerInRoom (patient) {
    try {
      const foundRoom = await collectionRooms.findOneAndReplace({ h_number: patient.h_number }, patient)
      return foundRoom
    } catch (error) {
      console.log(error)
    }
  },
  async getDataRoom (hNumber) {
    try {
      const roomData = await collectionRooms.findOne({ h_number: hNumber })
      return roomData
    } catch (error) {
      console.log(error)
    }
  },
  async setParamsinBlank (dataBlank) {
    try {
      const roomData = await collectionRooms.findOneAndUpdate({ h_number: dataBlank.h_number }, { $set: dataBlank })
      return roomData
    } catch (error) {
      console.log(error)
    }
  },
  async getAllRooms () {
    try {
      const roomsData = await collectionRooms.find({}).toArray()
      return roomsData
    } catch (error) {
      console.log(error)
    }
  }
}
