import { Router } from 'express'
import { authLogin } from '../middlewares/authLogin.js'
import { updatePassword } from '../controllers/socialWorkers.js'

export const routerSocialWorkers = Router()

routerSocialWorkers.post('/update-password', authLogin, updatePassword)
