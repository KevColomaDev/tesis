import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { verifyRequest, logoutRequest, getRoleRequest } from "../api/auth";

export const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState({});

  const logout = async () => {
    try {
      await logoutRequest();
      setIsAuthenticated(false); // Asegúrate de que isAuthenticated sea false después de cerrar sesión
    } catch (error) {
      console.log(error);
    }
  };

  const getRole = async () => {
    try {
      const response = await getRoleRequest()
      setUser(response.data)

    } catch (error) {
      console.log(error)
    }
  }

  const verify = async () => {
    try {
      const response = await verifyRequest();
      if (response.msg === 'Authorized') {
        setIsAuthenticated(true);
      } else {
        console.log('Not authenticated');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthenticated(false)
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      verify()
      getRole()
    }
  }, [isAuthenticated])
  useEffect(() => {
    verify()
    getRole()
  },[])

  return (
    <SessionContext.Provider value={{ isAuthenticated, logout, setIsAuthenticated, verify, user, setUser }}>
      {children}
    </SessionContext.Provider>
  );
};

SessionProvider.propTypes = {
  children: PropTypes.node
};
