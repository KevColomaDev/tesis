import { useContext, useState } from 'react';
import Formulario from './Formulario';
import PropTypes from 'prop-types';
import { InfoContext } from '../context/InfoContext';

const Carta = (props) => {
  const { name, ci, condition, food, admissionDate, room, observations } = props;
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { updateDietData } = useContext(InfoContext);
  const [formData, setFormData] = useState({ name, ci, condition, food, admissionDate, room, observations });

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleFormComplete = (data) => {
    setFormData(data);
    updateDietData();
    setIsFormVisible(false);
  };

  const isOpaque = name && name !== '---';

  return (
    <div className={`shadow-lg rounded-lg p-4 m-5 flex flex-col items-center text-center ${isOpaque ? 'bg-blue-200' : 'bg-gray-300'}`}>
      <h2 className="text-xl font-semibold mb-4">{props.title}</h2>
      <button
        onClick={toggleForm}
        className="px-4 py-2 bg-sky-800 text-white rounded-md hover:bg-sky-950"
      >
        Ingresar
      </button>
      {isFormVisible && (
        <Formulario 
          onClose={toggleForm} 
          h_number={room} 
          initialData={formData} 
          onComplete={handleFormComplete} 
        />
      )}
    </div>
  );
};

Carta.propTypes = {
  title: PropTypes.string,
  room: PropTypes.number,
  name: PropTypes.string,
  ci: PropTypes.string,
  condition: PropTypes.string,
  food: PropTypes.string,
  admissionDate: PropTypes.string,
  observations: PropTypes.string
};

export default Carta;