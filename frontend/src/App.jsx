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

const App = () => {
  return (
    <SessionProvider>
      <Router>
        <Routes>
          {/* Ruta para login sin Header */}
          <Route path="/login" element={<Login />} />

          {/* Ruta para habitaciones con Header */}
          <Route
            path="/habitaciones"
            element={
              <>
                <Header />
                <Habitaciones />
              </>
            }
          />

          <Route
            path="/suministros"
            element={
              <>
                <Header />
                <Suministros />
              </>
            }
          />

          <Route
            path="/donaciones"
            element={
              <>
                <Header />
                <Donaciones />
              </>
            }
          />
          <Route
            path="/actualizar-password"
            element={
              <>
                <Header />
                <UpdatePassword />
              </>
            }
          />
          <Route
            path="/admin"
            element={
              <>
                <Header />
                <AdminOptions />
              </>
            }
          />
          <Route
            path="/admin/crear-usuario"
            element={
              <>
                <Header />
                <CreateUser />
              </>
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              <>
                <Header />
                <UsersTable />
              </>
            }
          />

          {/* Redirecciona a login por defecto */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </SessionProvider>
  );
};

export default App;
