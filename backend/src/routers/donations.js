import { Router } from 'express'
import { authLogin } from '../middlewares/authLogin.js'
import { assignBeneficiary, createCampaign, getCampaigns, getDonations } from '../controllers/donations.js'

export const routerDonations = Router()

routerDonations.get('/test', (req, res) => res.send('test'))
routerDonations.get('/', authLogin, getDonations)
routerDonations.get('/campaigns', authLogin, getCampaigns)
routerDonations.post('/new-campaign', authLogin, createCampaign)
routerDonations.post('/assign-beneficiary', authLogin, assignBeneficiary)
