import z from 'zod'

const itemSchema = z.object({
  name: z.string()
    .min(1, { message: 'El nombre debe contener al menos un caracter.' })
    .max(35, { message: 'El nombre no puede contener más de 35 caracteres.' }),
  quantity: z.number()
    .min(0, { message: 'La cantidad no puede ser un número negativo.' })
    .max(50, { message: 'La cantidad no puede ser mayor a 50.' })
    .default(0),
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
