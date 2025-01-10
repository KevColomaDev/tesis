import { useContext } from 'react';
import Carta from '../components/Carta';
import { dataRoomRequest, createRoomRequest, deleteRoomRequest, getAllRoomsRequest } from '../api/auth';
import { useState, useEffect } from 'react';
// import { InfoProvider } from '../context/InfoContext';
import { Description } from '../components/Description';
import { ReporteHabitaciones } from '../components/ReporteHabitaciones';
import { InfoContext } from '../context/InfoContext';

const Habitaciones = () => {
  const { availableRooms, setAvailableRooms } = useContext(InfoContext);
  const [myTotalRooms, setMyTotalRooms] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const addRoom = async () => {
    const newRoomNumber = myTotalRooms.length + 1;
    const newRoomData = {
        h_number: newRoomNumber
    };
    const response = await createRoomRequest(newRoomData);
    if (response.msg === 'Room created') {
      setAvailableRooms(availableRooms + 1);
    }
  };

  const toggleReport = () => {
    setShowReport(!showReport);
    };
  
    
    const removeRoom = async () => {
      if (myTotalRooms.length === 0) {
        return;
      }
      const lastRoom = myTotalRooms[myTotalRooms.length - 1];
      // Verify if room is empty
      if (lastRoom.name !== '---') {
        return alert('No se puede eliminar una habitación ocupada');
    }
    await deleteRoomRequest(lastRoom.h_number);
    
    setAvailableRooms(availableRooms - 1);
  };

  useEffect(() => {
    const roomData = async () => {
      const totalRooms = await getAllRoomsRequest();
      // Convert number of totalRooms into an array of numbers
      const totalRoomsArray = Array.from({ length: totalRooms }, (_, index) => index + 1);
      const roomData = await Promise.all(totalRoomsArray.map(number => dataRoomRequest(number)));
      console.log(`Total rooms: ${roomData.length}`);
      setMyTotalRooms(roomData);
      setAvailableRooms(roomData.filter(room => room.name === '---').length);
    };
    roomData();
  }, [availableRooms, setMyTotalRooms, setAvailableRooms]);
  
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
        <button className="bg-sky-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-sky-950 transition-colors" onClick={toggleReport}>
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