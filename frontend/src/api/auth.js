import axios from "axios"

const administratorAPI = 'http://localhost:4321/administrators'
const suppliesAPI = 'http://localhost:4321/supplies'
const donationsAPI = 'http://localhost:4321/donations'
// const administratorAPI = 'https://examen-full-stack-backend.onrender.com/administrators'
// const suppliesAPI = 'https://examen-full-stack-backend.onrender.com/supplies'

export const loginRequest = async (user) => {
  const response = await axios.post(`${administratorAPI}/login`, user, { withCredentials: true })
  return response.data
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