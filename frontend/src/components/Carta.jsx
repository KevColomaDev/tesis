import { useContext, useState, useEffect } from 'react';
import Formulario from './Formulario';
import PropTypes from 'prop-types';
import { InfoContext } from '../context/InfoContext';
import { setParamsInBlankRequest } from '../api/auth';

const Carta = (props) => {
  const { name, ci, condition, food, admissionDate, room, observations, admissionTime, departureDate, departureTime } = props;
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { updateDietData } = useContext(InfoContext);
  const [formData, setFormData] = useState({ name, ci, condition, food, admissionDate, room, observations, admissionTime, departureDate, departureTime });
  const [isOpaque, setIsOpaque] = useState(name && name !== '---');  // Estado para la opacidad

  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleFormComplete = (data) => {
    setFormData(data);
    updateDietData();
    setIsFormVisible(false);
  };
  const onClickDelete = async (roomNumber) => {
    const confirmed = window.confirm("¿Estás seguro de que quieres dar de alta?");
    
    if (confirmed) {
      try {
        const response = await setParamsInBlankRequest(roomNumber);
        if (response) {
          setFormData(response);
          updateDietData();
        }
      } catch (error) {
        console.log(error);
      }
    }
  }


  useEffect(() => {
    // Actualizar `isOpaque` cada vez que `formData.name` cambia
    setIsOpaque(formData.name && formData.name !== '---');
  }, [formData.name]);

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
      {formData.name && formData.name !== '---' && (
        <button
          onClick={() => onClickDelete(room)}
          className="px-4 py-2 bg-rose-500 mt-2 text-white rounded-md hover:bg-rose-950"
        >
          Dar de alta
        </button>
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
  admissionTime: PropTypes.string,
  departureDate: PropTypes.string,
  departureTime: PropTypes.string,
  observations: PropTypes.string
};

export default Carta;
