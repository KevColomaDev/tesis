import z from 'zod'

const registerInRoomSchema = z.object({
  h_number: z.number().min(1).max(25),
  ci: z.string().min(10).max(10),
  name: z.string(),
  condition: z.string(),
  food: z.string(),
  admissionDate: z.string().default(new Date().toLocaleDateString('es-ES')),
  admissionTime: z.string().optional(),
  departureDate: z.string().default('--/--/--'),
  departureTime: z.string().default('--:--:--'),
  observations: z.string().optional()
})

export const validateRegisterInRoom = (data) => {
  const isValid = registerInRoomSchema.safeParse(data)
  if (!isValid.success) {
    return isValid.error
  }
  return isValid.data
}
