import { db } from './administrators.js'
export const collectionDonations = db.collection('Donations')

export const donations = {
  async getDonations () {
    try {
      const donations = await collectionDonations.find().toArray()
      return donations
    } catch (error) {
      console.log(error.message)
      return error
    }
  },
  async registerDonationsToBenefit (supplies) {
    try {
      // Collection Patients
    } catch (error) {
      console.log(error.message)
    }
  },
  async updateDonationQuantity(name, quantity) {
    try {
      // Actualiza la cantidad de donaciones
      const result = await collectionDonations.updateOne(
        { name },
        { $inc: { quantity: -quantity } }
      );
      return result;
    } catch (error) {
      console.log(error.message);
      return error;
    }
  }
}
