import React, { useEffect, useState } from "react";
import { getCampaignsByDateRequest } from "../api/auth";

const ShowCampaigns = ({ onClose }) => {
  const [allCampaigns, setAllCampaigns] = useState([]);

  useEffect(() => {
    const getAllCampaigns = async () => {
      const campaignsData = await getCampaignsByDateRequest();
      console.log(campaignsData);
      if (campaignsData) {
        setAllCampaigns(campaignsData);
      }
    }
    getAllCampaigns();
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Campañas registradas
        </h2>
        <div className="flex w-full">
          <p className="w-1/2 text-md font-semibold text-center">Nombre de la campaña</p>
          <p className="w-1/2 text-md font-semibold text-center">Fecha de donación</p>
        </div>
        <div className="flex flex-col items-center">
          {allCampaigns.map(campana => (
            <div className="flex items-center w-full">
              <p className="w-1/2 font-medium text-center" key={campana._id}>{campana.name}</p>
              <p className="w-1/2 font-medium text-center" key={campana._id}>{campana.donationDate}</p>
            </div>
          ))}
        </div>
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