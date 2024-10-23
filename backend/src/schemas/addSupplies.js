import z from 'zod'

const registerSupliesSchema = z.object({
  quantity: z.number().min(1).max(50)
})
export const validateAddSupplies = (data) => {
  const isValid = registerSupliesSchema.safeParse(data)
  if (!isValid.success) {
    return isValid.error
  }
  return isValid.data
}
