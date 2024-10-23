import { Router } from 'express'
import { getSupplies, assignSupplies, createSupply, addStock, deleteSupply } from '../controllers/supplies.js'
import { authLogin } from '../middlewares/authLogin.js'

export const routerSupplies = Router()

routerSupplies.get('/test', (req, res) => res.send('test'))
routerSupplies.get('/', authLogin, getSupplies)
routerSupplies.post('/new-supply', authLogin, createSupply)
routerSupplies.delete('/:id', authLogin, deleteSupply)
routerSupplies.put('/add-stock/:id', authLogin, addStock)
routerSupplies.post('/assign-supplies', authLogin, assignSupplies)
