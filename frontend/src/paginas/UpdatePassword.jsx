import { useState } from "react";
import { Link } from "react-router-dom";
import { registerSocialWorkerRequest, updatePasswordRequest } from "../api/auth";
const CreateUser = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [formUpdatePassword, setFormUpdatePassword] = useState({
    password: "",
    newPassword: "",
    confirmNewPassword: ""
  });

  const handleChangeUpdatePassword = (e) => {
    setFormUpdatePassword({ ...formUpdatePassword, [e.target.name]: e.target.value });
  };

  const handleRegisterUpdatePassword = async () => {
    try {
      setLoading(true);
      const response = await updatePasswordRequest(formUpdatePassword)
      console.log(response)
      if (response.status === 200) {
        setSuccess(response.data.msg);
        setFormUpdatePassword({
          password: "",
          newPassword: "",
          confirmNewPassword: ""
        });
        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } else {
        console.log(response.msg)
        setError(response.msg);
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    } catch (error) {
      console.log(error);
    } finally{
      setLoading(false)
    }
  };

  return (
    <>
      {error && (
        <div
          className="absolute right-8 flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Error! </span>
            {error}
          </div>
        </div>
      )}
      {success && (
        <div
          className="absolute right-8 flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50"
          role="alert"
        >
          <svg
            className="flex-shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <span className="sr-only">Info</span>
          <div>
            <span className="font-medium">Exito! </span>
            {success}
          </div>
        </div>
      )}
      <Link
        to="/habitaciones"
        className="inline-flex items-center border border-blue-900 px-3 py-1.5 m-8 rounded-md text-blue-900 hover:bg-blue-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16l-4-4m0 0l4-4m-4 4h18"
          ></path>
        </svg>
        <span className="ml-1 font-bold text-lg">Regresar</span>
      </Link>
      <form className="max-w-sm mx-auto px-4 sm:px-0">
        <div className={`mb-5`}>
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Contraseña Actual
          </label>
          <input
            type="password"
            name="password"
            value={formUpdatePassword.password}
            onChange={handleChangeUpdatePassword}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div className={`mb-5`}>
          <label
            htmlFor="newPassword"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Nueva Contraseña
          </label>
          <input
            type="password"
            name="newPassword"
            value={formUpdatePassword.newPassword}
            onChange={handleChangeUpdatePassword}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <div className={`mb-5`}>
          <label
            htmlFor="confirmNewPassword"
            className="block mb-2 text-sm font-medium text-gray-900"
          >
            Repite la nueva contraseña
          </label>
          <input
            type="password"
            name="confirmNewPassword"
            value={formUpdatePassword.confirmNewPassword}
            onChange={handleChangeUpdatePassword}
            className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            required
          />
        </div>
        <button
          type="button"
          onClick={() => handleRegisterUpdatePassword()}
          className={`w-full bg-sky-800 text-white px-4 py-2 rounded-lg shadow-md mb-8 hover:bg-sky-950 transition-colors disabled:cursor-not-allowed disabled:bg-blue-800 disabled:hover:bg-blue-800}`}
          disabled={loading}
        >
          {loading ? "Actualizando..." : "Actualizar Contraseña"}
        </button>
      </form>
    </>
  );
};
export default CreateUser;
