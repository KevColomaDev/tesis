import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

export const ReporteHabitaciones = ({ toggleReport }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log("Datos enviados:", data);
    // Aquí iría el código para generar el reporte
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

ReporteHabitaciones.propTypes = {
  toggleReport: PropTypes.func.isRequired,
};
