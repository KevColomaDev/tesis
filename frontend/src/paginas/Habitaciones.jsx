import { useContext, useState, useEffect } from 'react';
import Carta from '../components/Carta';
import { createRoomRequest, deleteRoomRequest, getListRoomsRequest } from '../api/auth';
import { Description } from '../components/Description';
import { ReporteHabitaciones } from '../components/ReporteHabitaciones';
import { InfoContext } from '../context/InfoContext';

const Habitaciones = () => {
  const { availableRooms, setAvailableRooms } = useContext(InfoContext);
  const [myTotalRooms, setMyTotalRooms] = useState([]);
  const [showReport, setShowReport] = useState(false);

  const addRoom = async () => {
    // Obtener los números existentes de las habitaciones
    const existingNumbers = myTotalRooms.map(room => room.h_number).sort((a, b) => a - b);
    console.log(existingNumbers);
    
    // Determinar el siguiente número faltante o el más alto + 1
    let newRoomNumber = 0; // Inicia en 1 por defecto
  
    for (let i = 0; i < existingNumbers.length; i++) {
      if (existingNumbers[i] !== i + 1) {
        newRoomNumber = i + 1; // Número faltante encontrado
        break;
      }
    }
    
    if (newRoomNumber === 0) {
      newRoomNumber = existingNumbers.length + 1; // El siguiente número disponible es el más alto + 1
    }
  
    // Crear los datos para la nueva habitación
    const newRoomData = {
      h_number: newRoomNumber,
      name: '---', // Asegurar que la habitación sea considerada disponible
    };
  
    try {
      // Llamada a la API para crear la habitación
      const response = await createRoomRequest(newRoomData);
      if (response.msg === 'Room created') {
        // Actualizar la lista de habitaciones y el estado
        const updatedRooms = [...myTotalRooms, newRoomData].sort((a, b) => a.h_number - b.h_number);
        setMyTotalRooms(updatedRooms);
  
        // Recalcular las habitaciones disponibles
        const newAvailableRooms = updatedRooms.filter(room => room.name === '---').length;
        setAvailableRooms(newAvailableRooms);
  
        alert(`La habitación ${newRoomNumber} ha sido creada.`);
      }
    } catch (error) {
      console.error('Error al crear la habitación:', error);
      alert('Hubo un error al crear la habitación.');
    }
  };
  
  

  const toggleReport = () => {
    setShowReport(!showReport);
  };

  const removeRoom = async () => {
    if (myTotalRooms.length === 0) {
      return alert('No hay habitaciones disponibles para eliminar.');
    }

    const roomNumber = parseInt(prompt('Ingrese el número de la habitación a eliminar:'), 10);

    if (isNaN(roomNumber) || roomNumber < 1 || !myTotalRooms.some(room => room?.h_number === roomNumber)) {
      return alert('Número de habitación inválido.');
    }

    const selectedRoom = myTotalRooms.find(room => room.h_number === roomNumber);

    if (!selectedRoom || selectedRoom.name !== '---') {
      return alert('No se puede eliminar una habitación ocupada.');
    }

    try {
      await deleteRoomRequest(roomNumber);

      const updatedRooms = myTotalRooms.filter(room => room.h_number !== roomNumber);
      setMyTotalRooms(updatedRooms);
      setAvailableRooms(updatedRooms.filter(room => room.name === '---').length);

      alert(`La habitación ${roomNumber} ha sido eliminada.`);
    } catch (error) {
      console.error('Error eliminando la habitación:', error);
      alert('Hubo un error al eliminar la habitación.');
    }
  };

  useEffect(() => {
    const roomData = async () => {
      try {
        // Usar getListRoomsRequest para cargar las habitaciones
        const roomList = await getListRoomsRequest();
        if (Array.isArray(roomList)) {
          setMyTotalRooms(roomList.sort((a, b) => a.h_number - b.h_number));
          setAvailableRooms(roomList.filter(room => room.name === '---').length);
        }
      } catch (error) {
        console.error('Error al cargar las habitaciones:', error);
        alert('Hubo un error al cargar las habitaciones.');
      }
    };

    roomData();
  });

  return (
    <div className="p-4">
      <Description />
      <div className="flex justify-center gap-4 mt-4">
        <button
          className="bg-sky-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-sky-950 transition-colors"
          onClick={addRoom}
        >
          Agregar Habitación
        </button>
        <button
          className="bg-sky-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-sky-950 transition-colors"
          onClick={removeRoom}
        >
          Eliminar Habitación
        </button>
        <button
          className="bg-sky-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-sky-950 transition-colors"
          onClick={toggleReport}
        >
          Generar Reporte
        </button>
        {showReport && <ReporteHabitaciones toggleReport={toggleReport} />}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {myTotalRooms.map((room, index) => (
          <Carta
            title={`Habitación ${room.h_number}`}
            key={index}
            room={room.h_number}
            name={room.name}
            ci={room.ci}
            condition={room.condition}
            food={room.food}
            admissionDate={room.admissionDate}
            admissionTime={room.admissionTime}
            departureDate={room.departureDate}
            departureTime={room.departureTime}
            observations={room.observations}
          />
        ))}
      </div>
    </div>
  );
};

export default Habitaciones;
