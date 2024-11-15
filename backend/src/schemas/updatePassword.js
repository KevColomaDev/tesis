import z from 'zod'

const updatePasswordSchema = z.object({
  password: z.string(),
  newPassword: z.string(),
  confirmNewPassword: z.string()
})

export const validateUpdatePassword = (data) => {
  const isValid = updatePasswordSchema.safeParse(data)
  if (!isValid.success) {
    return isValid.error
  }
  return isValid.data
}
