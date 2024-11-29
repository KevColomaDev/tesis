import z from 'zod'

const campaignSchema = z.object({
  name: z.string()
    .min(1, { message: 'El nombre de la campaña debe contener al menos un caracter.' })
    .max(35, { message: 'El nombre de la campaña no puede contener más de 35 caracteres.' }),
  items: z.array(
    z.object({
      name: z.string()
        .min(1, { message: 'El nombre del item debe contener al menos un caracter.' })
        .max(35, { message: 'El nombre del item debe contener al menos un caracter.' }),
      quantity: z.number()
        .min(0, { message: 'La cantidad no puede ser negativa.' })
        .max(99, { message: 'La cantidad no puede ser mayor a 99.' })
    })
  ),
  donationDate: z.string().default(new Date().toLocaleDateString())
})

export const validateCampaign = (data) => {
  const isValid = campaignSchema.safeParse(data)
  if (!isValid.success) {
    return isValid.error
  }
  return isValid.data
}
