import { useForm } from 'react-hook-form';
import { useState, useEffect, useContext } from 'react';
import { Mensaje } from '../components/Message';
import logo from '../assets/Logo.png';
import { loginRequest } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import { SessionContext } from '../context/SessionContext';

export default function Login() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState({});
  const { setIsAuthenticated ,isAuthenticated, setUser } = useContext(SessionContext);


  const navigate = useNavigate();
  const onSubmit = async (data) => {
    try {
      console.log(data);
      const response = await loginRequest(data)
      if (response) {
        setIsAuthenticated(true)
        console.log(isAuthenticated)
      }
    } catch (error) {
      console.log(error.response.data.msg)
      setError({ type: 'Error: ', message: 'Credenciales incorrectas' })
      console.log(error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/habitaciones');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen flex-col justify-center px-5 pt-5 lg:pt-1 lg:px-8 bg-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          className="mx-auto h-20 w-auto mt-px lg:mt-1"
          src={logo}
          alt="Solca"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-sky-900">
          Centro de Hospitalidad
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
              Usuario
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="username"
                type="email"
                autoComplete="username"
                required
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 focus:outline-none sm:text-sm sm:leading-6"
                {...register('email')}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Contraseña
              </label>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-900 focus:outline-none sm:text-sm sm:leading-6"
                {...register('password')}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-sky-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-sky-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              Ingresar
            </button>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm aspect-[9/1]">
            {Object.keys(error).length > 0 && <Mensaje type={error.type} message={error.message}/>}
          </div>
        </form>
      </div>
    </div>
  );
}
