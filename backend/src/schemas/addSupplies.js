import z from 'zod'

const registerSupliesSchema = z.object({
  quantity: z.number().min(0).max(99)
})
export const validateAddSupplies = (data) => {
  const isValid = registerSupliesSchema.safeParse(data)
  if (!isValid.success) {
    return isValid.error
  }
  return isValid.data
}
