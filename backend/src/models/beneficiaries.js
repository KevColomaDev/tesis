import { db } from './administrators.js'
export const collectionBeneficiaries = db.collection('Beneficiaries')

export const beneficiaries = {
  // Obtener todos los beneficiarios
  async getBeneficiaries () {
    try {
      const beneficiaries = await collectionBeneficiaries.find().toArray()
      return beneficiaries
    } catch (error) {
      console.log(error.message)
      return error
    }
  },

  // Verificar si un beneficiario existe por cédula
  async verifyBeneficiaryByCedula (cedula) {
    try {
      const beneficiary = await collectionBeneficiaries.findOne({ cedula });
      return beneficiary;
    } catch (error) {
      console.log(error.message);
      return error;
    }
  },
}

// ---------------------------------- TODO ESTO ----------------------------------------------------//