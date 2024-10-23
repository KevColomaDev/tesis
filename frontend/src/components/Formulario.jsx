import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { registerInRoomRequest } from '../api/auth';

const Formulario = ({ onClose, h_number, initialData, onComplete }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: initialData });
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

  const onSubmit = async (data) => {
    try {
      console.log(data)
      const formData = {
        h_number: h_number,
        ...data,
        admissionDate: data.admissionDate ? formatDate(data.admissionDate) : ''
      }
      const response = await registerInRoomRequest(formData)
      if (response.msg === 'Patient registered') {
        onComplete(formData)
      } else {
        onComplete()
      }
    } catch (error) {
      console.log(error)
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

          {/* Campo de fecha de egreso */}
          {/* <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Fecha de Egreso</label>
            <input
              type="date"
              name="departureDate"
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-sky-900 focus:ring-2 focus:outline-none"
              {...register('departureDate', {
                required: 'Este campo es requerido',
              })}
            />
            {errors.fechaSalida && <p className="text-red-500 text-sm">{errors.fechaSalida.message}</p> }
          </div> */}

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


