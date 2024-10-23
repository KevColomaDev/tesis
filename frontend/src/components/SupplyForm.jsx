import { useEffect, useState } from 'react';
import { newSupplyRequest } from '../api/auth';

const SupplyForm = ({ toggleSupplyForm }) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    quantity: 0,
    description: ''
  });

  const handleChange = (e) => {
    const { name, value} = e.target
    setFormData({ 
      ...formData, 
      [name]: name === 'quantity' ? Number(value) : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await newSupplyRequest(formData);
    if (response && response.msg) {
      setErrorMessage(response.msg);
      setTimeout(() => {
        setErrorMessage('')
      },3000)
    }
    if (Object.keys(response).includes('name')){
      setFormData({
        name: '',
        quantity: 0,
        description: ''
      });
      toggleSupplyForm()
    }
    if (Object.keys(response[0]).includes('code')) {
      setErrorMessage(response[0].message);
      setTimeout(() => {
        setErrorMessage('')
      },3000)
    }

    setIsLoading(false)
  };
  

  return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex flex-col justify-center items-center">
        <div className={`bg-white p-8 ${errorMessage ? 'rounded-t-lg' : 'rounded-lg'} shadow-lg max-w-sm w-full`}>
          <h2 className="text-xl font-semibold mb-4">Nuevo Suministro</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="text-gray-700">Nombre</span>
              <input 
                type="text"
                name='name'
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-sky-900 focus:ring-2 focus:outline-none"/>
            </label>

            <label className="block">
              <span className="text-gray-700">Cantidad</span>
                <div className="mb-3">
                  <input
                    type="number"
                    min={0}
                    max={50}
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-sky-900 focus:ring-2 focus:outline-none"
                  />
                </div>
            </label>

            <label className="block">
              <span className="text-gray-700">Descripción (Opcional)</span>
                <div className="mb-3">
                  <input
                    type="text"
                    min={0}
                    max={50}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:ring-sky-900 focus:ring-2 focus:outline-none"
                  />
                </div>
            </label>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={toggleSupplyForm}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                disabled={isLoading}
              >
                Registrar
              </button>
            </div>
          </form>
        </div>
        {errorMessage && (
          <div className="p-4 text-sm text-red-800 rounded-b-lg bg-red-50 shadow-lg max-w-sm w-full" role="alert">
            <span className="font-medium">Error!</span> {errorMessage}
          </div>
        )}
      </div>
  );
};

export default SupplyForm;
