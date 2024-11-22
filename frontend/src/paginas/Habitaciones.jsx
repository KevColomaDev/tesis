import Carta from '../components/Carta';
import { dataRoomRequest, getAllRoomsRequest, createRoomRequest, deleteRoomRequest } from '../api/auth';
import { useState, useEffect } from 'react';
import { InfoProvider } from '../context/InfoContext';
import { Description } from '../components/Description';
import { ReporteHabitaciones } from '../components/ReporteHabitaciones';

const Habitaciones = () => {
  const [rooms, setRooms] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const addRoom = async () => {
    const newRoomNumber = rooms.length + 1;
    const newRoomData = {
        h_number: newRoomNumber
    };
    const newRoom = await createRoomRequest(newRoomData);
    setRooms(prevRooms => [...prevRooms, newRoom])
    window.location.reload();
  };
  const toggleReport = () => {
    setShowReport(!showReport);
    };
  
  useEffect(() => {
    const roomData = async () => {
      const totalRooms = await getAllRoomsRequest();
      // Convert number of totalRooms into an array of numbers
      const totalRoomsArray = Array.from({ length: totalRooms }, (_, index) => index + 1);
      const roomData = await Promise.all(totalRoomsArray.map(number => dataRoomRequest(number)));
      setRooms(roomData);
    };
    roomData();
  }, []);

  const removeRoom = async () => {
    if (rooms.length === 0) {
      return;
    }
    const lastRoom = rooms[rooms.length - 1];
    // Verify if room is empty
    if (lastRoom.name !== '---') {
      return alert('No se puede eliminar una habitación ocupada');
    }
    await deleteRoomRequest(lastRoom.h_number);

    setRooms(prevRooms => prevRooms.slice(0, -1));
    window.location.reload();
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
          <button className="bg-sky-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-sky-950 transition-colors" onClick={toggleReport}>
            Generar Reporte
          </button>
          {showReport && <ReporteHabitaciones toggleReport={toggleReport} />}
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
              admissionTime={room.admissionTime}
              departureDate={room.departureDate}
              departureTime={room.departureTime}
              observations={room.observations}
            />
          ))}
        </div>
      </div>
    </InfoProvider>
  );
};

export default Habitaciones;