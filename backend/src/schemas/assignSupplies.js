import z from 'zod'

const assignSuppliesSchema = z.object({
  supplies: z.array(
    z.object({
      name: z.string()
        .min(1, { message: 'El nombre debe contener al menos un caracter.' })
        .max(35, { message: 'El nombre no puede contener más de 35 caracteres.' }),
      quantity: z.number()
        .min(1, { message: 'La cantidad debe ser mayor que 0.' })
        .max(99, { message: 'La cantidad no puede ser mayor a 99.' })
    })
  )
})
export const validateAssignSupplies = (data) => {
  const isValid = assignSuppliesSchema.safeParse(data)
  if (!isValid.success) {
    return isValid.error
  }
  return isValid.data
}
