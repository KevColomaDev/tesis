import z from 'zod'

const assignSuppliesSchema = z.object({
  supplies: z.array(
    z.object({
      name: z.string().min(1).max(35),
      quantity: z.number().min(1).max(99)
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
