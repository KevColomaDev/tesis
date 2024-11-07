import { Router } from 'express'
import { login, registerInRoom, getDataRoom, setParamsinBlank, dietData, logout, verifyToken, generateReport, createRoom, getRooms, deleteRoom, registerSocialWorker, deleteSocialWorker, getSocialWorkers } from '../controllers/administrators.js'
import { authLogin } from '../middlewares/authLogin.js'

export const router = Router()

router.post('/login', login)
router.get('/test', authLogin, (req, res) => res.send('test'))
// router.post('/register-patient', authLogin, registerPatient)
router.post('/register-in-room', authLogin, registerInRoom)
router.get('/data-room/:hNumber', authLogin, getDataRoom)
router.get('/set-params-in-blank/:hNumber', authLogin, setParamsinBlank)
router.get('/diet-data', authLogin, dietData)
router.get('/logout', authLogin, logout)
router.get('/verify', verifyToken)
router.get('/generate-report/:hNumber', authLogin, generateReport)

// Manage rooms
router.post('/create-room', authLogin, createRoom)
router.get('/rooms', authLogin, getRooms)
router.delete('/delete-room/:hNumber', authLogin, deleteRoom)

// Social Workers
router.get('/social-workers', authLogin, getSocialWorkers)
router.post('/new-social-worker', authLogin, registerSocialWorker)
router.delete('/social-worker/:id', authLogin, deleteSocialWorker)
