import z from 'zod'

const registerDonationsSchema = z.object({
  ci: z.string()
    .regex(/^\d{10}$/, { message: 'La cédula debe contener 10 digitos.' }),
  items: z.array(
    z.object({
      name: z.string()
        .min(1, { message: 'El nombre del item debe contener al menos un caracter.' })
        .max(35, { message: 'El nombre del item no puede contener más de 35 caracteres.' }),
      quantity: z.number()
        .min(0, { message: 'La cantidad no puede ser negativa.' })
        .max(99, { message: 'La cantidad no puede ser mayor a 99.' })
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
