import { z } from 'zod'

const registerSocialWorkerSchema = z.object({
  ci: z
    .string()
    .regex(/^\d{10}$/, { message: 'CI must be exactly 10 digits' }),
  name: z.string().min(1).max(35),
  lastname: z.string().min(1).max(35),
  email: z.string().email(),
  token: z.string().default(''),
  createdDate: z
    .preprocess((val) => val || new Date().toLocaleDateString(), z.string())
})

export const validateSocialWorker = (data) => {
  const isValid = registerSocialWorkerSchema.safeParse(data)
  if (!isValid.success) {
    return isValid.error
  }
  return isValid.data
}
