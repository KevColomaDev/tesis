import { db } from './administrators.js';

export const collectionReportDonations = db.collection('ReportsDonations');

export const reportDonations = {
  async createReport({ cedula, nombre, email, telefono, items }) {
    try {
      const newReport = {
        cedula,
        nombre,
        email,
        telefono,
        items,
        date: new Date(),
      };
      const result = await collectionReportDonations.insertOne(newReport);
      return result.ops[0];
    } catch (error) {
      console.log('Error al crear reporte de donaciones:', error.message);
      throw error;
    }
  },
};