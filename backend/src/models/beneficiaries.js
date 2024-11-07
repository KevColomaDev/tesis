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

  async createBeneficiary(data) {
    try {
      const { cedula, nombre, apellido, email, telefono } = data;
      const newBeneficiary = {
        cedula,
        nombre,
        apellido,
        email,
        telefono,
      };
      const result = await collectionBeneficiaries.insertOne(newBeneficiary);
      return result.ops[0]; // Devuelve el beneficiario creado
    } catch (error) {
      console.log(error.message);
      return error;
    }
  },

  async updateBeneficiaryByCedula(cedula, data) {
    try {
      const result = await collectionBeneficiaries.updateOne(
        { cedula },
        { $set: data }
      );
      return result.modifiedCount > 0; // Retorna true si se actualizó
    } catch (error) {
      console.log(error.message);
      return error;
    }
  }
}

