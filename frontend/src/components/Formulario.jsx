import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { registerInRoomRequest, createPatientRequest, getPatientByCiRequest, updatePatientStateRequest } from '../api/auth';
import { Mensaje } from './Message';

const Formulario = ({ onClose, h_number, initialData, onComplete }) => {
  const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm({ defaultValues: initialData });
  const { register: registerSearch, handleSubmit: handleSubmitSearch, formState: { errors: errorsSearch }} = useForm() 
  const [error, setError] = useState({});
  const parseDate = (date) => {
    if (!date || date.includes('-')) return date
    const [day, month, year] = date.split('/')
    return `${year}-${month}-${day}`
  }

  const formatDate = (date) => {
    if (!date) return ''
    const [year, month, day] = date.split('-')
    return `${day}/${month}/${year}`
  }

  const transformTimetoString = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  const onSubmit = async (data) => {
    try {
      const formData = {
        h_number: h_number,
        ...data,
        admissionDate: data.admissionDate ? formatDate(data.admissionDate) : '',
        admissionTime: data.admissionTime ? transformTimetoString(data.admissionTime) : '',
      };
      if (initialData.name !== '---') {
        const response = await registerInRoomRequest(formData);
        if (response.msg === 'Patient registered'){
          onComplete(formData);
        }
        onClose();
        return;
      }
      await createPatientRequest(formData);
      const response = await registerInRoomRequest(formData);
      if (response.msg === 'Patient registered'){
        onComplete(formData);
      }
      onClose();
    } catch (error) {
      console.error(error);
      if (error.response.data.msg === 'Patient already admitted') {
        setError({ type: 'Error: ', message: 'El paciente ya está registrado en otra habitación' });
      }
      
    }
  };
  

  const onSearch = async (data) => {
    try {
      console.log(data.ciSearch);
      const patient = await getPatientByCiRequest(data.ciSearch)
      console.log(patient)
      setValue('name', patient.name)
      setValue('ci', patient.ci)
    } catch (error) {
      console.log(error)
      if (error.response.data.msg === 'Patient not found') {
        setError({ type: 'Error: ', message: 'Paciente no encontrado' });
      }
      if (error.response.data.msg === 'Patient already admitted') {
        setError({ type: 'Error: ', message: 'El paciente ya está registrado en una habitación' });
      }
    }
  }

  useEffect(() => {
    const formattedData = {
      name: initialData?.name && initialData.name.includes('-') ? '' : initialData?.name || '',
      ci: initialData?.ci && initialData.ci.includes('-') ? '' : initialData?.ci || '',
      condition: initialData?.condition && initialData.condition.includes('-') ? '' : initialData?.condition || '',
      food: initialData?.food && initialData.food.includes('-') ? '' : initialData?.food || '',
      admissionDate: initialData?.admissionDate && initialData.admissionDate.includes('-') ? '' : parseDate(initialData?.admissionDate || ''),
      observations: initialData?.observations && initialData.observations.includes('-') ? '' : initialData?.observations || ''
    }
    reset(formattedData)
  }, [initialData, reset])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
        <div className="bg-gray-200 p-8 mb-4 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4 text-center">Buscar paciente</h3>
          <div className="xl:w-96">
            <form className="relative flex w-full flex-wrap items-stretch" onSubmit={handleSubmitSearch(onSearch)}>
              <input
                type="search"
                name="ciSearch"
                className="relative m-0 block flex-auto rounded border border-solid border-neutral-700 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none placeholder:text-sm"
                placeholder="Escriba la cédula del paciente"
                aria-label="Search"
                aria-describedby="button-addon2"
                {...registerSearch('ciSearch', {
                  required: true,
                  pattern: {
                    value: /^[0-9]+$/i,
                    message: "Solo se permiten números."
                  },
                  minLength: {
                    value: 10,
                    message: 'La cédula debe tener al menos 10 caracteres.'
                  },
                  maxLength: {
                    value: 10,
                    message: 'La cédula no puede tener más de 10 caracteres.'
                  }
                })}
              />
              <button
                type="submit"
                className="input-group-text flex items-center whitespace-nowrap rounded px-3 py-1.5 text-center text-base font-normal text-neutral-700 dark:text-neutral-400"
                id="basic-addon2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </form>
            <div className='h-6'>
              {errorsSearch.ciSearch && <span className="text-red-500 text-sm ">{errorsSearch.ciSearch.message}</span>}
            </div>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-4 text-center">Ingreso de paciente</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Campo de nombre */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="name"
              placeholder="Ingrese el nombre"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-sky-900 focus:ring-2 focus:outline-none"
              {...register('name', {
                required: 'Este campo es requerido',
                pattern: {
                  value: /^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+$/i,
                  message: "Solo se permiten letras y espacios."
                },
                minLength: {
                  value: 3,
                  message: 'El nombre debe tener al menos 3 caracteres.'
                },
                maxLength: {
                  value: 30,
                  message: 'El nombre no puede tener más de 30 caracteres.'
                }          
              })}
            />
            {errors.nombres && <p className="text-red-500 text-sm">{errors.nombres.message}</p> }
          </div>

          {/* Campo de cedula */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Cédula</label>
            <input
              type="text"
              name="ci"
              placeholder="Ingrese el numero de cedula"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-sky-900 focus:ring-2 focus:outline-none"
              {...register('ci', {
                required: 'Este campo es requerido',
                pattern: {
                  value: /^[0-9]+$/i,
                  message: "Solo se permiten números."
                },
                minLength: {
                  value: 8,
                  message: 'La cedula debe tener al menos 8 caracteres.'
                },
                maxLength: {
                  value: 10,
                  message: 'La cedula no puede tener más de 10 caracteres.'
                }          
              })}
            />
          </div>

          {/* Campo de condición */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Condición</label>
            <input
              type="text"
              name="condition"
              placeholder="Ingrese la condición"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-sky-900 focus:ring-2 focus:outline-none"
              {...register('condition', {
                required: 'Este campo es requerido',
                pattern: {
                  value: /^[A-Za-z\s]+$/i,
                  message: "Solo se permiten letras y espacios."
                },
                minLength: {
                  value: 3,
                  message: 'La condición debe tener al menos 3 caracteres.'
                },
                maxLength: {
                  value: 30,
                  message: 'La condición no puede tener más de 30 caracteres.'
                }          
              })}
            />
            { errors.condicion && <p className="text-red-500 text-sm">{errors.condicion.message}</p> }
          </div>

          {/* Campo de comida */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Comida</label>
            <select
              name="food"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-sky-900 focus:ring-2 focus:outline-none"
              {...register('food', {
                required: 'Este campo es requerido',
              })}
            >
              <option value="">Seleccione</option>
              <option value="Blanda">Blanda</option>
              <option value="Normal">Normal</option>
              <option value="Líquida">Líquida</option>
            </select>
            {errors.comidas && <p className="text-red-500 text-sm">{errors.comidas.message}</p> }
          </div>

          {/* Campo de fecha de ingreso */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Fecha de Ingreso</label>
            <input
              type="date"
              name="admissionDate"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-sky-900 focus:ring-2 focus:outline-none"
              {...register('admissionDate', {
                required: 'Este campo es requerido',
              })}
            />
            {errors.fechaIngreso && <p className="text-red-500 text-sm">{errors.fechaIngreso.message}</p> }
          </div>

          {/* Campo de hora de ingreso */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Hora de Ingreso</label>
            <input
              type="time"
              name="admissionTime"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-sky-900 focus:ring-2 focus:outline-none"
              {...register('admissionTime', {
                required: 'Este campo es requerido',
              })}
            />
            {errors.horaIngreso && <p className="text-red-500 text-sm">{errors.horaIngreso.message}</p> }
          </div>


          {/* Campo de observaciones */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Observaciones</label>
            <textarea
              name="observations"
              placeholder="Ingrese las observaciones"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-sky-900 focus:ring-2 focus:outline-none"
              {...register('observations')}
            />
            {errors.observaciones && <p className="text-red-500 text-sm">{errors.observaciones.message}</p> }
          </div>

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
            >
              Guardar
            </button>
          </div>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm aspect-[9/1]">
            {Object.keys(error).length > 0 && <Mensaje type={error.type} message={error.message}/>}
          </div>
        </form>
      </div>
    </div>
  );
};

Formulario.propTypes = {
  onClose: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  h_number: PropTypes.number.isRequired,
  initialData: PropTypes.object
};
export default Formulario;


