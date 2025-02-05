import { Router } from 'express'
import { authLogin } from '../middlewares/authLogin.js'
import { createCampaign, getCampaigns, getDonations, verifyCedula, createBeneficiary, updateBeneficiary, assignBeneficiary, getReports, getCampaignsReports, getCampaignsByDate  } from '../controllers/donations.js'

export const routerDonations = Router()

routerDonations.get('/test', (req, res) => res.send('test'))
routerDonations.get('/', authLogin, getDonations)
routerDonations.get('/campaigns', authLogin, getCampaigns)
routerDonations.post('/new-campaign', authLogin, createCampaign)
routerDonations.post('/verify', authLogin, verifyCedula)
routerDonations.post('/create-beneficiary', authLogin, createBeneficiary)
routerDonations.put('/update-beneficiary', authLogin, updateBeneficiary)
routerDonations.put('/assign-donations', authLogin, assignBeneficiary)

// Manage Reports
routerDonations.post('/reports', authLogin, getReports)
routerDonations.post('/campaigns-reports', authLogin, getCampaignsReports)

// MOSTRAR CAMPA;AS
routerDonations.get('/campaigns-by-date', authLogin, getCampaignsByDate);