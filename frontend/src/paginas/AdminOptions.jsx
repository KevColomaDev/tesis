import { Link } from 'react-router-dom';

const AdminOptions = () => {

    return (
        <div className="w-full max-w-sm p-4 mx-auto mt-14 bg-white border border-gray-200 rounded-lg shadow sm:p-6">
        <h5 className="mb-3 text-base font-semibold text-gray-900 md:text-xl">
          Opciones de Administrador
        </h5>
        <p className="text-sm font-normal text-gray-500">
          Puedes seleccionar una de las siguientes opciones.
        </p>
        <ul className="my-4 space-y-3">
          <li>
            <Link
              to="/admin/crear-usuario"
              className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow "
            >
              <svg
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16.5 5.5C17.9587 5.5 19.3576 6.07946 20.3891 7.11091C21.4205 8.14236 22 9.54131 22 11C22 12.4587 21.4205 13.8576 20.3891 14.8891C19.3576 15.9205 17.9587 16.5 16.5 16.5C15.0413 16.5 13.6424 15.9205 12.6109 14.8891C11.5795 13.8576 11 12.4587 11 11C11 9.54131 11.5795 8.14236 12.6109 7.11091C13.6424 6.07946 15.0413 5.5 16.5 5.5ZM16.5 19.25C22.5775 19.25 27.5 21.7113 27.5 24.75V27.5H5.5V24.75C5.5 21.7113 10.4225 19.25 16.5 19.25Z"
                  fill="black"
                />
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">
                Crear un nuevo usuario
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/admin/usuarios/"
              className="flex items-center p-3 text-base font-bold text-gray-900 rounded-lg bg-gray-50 hover:bg-gray-100 group hover:shadow "
            >
              <svg
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 23.375V26.125H2.75V23.375C2.75 23.375 2.75 17.875 12.375 17.875C22 17.875 22 23.375 22 23.375ZM17.1875 10.3125C17.1875 9.36067 16.9053 8.43022 16.3764 7.63881C15.8476 6.8474 15.096 6.23057 14.2167 5.86632C13.3373 5.50207 12.3697 5.40677 11.4361 5.59246C10.5026 5.77815 9.64509 6.2365 8.97205 6.90954C8.29901 7.58258 7.84066 8.44008 7.65497 9.37362C7.46928 10.3072 7.56458 11.2748 7.92883 12.1542C8.29308 13.0335 8.90991 13.7851 9.70132 14.3139C10.4927 14.8427 11.4232 15.125 12.375 15.125C13.6514 15.125 14.8754 14.618 15.778 13.7154C16.6805 12.8129 17.1875 11.5888 17.1875 10.3125ZM21.9175 17.875C22.7628 18.5291 23.4544 19.3606 23.9438 20.3108C24.4332 21.261 24.7084 22.307 24.75 23.375V26.125H30.25V23.375C30.25 23.375 30.25 18.3837 21.9175 17.875ZM20.625 5.49999C19.6787 5.49559 18.7533 5.77847 17.9712 6.31124C18.8065 7.47825 19.2556 8.87738 19.2556 10.3125C19.2556 11.7476 18.8065 13.1467 17.9712 14.3137C18.7533 14.8465 19.6787 15.1294 20.625 15.125C21.9014 15.125 23.1254 14.618 24.028 13.7154C24.9305 12.8129 25.4375 11.5888 25.4375 10.3125C25.4375 9.03614 24.9305 7.81206 24.028 6.90954C23.1254 6.00702 21.9014 5.49999 20.625 5.49999Z"
                  fill="black"
                />
              </svg>
              <span className="flex-1 ms-3 whitespace-nowrap">
                Gestionar usuarios creados
              </span>
            </Link>
          </li>
        </ul>
        <div>
          <Link
            to="/"
            className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline"
          >
            <svg
              className="w-3 h-3 me-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7.529 7.988a2.502 2.502 0 0 1 5 .191A2.441 2.441 0 0 1 10 10.582V12m-.01 3.008H10M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            ¿Desea volver al inicio? Click aquí
          </Link>
        </div>
      </div>
    );
};

export default AdminOptions;
