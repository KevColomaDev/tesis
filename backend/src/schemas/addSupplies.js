import z from 'zod'

const registerSupliesSchema = z.object({
  quantity: z.number()
    .min(0, { message: 'La cantidad debe ser al menos 0.' })
    .max(99, { message: 'La cantidad no puede ser mayor a 99.' })
})
export const validateAddSupplies = (data) => {
  const isValid = registerSupliesSchema.safeParse(data)
  if (!isValid.success) {
    return isValid.error
  }
  return isValid.data
}
