import React, { useState } from 'react';
import Formulario from './Formulario';

const Carta = ({ title }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div className="bg-gray-300 shadow-lg rounded-lg p-4 m-5 flex flex-col items-center text-center">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <button
        onClick={toggleForm}
        className="px-4 py-2 bg-sky-800 text-white rounded-md hover:bg-sky-950"
      >
        Ingresar
      </button>
      {isFormVisible && <Formulario onClose={toggleForm} />}
    </div>
  );
};

export default Carta;
