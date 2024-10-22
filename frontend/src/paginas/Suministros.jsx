import React, { useState } from 'react';
import Reporte from '../components/Reporte';

const Suministros = () => {
    const [showReport, setShowReport] = useState(false);

    const toggleReport = () => {
      setShowReport(!showReport);
    };
  
    return (
      <div className="p-4 md:p-8 bg-gray-100 min-h-screen flex flex-col items-center">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-200 text-center p-4 rounded-lg shadow-md">
            <p className="text-2xl sm:text-4xl font-bold">6</p>
            <p className="text-sm sm:text-lg">Pasta de dientes</p>
          </div>
          <div className="bg-blue-200 text-center p-4 rounded-lg shadow-md">
            <p className="text-2xl sm:text-4xl font-bold">11</p>
            <p className="text-sm sm:text-lg">Jabones</p>
          </div>
          <div className="bg-blue-200 text-center p-4 rounded-lg shadow-md">
            <p className="text-2xl sm:text-4xl font-bold">7</p>
            <p className="text-sm sm:text-lg">Cepillos</p>
          </div>
          <div className="bg-blue-200 text-center p-4 rounded-lg shadow-md">
            <p className="text-2xl sm:text-4xl font-bold">8</p>
            <p className="text-sm sm:text-lg">Toallas</p>
          </div>
        </div>
  
        <button
          className="bg-sky-800 text-white px-4 py-2 rounded-lg shadow-md mb-8 hover:bg-sky-950 transition-colors"
          onClick={toggleReport}
        >
          Generar Reporte
        </button>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full justify-items-center">
            <div className="bg-gray-200 p-6 rounded-lg shadow-md w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4 text-center">Ingresar Suministros</h3>
                <form className="space-y-4 w-full">
                <label className="flex justify-between items-center">
                    Pasta de dientes:
                    <input
                    type="number"
                    max="99"
                    className="w-20 p-2 border rounded-md"
                    />
                </label>
                <label className="flex justify-between items-center">
                    Jabones:
                    <input
                    type="number"
                    max="99"
                    className="w-20 p-2 border rounded-md"
                    />
                </label>
                <label className="flex justify-between items-center">
                    Cepillos:
                    <input
                    type="number"
                    max="99"
                    className="w-20 p-2 border rounded-md"
                    />
                </label>
                <label className="flex justify-between items-center">
                    Toallas:
                    <input
                    type="number"
                    max="99"
                    className="w-20 p-2 border rounded-md"
                    />
                </label>
                <div className="flex justify-center">
                    <button
                    type="submit"
                    className="bg-sky-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-sky-950 transition-colors"
                    >
                    Ingresar
                    </button>
                </div>
                </form>
            </div>

            <div className="bg-gray-200 p-6 rounded-lg shadow-md w-full max-w-md">
                <h3 className="text-lg font-semibold mb-4 text-center">Asignar a Habitación</h3>
                <form className="space-y-4 w-full">
                <label className="flex justify-between items-center">
                    Habitación:
                    <input
                    type="number"
                    max="99"
                    className="w-20 p-2 border rounded-md"
                    />
                </label>
                <label className="flex justify-between items-center">
                    Pasta de dientes:
                    <input
                    type="number"
                    max="99"
                    className="w-20 p-2 border rounded-md"
                    />
                </label>
                <label className="flex justify-between items-center">
                    Jabones:
                    <input
                    type="number"
                    max="99"
                    className="w-20 p-2 border rounded-md"
                    />
                </label>
                <label className="flex justify-between items-center">
                    Cepillos:
                    <input
                    type="number"
                    max="99"
                    className="w-20 p-2 border rounded-md"
                    />
                </label>
                <label className="flex justify-between items-center">
                    Toallas:
                    <input
                    type="number"
                    max="99"
                    className="w-20 p-2 border rounded-md"
                    />
                </label>
                <div className="flex justify-center">
                    <button
                    type="submit"
                    className="bg-sky-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-sky-950 transition-colors"
                    >
                    Asignar
                    </button>
                </div>
                </form>
            </div>
            </div>
  
        {showReport && <Reporte toggleReport={toggleReport} />}
      </div>
    );
};

export default Suministros;
