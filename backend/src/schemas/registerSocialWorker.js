import { z } from 'zod'

const registerSocialWorkerSchema = z.object({
  ci: z.number().min(10).max(10),
  name: z.string().min(1).max(35),
  lastname: z.string().min(1).max(35),
  email: z.string().email(),
  createdDate: z.string().default(new Date().toLocaleDateString())
})
export const validateSocialWorker = (data) => {
  const isValid = registerSocialWorkerSchema.safeParse(data)
  if (!isValid.success) {
    return isValid.error
  }
  return isValid.data
}
