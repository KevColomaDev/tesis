import z from 'zod'

const registerSupliesSchema = z.object({
  toothPaste: z.number().min(0).max(50).optional(),
  soap: z.number().min(0).max(50).optional(),
  toothBrush: z.number().min(0).max(50).optional(),
  towel: z.number().min(0).max(50).optional()
})
export const validateRegisterSupplies = (data) => {
  const isValid = registerSupliesSchema.safeParse(data)
  if (!isValid.success) {
    return isValid.error
  }
  return isValid.data
}
