import z from 'zod'

const itemSchema = z.object({
  name: z.string().min(0).max(35),
  quantity: z.number().min(0).max(50).default(0),
  description: z.string().min(0).max(100).optional(),
  createdDate: z.string().default(new Date().toLocaleDateString())
})
export const validateSupply = (data) => {
  const isValid = itemSchema.safeParse(data)
  if (!isValid.success) {
    return isValid.error
  }
  return isValid.data
}
