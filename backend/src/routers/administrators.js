import { Router } from 'express'
import { login, registerInRoom, getDataRoom, setParamsinBlank, dietData, logout, verifyToken, createRoom, getRooms, deleteRoom, createPatient, getPatientByCi, getPatientState, updatePatientState, getReports } from '../controllers/administrators.js'
import { authLogin } from '../middlewares/authLogin.js'

export const router = Router()

router.post('/login', login)
router.get('/test', authLogin, (req, res) => res.send('test'))
router.post('/register-in-room', authLogin, registerInRoom)
router.get('/data-room/:hNumber', authLogin, getDataRoom)
router.get('/set-params-in-blank/:hNumber', authLogin, setParamsinBlank)
router.get('/diet-data', authLogin, dietData)
router.get('/logout', authLogin, logout)
router.get('/verify', verifyToken)

// Manage rooms
router.post('/create-room', authLogin, createRoom)
router.get('/rooms', authLogin, getRooms)
router.delete('/delete-room/:hNumber', authLogin, deleteRoom)

// Manage patients
router.post('/create-patient', authLogin, createPatient)
router.get('/patient/:ci', authLogin, getPatientByCi)
router.get('/patient-state/:ci', authLogin, getPatientState)
router.put('/update-patient-state/:ci', authLogin, updatePatientState)

// Manage Reports

router.post('/reports', authLogin, getReports)
