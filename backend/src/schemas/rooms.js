import z from 'zod'

const roomSchema = z.object({
  h_number: z.number().min(1).max(25),
  ci: z.string().min(1).max(10).default('---'),
  name: z.string().default('---'),
  condition: z.string().default('---'),
  food: z.string().default('---'),
  admissionDate: z.string().default(new Date().toLocaleDateString()),
  admissionTime: z.string().default('--:--'),
  departureDate: z.string().optional().default('--/--/--'),
  departureTime: z.string().optional().default('--:--'),
  observations: z.string().optional().default('')
})

export const validateRoom = (room) => {
  const isValid = roomSchema.safeParse(room)
  if (!isValid.success) {
    return isValid.error
  }
  return isValid.data
}
