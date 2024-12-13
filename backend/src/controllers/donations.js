import { campaigns, collectionCampaigns } from '../models/campaigns.js'
import { donations, collectionDonations } from '../models/donations.js'
import { validateCampaign } from '../schemas/createCampaign.js'
import { beneficiaries } from '../models/beneficiaries.js'
import { collectionReportDonations, reportDonations } from '../models/reportsDonations.js'
import { validateAssignDonations } from '../schemas/assignDonations.js'
import { sendMailToBeneficiary } from '../config/nodemailer.js'
import { validateBeneficiary } from '../schemas/createBeneficiary.js'

export const getCampaigns = async (req, res) => {
  try {
    const getDonations = await donations.getCampaigns()
    const { _id, ...others } = getDonations
    return res.status(200).json(others)
  } catch (error) {
    console.log(error)
  }
}

export const getDonations = async (req, res) => {
  try {
    const getDonations = await donations.getDonations()
    const { _id, ...others } = getDonations
    return res.status(200).json(others)
  } catch (error) {
    console.log(error)
  }
}

// ---------------------------- CODIGO MOSTRAR CAMPANAS --------------------------
export const getCampaignsByDate = async (req, res) => {
  try {
    const { date } = req.query

    if (!date) {
      console.log('Error: No se proporcionó la fecha.')
      return res.status(400).json({ error: 'No se proporcionó la fecha' })
    }

    const transformedDate = date.replace(/\/0(\d)\//, '/$1/')

    const campaignsFound = await campaigns.getCampaigns(transformedDate)
    return res.status(200).json(campaignsFound)
  } catch (error) {
    console.error('Error al obtener campañas:', error.message)
    return res.status(500).json({ error: 'Error al obtener campañas' })
  }
}

export const createCampaign = async (req, res) => {
  try {
    const campaignInput = validateCampaign(req.body)
    // If return Zod issues send back them with 400 status
    if (Object.keys(campaignInput).includes('issues')) {
      return res.status(400).json(campaignInput.errors)
    }
    // Verify if name field is empty
    if (Object.values(campaignInput)[0] === '') {
      return res.status(400).json({ msg: 'Completa el campo nombre.' })
    }
    const items = campaignInput.items
    if (items.length === 0) {
      return res.status(400).json({ msg: 'Necesitas añadir al menos un item.' })
    }
    items.forEach(async item => {
      const donationExist = await collectionDonations.findOne({ name: item.name })
      if (donationExist) {
        const { quantity } = donationExist
        await collectionDonations.findOneAndUpdate({ name: item.name }, { $set: { quantity: quantity + item.quantity } })
      } else {
        await collectionDonations.insertOne(item)
      }
    })
    await collectionCampaigns.insertOne(campaignInput)
    return res.status(200).json(campaignInput)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'Internal Server Error' })
  }
}

export const verifyCedula = async (req, res) => {
  const { cedula } = req.body

  if (!cedula || typeof cedula !== 'string' || cedula.trim().length === 0) {
    return res.status(400).json({ msg: 'La cédula es obligatoria y debe ser válida' })
  }

  try {
    const beneficiary = await beneficiaries.verifyBeneficiaryByCedula(cedula)

    if (beneficiary) {
      return res.status(200).json({
        found: true,
        beneficiary: {
          nombre: beneficiary.nombre,
          apellido: beneficiary.apellido,
          email: beneficiary.email,
          telefono: beneficiary.telefono
        }
      })
    } else {
      return res.status(404).json({ found: false, msg: 'Beneficiario no encontrado' })
    }
  } catch (error) {
    console.error('Error interno del servidor:', error)
    return res.status(500).json({ msg: 'Error interno del servidor', error: error.message })
  }
}

export const createBeneficiary = async (req, res) => {
  const { cedula, nombre, apellido, email, telefono } = req.body

  if (!cedula || !nombre || !apellido || !email || !telefono) {
    return res.status(400).json({ msg: 'Todos los campos son obligatorios' })
  }

  try {
    const existingBeneficiary = await beneficiaries.verifyBeneficiaryByCedula(cedula)
    if (existingBeneficiary) {
      return res.status(400).json({ msg: 'El beneficiario ya existe' })
    }
    const inputBeneficiary = validateBeneficiary(req.body)
    console.log(inputBeneficiary)
    if (Object.keys(inputBeneficiary).includes('issues')) {
      return res.status(400).json({ errors: inputBeneficiary.issues })
    }
    const newBeneficiary = await beneficiaries.createBeneficiary({ cedula, nombre, apellido, email, telefono })
    return res.status(201).json({ msg: 'Beneficiario creado exitosamente', beneficiary: newBeneficiary })
  } catch (error) {
    console.error('Error al crear el beneficiario:', error)
    return res.status(500).json({ msg: 'Error al crear el beneficiario', error: error.message })
  }
}

