import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { SessionContext } from "./SessionContext";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useContext(SessionContext);

  if (isAuthenticated === null) {
    return <div>Cargando...</div>; // O un spinner de carga
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute