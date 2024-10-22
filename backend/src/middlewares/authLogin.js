import jwt from 'jsonwebtoken'
import { config } from 'dotenv'

config()

export const authLogin = (req, res, next) => {
  const token = req.cookies.token
  if (!token) {
    return res.status(401).json({ msg: 'Unauthorized' })
  }
  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) {
      return res.status(401).json({ msg: 'Unauthorized' })
    }
    req.user = user
    next()
  })
}
