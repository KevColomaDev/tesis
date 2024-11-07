import z from 'zod'

const roomReportSchema = z.object({
  h_number: z.number().min(1).max(25),
  ci: z.string().min(1).max(10),
  name: z.string(),
  condition: z.string(),
  food: z.string(),
  admissionDate: z.string(),
  admissionTime: z.string(),
  departureDate: z.string(),
  departureTime: z.string(),
  observations: z.string()
})

export const validateReport = (report) => {
  const isValid = roomReportSchema.safeParse(report)
  if (!isValid.success) {
    return isValid.error
  }
  return isValid.data
}
