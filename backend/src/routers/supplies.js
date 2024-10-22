import { Router } from 'express'
import { getSupplies, suppliesRegister, assignSupplies } from '../controllers/supplies.js'
import { authLogin } from '../middlewares/authLogin.js'

export const routerSupplies = Router()

routerSupplies.get('/test', (req, res) => res.send('test'))
routerSupplies.post('/register-supplies', authLogin, suppliesRegister)
routerSupplies.get('/all-supplies', authLogin, getSupplies)
routerSupplies.post('/assign-supplies', authLogin, assignSupplies)
