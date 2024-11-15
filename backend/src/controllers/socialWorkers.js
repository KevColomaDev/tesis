import { socialWorkers } from '../models/socialWorkers.js'
import { validateUpdatePassword } from '../schemas/updatePassword.js'

export const updatePassword = async (req, res) => {
  const validatePasswords = validateUpdatePassword(req.body)
  if (Object.keys(validatePasswords).includes('issues')) {
    return res.status(400).json(validatePasswords.errors)
  }
  if (validatePasswords.newPassword !== validatePasswords.confirmNewPassword) {
    return res.status(400).json({ msg: 'Passwords do not match.' })
  }
  try {
    const response = await socialWorkers.updatePassword(validatePasswords.password, req.user.socialWorkersLogin.email, validatePasswords.newPassword)
    if (response) {
      return res.status(200).json({ msg: 'Password updated.' })
    } else {
      return res.status(400).json({ msg: 'Something was wrong.' })
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
}
