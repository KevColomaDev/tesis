import z from 'zod'

const registerPatientSchema = z.object({
  habitation: z.string(),
  name: z.string(),
  condition: z.string(),
  food: z.string(),
  admissionDate: z.string().default(new Date().toLocaleDateString())
  // departureDate: z.string().optional().default('--/--/--')
})

export const validateRegisterPatient = (data) => {
  const isValid = registerPatientSchema.safeParse(data)
  if (!isValid.success) {
    return isValid.error
  }
  return isValid.data
}
