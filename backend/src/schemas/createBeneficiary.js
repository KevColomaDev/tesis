import z from 'zod'

const beneficiarySchema = z.object({
  cedula: z.string()
    .regex(/^\d{10}$/, { message: 'La cédula debe contener 10 digitos.' }),
  nombre: z.string()
    .min(1, { message: 'El nombre debe contener al menos un caracter.' })
    .max(35, { message: 'El nombre no puede contener más de 35 caracteres.' }),
  apellido: z.string()
    .min(1, { message: 'El apellido debe contener al menos un caracter.' })
    .max(35, { message: 'El apellido no puede contener más de 35 caracteres.' }),
  email: z.string().email({ message: 'Ingresa el correo correctamente.' }),
  telefono: z.string()
    .regex(/^\d{10}$/, { message: 'La telefono debe contener 10 digitos.' })
})

export const validateBeneficiary = (data) => {
  const isValid = beneficiarySchema.safeParse(data)
  if (!isValid.success) {
    return isValid.error
  }
  return isValid.data
}
