import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ShowCampaigns = ({ onClose }) => {
  const [date, setDate] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [noRecords, setNoRecords] = useState(false);

  const fetchCampaignsByDate = async (selectedDate) => {
    try {
      const response = await axios.get(`/api/campaigns-by-date?date=${selectedDate}`);
      if (response.data.length > 0) {
        setCampaigns(response.data);
        setNoRecords(false);
      } else {
        setCampaigns([]);
        setNoRecords(true);
      }
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setCampaigns([]);
      setNoRecords(true);
    }
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);
    if (selectedDate) {
      fetchCampaignsByDate(selectedDate);
    } else {
      setCampaigns([]);
      setNoRecords(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">Campañas registradas</h2>
        
        <label className="block mb-4">
          <span className="text-gray-700">Fecha</span>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            placeholder="mm/dd/yyyy"
            className="mt-1 block w-full p-2 border rounded-md"
          />
        </label>

        {date && (
          <>
            {campaigns.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Campaña</th>
                    <th className="border px-4 py-2">Objetos</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id}>
                      <td className="border px-4 py-2">{campaign.name}</td>
                      <td className="border px-4 py-2">
                        {campaign.items.map((item, index) => (
                          <div key={index}>{item.name} - {item.quantity}</div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center text-gray-500">No hay registros en esta fecha</p>
            )}
          </>
        )}

        <div className="flex justify-center mt-4">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowCampaigns;
