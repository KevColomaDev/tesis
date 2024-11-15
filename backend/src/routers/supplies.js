import { Router } from 'express'
import { getSupplies, assignSupplies, createSupply, addStock, deleteSupply, getReports, getRoomsReports } from '../controllers/supplies.js'
import { authLogin } from '../middlewares/authLogin.js'

export const routerSupplies = Router()

routerSupplies.get('/test', (req, res) => res.send('test'))
routerSupplies.get('/', authLogin, getSupplies)
routerSupplies.post('/new-supply', authLogin, createSupply)
routerSupplies.delete('/:id', authLogin, deleteSupply)
routerSupplies.put('/add-stock/:name', authLogin, addStock)
routerSupplies.post('/assign/:room', authLogin, assignSupplies)

// Manage Reports
routerSupplies.post('/reports', authLogin, getReports)
routerSupplies.post('/rooms-reports', authLogin, getRoomsReports)
