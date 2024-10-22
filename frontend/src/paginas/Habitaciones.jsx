import React from 'react';
import Carta from '../components/Carta';

const Habitaciones = () => {
  return (
    <div className="p-4">
      {/* Dashboard */}
      <div className="bg-gray-300 shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
          {/* Sección de Habitaciones Disponibles */}
          <div className="flex flex-col items-center p-4">
            <h3 className="text-lg font-medium mb-2">Habitaciones Disponibles</h3>
            {/* Agregar lógica para mostrar el número de habitaciones disponibles */}
            <p className="text-gray-600 text-2xl font-semibold">15</p>
          </div>
          
          {/* Sección de Comidas */}
          <div className="flex flex-col items-center p-4">
            <h3 className="text-lg font-medium mb-2">Comidas</h3>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-green-200 text-green-800 rounded-md">Blanda</span>
              <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-md">Normal</span>
              <span className="px-2 py-1 bg-blue-200 text-blue-800 rounded-md">Líquida</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cartas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 15 }, (_, index) => (
          <Carta key={index} title={`Habitación ${index + 1}`} />
        ))}
      </div>
    </div>
  );
};

export default Habitaciones;


