import z from 'zod'

const registerPatientSchema = z.object({
  ci: z.string().min(10).max(10),
  name: z.string().min(1).max(35),
  state: z.boolean().default(true)
})

export const validateRegisterPatient = (data) => {
  const isValid = registerPatientSchema.safeParse(data)
  if (!isValid.success) {
    return isValid.error
  }
  return isValid.data
}
