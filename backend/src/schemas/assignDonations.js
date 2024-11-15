import z from 'zod'

const registerDonationsSchema = z.object({
  ci: z.string()
    .regex(/^\d{10}$/, { message: 'CI must be exactly 10 digits' }),
  items: z.array(
    z.object({
      name: z.string().min(1).max(35),
      quantity: z.number().min(0).max(99)
    })
  )
})
export const validateAssignDonations = (data) => {
  const isValid = registerDonationsSchema.safeParse(data)
  if (!isValid.success) {
    return isValid.error
  }
  return isValid.data
}
