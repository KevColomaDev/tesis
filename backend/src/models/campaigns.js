import { db } from './administrators.js'
export const collectionCampaigns = db.collection('Campaigns')

export const campaigns = {
  //async getCampaigns () {
   // try {
   //   const campaigns = await collectionCampaigns.find().toArray()
   //   return campaigns
  //  } catch (error) {
   //   console.log(error.message)
   //   return error
   // }
 // },

 // CORREGIDO PARA MOSTRAR CAMPA;AS -----------------------------------

 async getCampaigns(date) {
  try {
    const query = { donationDate: date };  // Asegúrate de que donationDate esté en el formato correcto en la base de datos
    console.log('Consulta para MongoDB:', query);

    const campaigns = await collectionCampaigns.find(query).toArray();
    return campaigns;
  } catch (error) {
    console.error('Error en getCampaigns:', error.message);
    throw error;  // Asegúrate de lanzar el error para que sea manejado en el controlador
  }
},
  async getReports (initialDate, finalDate) {
    try {
      const reportsData = await collectionCampaigns.find({ donationDate: { $gte: initialDate, $lte: finalDate } }).toArray()
      return reportsData
    } catch (error) {
      console.log(error)
    }
  }
}
