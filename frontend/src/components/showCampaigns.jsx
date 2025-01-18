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
        <div className="overflow-y-auto max-h-96">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2 text-md font-semibold text-center">
                  Nombre de la campaña
                </th>
                <th className="border border-gray-300 px-4 py-2 text-md font-semibold text-center">
                  Fecha de donación
                </th>
              </tr>
            </thead>
            <tbody>
              {allCampaigns.map((campana) => (
                <tr key={campana._id} className="hover:bg-gray-100">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {campana.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {campana.donationDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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