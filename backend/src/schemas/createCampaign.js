import z from 'zod'

const campaignSchema = z.object({
  name: z.string().min(1).max(35),
  items: z.array(
    z.object({
      name: z.string().min(1).max(35),
      quantity: z.number().min(0).max(99)
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
