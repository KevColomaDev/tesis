import Carta from '../components/Carta';
import { dataRoomRequest } from '../api/auth';
import { useState, useEffect } from 'react';
import { InfoProvider } from '../context/InfoContext';
import { Description } from '../components/Description';

const Habitaciones = () => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const roomData = async () => {
      const roomNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      const roomData = await Promise.all(roomNumbers.map(number => dataRoomRequest(number)));
      setRooms(roomData);
    };
    roomData();
  }, []);

  const addRoom = () => {
    const newRoomNumber = rooms.length + 1; // Assuming room numbers are sequential
    const newRoom = {
      h_number: newRoomNumber,
      name: '',
      ci: '', // Add default values as needed
      condition: '',
      food: '',
      admissionDate: '',
      observations: ''
    };
    setRooms([...rooms, newRoom]);
  };

  const removeRoom = () => {
    const roomNumberToRemove = prompt("Ingrese el número de habitación a eliminar:");
    if (roomNumberToRemove) {
      const updatedRooms = rooms.filter(room => room.h_number !== parseInt(roomNumberToRemove));
      setRooms(updatedRooms);
    }
  };

  return (
    <InfoProvider>
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {rooms.map((room, index) => (
            <Carta
              title={`Habitación ${room.h_number}`}
              key={index}
              room={room.h_number}
              name={room.name}
              ci={room.ci}
              condition={room.condition}
              food={room.food}
              admissionDate={room.admissionDate}
              observations={room.observations}
            />
          ))}
        </div>
      </div>
    </InfoProvider>
  );
};

export default Habitaciones;