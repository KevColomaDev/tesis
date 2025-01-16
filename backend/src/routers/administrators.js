import { Router } from 'express'
import { login, registerInRoom, getDataRoom, setParamsinBlank, dietData, logout, verifyToken, createRoom, getRooms, deleteRoom, registerSocialWorker, deleteSocialWorker, getSocialWorkers, createPatient, getPatientByCi, getPatientState, updatePatientState, getReports, getRole, getListRooms } from '../controllers/administrators.js'
import { authLogin } from '../middlewares/authLogin.js'

export const router = Router()

router.post('/login', login)
router.get('/role', authLogin, getRole)
router.post('/new-social-worker', authLogin, registerSocialWorker)
router.delete('/social-worker/:id', authLogin, deleteSocialWorker)
router.get('/test', authLogin, (req, res) => res.send('test'))
// router.post('/register-patient', authLogin, registerPatient)
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
router.get('/list-rooms', authLogin, getListRooms)

// Manage patients
router.post('/create-patient', authLogin, createPatient)
router.get('/patient/:ci', authLogin, getPatientByCi)
router.get('/patient-state/:ci', authLogin, getPatientState)
router.put('/update-patient-state/:ci', authLogin, updatePatientState)

// Social Workers
router.get('/social-workers', authLogin, getSocialWorkers)
router.post('/new-social-worker', authLogin, registerSocialWorker)
router.delete('/social-worker/:id', authLogin, deleteSocialWorker)

router.post('/reports', authLogin, getReports)
