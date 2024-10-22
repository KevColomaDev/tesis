import React, { useState } from 'react';

const Reporte = ({ toggleReport }) => {
  const [reportType, setReportType] = useState('mensual');
  const [formData, setFormData] = useState({ fechaIngreso: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-semibold mb-4">Generación de Reporte</h2>
        <form className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Tipo de Reporte</span>
            <select
              className="mt-1 block w-full p-2 border rounded-md"
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              aria-label="Seleccionar tipo de reporte"
            >
              <option value="mensual">Mensual</option>
              <option value="anual">Anual</option>
            </select>
          </label>

          <label className="block">
            <span className="text-gray-700">Fecha</span>
            {reportType === 'mensual' ? (
              <div className="mb-3">
                <input
                  type="date"
                  name="fechaIngreso"
                  value={formData.fechaIngreso}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-sky-900 focus:ring-2 focus:outline-none"
                />
              </div>
            ) : (
              <input
                type="number"
                min="2000"
                max="2100"
                placeholder="Año"
                className="mt-1 block w-full p-2 border rounded-md"
                aria-label="Seleccionar año"
                required
              />
            )}
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

export default Reporte;
