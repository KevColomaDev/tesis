import e from 'express'
import { router } from './routers/administrators.js'
import { routerSupplies } from './routers/supplies.js'
import { routerDonations } from './routers/donations.js'
import { routerSocialWorkers } from './routers/socialWorkers.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

export const app = e()

const allowedOrigins = [
  'http://localhost:5173', // Development
  'https://centrodehospitalidad.netlify.app'
]

// Middlewares
app.use(cookieParser())
app.use(cors({
  origin: (origin, callback) => {
    // Verifica si el origen está en la lista de permitidos
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true) // Permitir el origen
    } else {
      callback(new Error('No permitido por CORS')) // Denegar el origen
    }
  },
  credentials: true, // Permite el uso de cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(e.json())

// Routes
app.use('/administrators', router)
app.use('/supplies', routerSupplies)
app.use('/donations', routerDonations)
app.use('/social-workers', routerSocialWorkers)
