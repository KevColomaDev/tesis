import z from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

export const validateLogin = (data) => {
  const isValid = loginSchema.safeParse(data)
  if (!isValid.success) {
    return isValid.error
  }
  return isValid.data
}
