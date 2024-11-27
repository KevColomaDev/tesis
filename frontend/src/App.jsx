import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./paginas/Login";
import Header from "./components/Header";
import Habitaciones from "./paginas/Habitaciones";
import Suministros from "./paginas/Suministros";
import Donaciones from "./paginas/Donaciones";
import AdminOptions from "./paginas/AdminOptions";
import { SessionProvider } from "./context/SessionContext";
import CreateUser from "./paginas/CreateUser";
import UsersTable from "./paginas/UsersTable";
import UpdatePassword from "./paginas/UpdatePassword";
import ProtectedRoute from "./context/ProtectedRoute";

const App = () => {
  return (
    <SessionProvider>
      <Router>
        <Routes>
          {/* Ruta pública para login */}
          <Route path="/login" element={<Login />} />

          {/* Rutas protegidas */}
          <Route
            path="/habitaciones"
            element={
              <ProtectedRoute
                element={
                  <>
                    <Header />
                    <Habitaciones />
                  </>
                }
              />
            }
          />
          <Route
            path="/suministros"
            element={
              <ProtectedRoute
                element={
                  <>
                    <Header />
                    <Suministros />
                  </>
                }
              />
            }
          />
          <Route
            path="/donaciones"
            element={
              <ProtectedRoute
                element={
                  <>
                    <Header />
                    <Donaciones />
                  </>
                }
              />
            }
          />
          <Route
            path="/actualizar-password"
            element={
              <ProtectedRoute
                element={
                  <>
                    <Header />
                    <UpdatePassword />
                  </>
                }
              />
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute
                element={
                  <>
                    <Header />
                    <AdminOptions />
                  </>
                }
              />
            }
          />
          <Route
            path="/admin/crear-usuario"
            element={
              <ProtectedRoute
                element={
                  <>
                    <Header />
                    <CreateUser />
                  </>
                }
              />
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute
                element={
                  <>
                    <Header />
                    <UsersTable />
                  </>
                }
              />
            }
          />

          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/habitaciones" />} />
        </Routes>
      </Router>
    </SessionProvider>
  );
};

export default App;