export const updateBeneficiary = async (req, res) => {
  const { cedula, nombre, apellido, email, telefono } = req.body

  if (!cedula) {
    return res.status(400).json({ msg: 'La cédula es obligatoria' })
  }

  try {
    const existingBeneficiary = await beneficiaries.verifyBeneficiaryByCedula(cedula)
    if (!existingBeneficiary) {
      return res.status(404).json({ msg: 'Beneficiario no encontrado' })
    }

    const updatedData = {
      ...(nombre && { nombre }),
      ...(apellido && { apellido }),
      ...(email && { email }),
      ...(telefono && { telefono })
    }

    await beneficiaries.updateBeneficiaryByCedula(cedula, updatedData)

    return res.status(200).json({ msg: 'Beneficiario actualizado exitosamente', updatedData })
  } catch (error) {
    console.error('Error al actualizar el beneficiario:', error)
    return res.status(500).json({ msg: 'Error al actualizar el beneficiario', error: error.message })
  }
}

export const assignBeneficiary = async (req, res) => {
  try {
    const donationsInput = validateAssignDonations(req.body)
    if (Object.keys(donationsInput).includes('issues')) {
      return res.status(400).json({ errors: donationsInput.issues })
    }
    const beneficiary = await beneficiaries.verifyBeneficiaryByCedula(donationsInput.ci)
    if (!beneficiary) {
      return res.status(400).json({ msg: 'Beneficiario no existente.' })
    }
    const updatedDonations = []
    if (donationsInput.items.length < 1) {
      return res.status(400).json({ msg: 'No se han seleccionado items.' })
    }
    // Check if existences exists
    for (let i = 0; i < donationsInput.items.length; i++) {
      try {
        const { quantity } = await collectionDonations.findOne({ name: donationsInput.items[i].name })
        if (quantity < donationsInput.items[i].quantity) {
          return res.status(400).json({ msg: 'No hay suficientes existencias.' })
        } else {
          const updatedDonation = await collectionDonations.findOneAndUpdate(
            { name: donationsInput.items[i].name },
            { $set: { quantity: quantity - donationsInput.items[i].quantity } },
            { returnDocument: 'after' })
          updatedDonations.push(updatedDonation)
        }
      } catch (error) {
        console.log(error)
        return res.status(400).json({ msg: 'La donacion o las donaciones no existen.' })
      }
    }
    sendMailToBeneficiary(beneficiary.email, donationsInput.items)
    // Make report
    const report = {
      ci: donationsInput.ci,
      name: beneficiary.nombre,
      lastname: beneficiary.apellido,
      assignedDonations: donationsInput.items,
      assignDate: new Date().toLocaleDateString('es-ES')
    }
    await collectionReportDonations.insertOne(report)
    return res.status(200).json(report)
  } catch (error) {
    console.log(error)
  }
}
export const getReports = async (req, res) => {
  try {
    const startDate = req.body.fechaInicial
    const endDate = req.body.fechaFinal

    if (!startDate || !endDate) {
      return res.status(400).json({ msg: 'La fecha inicial y la fecha final son requeridas.' })
    }

    // Convertir las fechas a objetos Date
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Formatear las fechas en el formato DD/MM/YYYY
    const formattedStartDate = `${String(start.getDate()).padStart(2, '0')}/${String(start.getMonth() + 1).padStart(2, '0')}/${start.getFullYear()}`
    const formattedEndDate = `${String(end.getDate()).padStart(2, '0')}/${String(end.getMonth() + 1).padStart(2, '0')}/${end.getFullYear()}`

    console.log(formattedEndDate, formattedStartDate) // Imprimir las fechas formateadas

    const reports = await reportDonations.getReports(formattedStartDate, formattedEndDate)

    return res.status(200).json(reports)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'Error retrieving reports' })
  }
}

export const getCampaignsReports = async (req, res) => {
  try {
    const startDate = req.body.fechaInicial
    const endDate = req.body.fechaFinal

    if (!startDate || !endDate) {
      return res.status(400).json({ msg: 'La fecha inicial y la fecha final son requeridas.' })
    }

    // Convertir las fechas a objetos Date
    const start = new Date(startDate)
    const end = new Date(endDate)

    // Formatear las fechas en el formato DD/MM/YYYY
    const formattedStartDate = `${String(start.getDate()).padStart(2, '0')}/${String(start.getMonth() + 1).padStart(2, '0')}/${start.getFullYear()}`
    const formattedEndDate = `${String(end.getDate()).padStart(2, '0')}/${String(end.getMonth() + 1).padStart(2, '0')}/${end.getFullYear()}`

    console.log(formattedEndDate, formattedStartDate) // Imprimir las fechas formateadas

    const reports = await campaigns.getReports(formattedStartDate, formattedEndDate)

    return res.status(200).json(reports)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ msg: 'Ha ocurrido un error obteniendo los reportes.' })
  }
}
