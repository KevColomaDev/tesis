import { useEffect, useState } from 'react';

const AdminOptions = () => {

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen flex flex-col items-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full justify-items-center"> {/* Responsivo: 1 columna en móviles, 2 en pantallas más grandes */}
                <div className="bg-gray-200 p-6 rounded-lg shadow-md w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-4 text-center">Campaña</h3>
                </div>

                <div className="bg-gray-200 p-6 rounded-lg shadow-md w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-4 text-center">Beneficiario</h3>
                    <form className="space-y-4 w-full">
                        <label className="flex justify-between items-center">
                            Beneficiado:
                            <input type="text" className="w-full p-1 border rounded-md" />
                        </label>
                        <label className="flex justify-between items-center">
                            Cédula:
                            <input type="text" className="w-full p-1 border rounded-md" />
                        </label>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-sky-800 text-white rounded-md hover:bg-sky-950"
                            >
                                Asignar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default AdminOptions;
