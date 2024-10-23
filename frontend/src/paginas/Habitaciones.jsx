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
      const roomData = await Promise.all(roomNumbers.map(number => dataRoomRequest(number)))
      setRooms(roomData)
    }
    roomData()
  }, [])

  return (
    <InfoProvider>
      <div className="p-4">
        {/* Dashboard */}
        <Description />

        {/* Cartas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* {Array.from({ length: 15 }, (_, index) => (
            <Carta key={index} title={`Habitación ${index + 1}`}/>
          ))} */}
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


