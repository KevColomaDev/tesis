import axios from "axios"

const administratorAPI = 'http://localhost:4321/administrators'
const socialWorkersAPI = 'http://localhost:4321/social-workers'
const suppliesAPI = 'http://localhost:4321/supplies'
const donationsAPI = 'http://localhost:4321/donations'
// const administratorAPI = 'https://examen-full-stack-backend.onrender.com/administrators'
// const suppliesAPI = 'https://examen-full-stack-backend.onrender.com/supplies'

export const loginRequest = async (user) => {
  const response = await axios.post(`${administratorAPI}/login`, user, { withCredentials: true })
  return response.data
}
export const getSocialWorkersRequest = async () =>{
  try {
    const response = await axios.get(`${administratorAPI}/social-workers`, { withCredentials: true })
    return response;
  } catch (error) {
    return error.response ? error.response.data : { msg: 'Something went wrong' };
  }
}
export const registerSocialWorkerRequest = async (data) => {
  try {
    const response = await axios.post(`${administratorAPI}/new-social-worker`, data, { withCredentials: true })
    return response;
  } catch (error) {
    return error.response ? error.response.data : { msg: 'Something went wrong' };
  }
}
export const deleteSocialWorkerRequest = async (id) => {
  try {
    const response = await axios.delete(`${administratorAPI}/social-worker/${id}`, { withCredentials: true })
    return response;
  } catch (error) {
    return error.response ? error.response.data : { msg: 'Something went wrong' };
  }
  
}

export const updatePasswordRequest = async (data) => {
  try {
    const response = await axios.post(`${socialWorkersAPI}/update-password`, data, { withCredentials: true })
    return response;
  } catch (error) {
    return error.response ? error.response.data : { msg: 'Something went wrong' };
  }
}

export const dietDataRequest = async () => {
  const response = await axios.get(`${administratorAPI}/diet-data`, { withCredentials: true })
  return response.data
}

export const dataRoomRequest = async (roomNumber) => {
  const response = await axios.get(`${administratorAPI}/data-room/${roomNumber}`, { withCredentials: true })
  return response.data
}

export const registerInRoomRequest = async (data) => {
  const response = await axios.post(`${administratorAPI}/register-in-room`, data, { withCredentials: true })
  return response.data
}

export const logoutRequest = async () => {
  const response = await axios.get(`${administratorAPI}/logout`, { withCredentials: true })
  return response.data
}

export const verifyRequest = async () => {
  const response = await axios.get(`${administratorAPI}/verify`, { withCredentials: true })
  return response.data
}

export const setParamsInBlankRequest = async (roomNumber) => {
  const response = await axios.get(`${administratorAPI}/set-params-in-blank/${roomNumber}`, { withCredentials: true })
  return response.data
}

export const generateReportRequest = async (roomNumber) => {
  const response = await axios.get(`${administratorAPI}/generate-report/${roomNumber}`, { withCredentials: true })
  return response.data
}

// Manage Rooms
export const getAllRoomsRequest = async () => {
  const response = await axios.get(`${administratorAPI}/rooms`, { withCredentials: true })
  return response.data
}

export const createRoomRequest = async (data) => {
  const response = await axios.post(`${administratorAPI}/create-room`, data, { withCredentials: true })
  return response.data
}

export const deleteRoomRequest = async (id) => {
  const response = await axios.delete(`${administratorAPI}/delete-room/${id}`, { withCredentials: true })
  return response.data
}



// Manage Patients
export const createPatientRequest = async (data) => {
  const response = await axios.post(`${administratorAPI}/create-patient`, data, { withCredentials: true })
  return response.data
}

export const getPatientByCiRequest = async (data) => {
  const response = await axios.get(`${administratorAPI}/patient/${data}`, { withCredentials: true })
  console.log(response);
  return response.data
}

export const updatePatientStateRequest = async (data, state) => {
  console.log('CI', data);
  const response = await axios.put(`${administratorAPI}/update-patient-state/${data}`, state, { withCredentials: true })
  return response.data
}

// Manage Reports
export const getReportsRequest = async (data) => {
  const response = await axios.post(`${administratorAPI}/reports`, data, { withCredentials: true })
  return response.data 
}

export const getSuppliesReportsRequest = async (data) => {
  const response = await axios.post(`${suppliesAPI}/reports`, data, { withCredentials: true })
  return response.data 
}

export const getSuppliesRoomReportsRequest = async (data) => {
  const response = await axios.post(`${suppliesAPI}/rooms-reports`, data, { withCredentials: true })
  return response.data 
}

export const getDonationsReportsRequest = async (data) => {
  const response = await axios.post(`${donationsAPI}/reports`, data, { withCredentials: true })
  return response.data 
}

export const getCampaignsReportsRequest = async (data) => {
  const response = await axios.post(`${donationsAPI}/campaigns-reports`, data, { withCredentials: true })
  return response.data 
}

// Supplies API

export const getAllSuppliesRequest = async () => {
  const response = await axios.get(`${suppliesAPI}`, { withCredentials: true })
  return response.data
}

export const addStockRequest = async (name, data) => {
  try {
    const response = await axios.put(`${suppliesAPI}/add-stock/${name}`, data, { withCredentials: true })
    return response.data
  } catch (error) {
    return error.response ? error.response.data : { msg: 'Something went wrong' }
  }
}
export const newSupplyRequest = async (data) => {
  try {
    const response = await axios.post(`${suppliesAPI}/new-supply`, data, { withCredentials: true });
    return response.data;
  } catch (error) {
    return error.response ? error.response.data : { msg: 'Something went wrong' };
  }
};

export const assignSuppliesRequest = async (room, data) => {
  try {
    const response = await axios.post(`${suppliesAPI}/assign/${room}`, data, { withCredentials: true })
    return response.data
  } catch (error) {
    return error.response ? error.response.data : { msg: 'Something went wrong' };
  }
}

export const deleteSupplyRequest = async (id) => {
  try {
    const response = await axios.delete(`${suppliesAPI}/${id}`, { withCredentials: true })
    return response.data
  } catch (error) {
    return error.response ? error.response.data : { msg: 'Something went wrong' }
  }
}

// Donations API

export const getAllDonationsRequest = async () => {
  const response = await axios.get(`${donationsAPI}`, { withCredentials: true })
  return response.data
}

export const createCampaignRequest = async (data) => {
  try {
    const response = await axios.post(`${donationsAPI}/new-campaign`, data, { withCredentials: true })
    return response.data
  } catch (error) {
    return error
  }
}

export const verifyCedulaRequest = async (cedula) => {
  try {
    const response = await axios.post(`${donationsAPI}/verify`, { cedula },  { withCredentials: true }  );
    return response.data;  
  } catch (error) {
    console.error("Error al verificar la cédula:", error.response || error.message);
    return null; 
  }
}

export const createBeneficiaryRequest = async (data) => {
  try {
    const response = await axios.post(`${donationsAPI}/create-beneficiary`, data, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error al procesar la donación:", error.response ? error.response.data : error.message);
    return null;
  }
};

export const updateBeneficiaryRequest = async (data) => {
  try {
    const response = await axios.put(`${donationsAPI}/update-beneficiary`, data, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el beneficiario:", error.response ? error.response.data : error.message);
    return null;
  }
};

export const assignDonationsRequest = async (data) => {
  try {
    const response = await axios.put(`${donationsAPI}/assign-donations`, data, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el beneficiario:", error.response ? error.response.data : error.message);
    return null;
  }
};

