import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { getCampaignsReportsRequest, getDonationsReportsRequest, getSuppliesRoomReportsRequest } from '../api/auth';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const ReporteDonaciones = ({ toggleReport }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    console.log("Datos enviados:", data);
    try {
      const response = await getDonationsReportsRequest(data);
      const campaignResponse = await getCampaignsReportsRequest(data);
      console.log(response);
      console.log(campaignResponse);
  
      const doc = new jsPDF();
      let currentYPosition = 20; // Posición vertical inicial
  
      // Formatear las fechas al estilo "Noviembre 10 del 2024"
      const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
  
      // Forzar las fechas como locales eliminando cualquier posible cambio de zona horaria
      const fechaInicial = new Date(data.fechaInicial + "T00:00:00");
      const fechaFinal = new Date(data.fechaFinal + "T00:00:00");
      
      const fechaInicialFormateada = fechaInicial.toLocaleDateString('es-ES', opcionesFecha);
      const fechaFinalFormateada = fechaFinal.toLocaleDateString('es-ES', opcionesFecha);
  
      // Encabezado del PDF
      doc.setFontSize(15);
      doc.text(`Reporte desde ${fechaInicialFormateada} hasta ${fechaFinalFormateada}`, 10, 10);
      
      currentYPosition = currentYPosition + 10
      doc.text(`Donaciones Asignadas`, 10, currentYPosition - 5);
      
      response.forEach((item) => {
        // Ajustar título para cada habitación
        doc.setFontSize(12);
        doc.text(`Asignado a ${item.name} ${item.lastname}`, 10, currentYPosition);
        doc.setFontSize(10);
        doc.text(`CI: ${item.ci}`, 10, currentYPosition+8);
        
        doc.setFontSize(12);
        // Configuración de la tabla
        doc.autoTable({
          startY: currentYPosition + 10, // Posicionar la tabla debajo del título
          head: [['Donación', 'Cantidad']],
          body: item.assignedDonations.map(item => [item.name, item.quantity]),
          margin: { top: 20 },
        });
        
        // Actualizar la posición para la siguiente tabla, incluyendo espacio adicional
        currentYPosition = doc.lastAutoTable.finalY + 15;
      });
      doc.setFontSize(15);
      
      doc.text(`Campañas`, 10, currentYPosition - 5);
      campaignResponse.forEach((item) => {
        // Ajustar título para cada habitación
        doc.setFontSize(12);
        doc.text(`Campaña ${item.name}`, 10, currentYPosition);
        doc.setFontSize(8);
        doc.text(`(${item.donationDate})`, 10, currentYPosition + 8);
        
        doc.setFontSize(12);
        // Configuración de la tabla
        doc.autoTable({
          startY: currentYPosition + 10, // Posicionar la tabla debajo del título
          head: [['Donación', 'Cantidad']],
          body: item.items.map(item => [item.name, item.quantity]),
          margin: { top: 20 },
        });
        
  
        // Actualizar la posición para la siguiente tabla, incluyendo espacio adicional
        currentYPosition = doc.lastAutoTable.finalY + 15;
      });
  
      // Guardar el PDF
      doc.save('reporteDonaciones.pdf');
    } catch (error) {
      console.log("Error al obtener los reportes:", error);
    }
  };
  
  
  

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Generación de Reporte</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Fecha Inicial</span>
            <input
              type="date"
              name="fechaInicial"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-sky-900 focus:ring-2 focus:outline-none"
              {...register('fechaInicial', {
                required: 'Este campo es requerido',
              })}
            />
            {errors.fechaInicial && <p className="text-red-500 text-sm">{errors.fechaInicial.message}</p>}
          </label>

          <label className="block">
            <span className="text-gray-700">Fecha Final</span>
            <input
              type="date"
              name="fechaFinal"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-sky-900 focus:ring-2 focus:outline-none"
              {...register('fechaFinal', {
                required: 'Este campo es requerido',
              })}
            />
            {errors.fechaFinal && <p className="text-red-500 text-sm">{errors.fechaFinal.message}</p>}
          </label>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={toggleReport}
              className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Generar PDF
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ReporteDonaciones.propTypes = {
  toggleReport: PropTypes.func.isRequired,
};
