import { connectDB } from '../database.js'

export const db = await connectDB()
const collectionAdmin = db.collection('Administrators')
const collectionPatients = db.collection('Patients')
export const collectionRooms = db.collection('Rooms2')
export const collectionReports = db.collection('RoomsReport')

export const administrators = {
  async login (email, password) {
    try {
      const administrator = await collectionAdmin.findOne({ email, password })
      return administrator
    } catch (error) {
      console.log(error.message)
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
  },
  async verifyRoom (hNumber) {
    try {
      const verifyRoom = await collectionRooms.findOne({ h_number: hNumber })
      return verifyRoom
    } catch (error) {
      console.log(error)
    }
  }
}

// Manage Rooms

export const manageRooms = {
  async getAllRooms () {
    try {
      const roomsData = await collectionRooms.find({}).toArray()
      return roomsData
    } catch (error) {
      console.log(error)
    }
  },
  async createRoom (room) {
    try {
      const newRoom = await collectionRooms.insertOne(room)
      return newRoom
    } catch (error) {
      console.log(error)
    }
  },
  async deleteRoom (hNumber) {
    try {
      const deletedRoom = await collectionRooms.findOneAndDelete({ h_number: hNumber })
      return deletedRoom
    } catch (error) {
      console.log(error)
    }
  }
}

// Manage Patients
export const managePatients = {
  async createPatient (patient) {
    try {
      const newPatient = await collectionPatients.insertOne(patient)
      return newPatient
    } catch (error) {
      console.log(error)
    }
  },
  async updatePatientState (ci, state) {
    try {
      const updatedPatient = await collectionPatients.findOneAndUpdate({ ci }, { $set: { state } })
      return updatedPatient
    } catch (error) {
      console.log(error)
    }
  },
  async getPatientByCi (ci) {
    try {
      const patient = await collectionPatients.findOne({ ci })
      return patient
    } catch (error) {
      console.log(error)
    }
  },
  async getPatientState (ci) {
    try {
      const patient = await collectionPatients.findOne({ ci })
      return patient.state
    } catch (error) {
      console.log(error)
    }
  }
}

// Manage Reports
export const manageReports = {
  async createReport (report) {
    try {
      const newReport = await collectionReports.insertOne(report)
      return newReport
    } catch (error) {
      console.log(error)
    }
  },
  async getAllReports () {
    try {
      const reportsData = await collectionReports.find({}).toArray()
      return reportsData
    } catch (error) {
      console.log(error)
    }
  },
  async getReports (initialDate, finalDate) {
    try {
      const reportsData = await collectionReports.find({ departureDate: { $gte: initialDate, $lte: finalDate } }).toArray()
      return reportsData
    } catch (error) {
      console.log(error)
    }
  }
}
