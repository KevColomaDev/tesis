import { useEffect, useState } from "react";
import { ReporteSuministros } from "../components/ReporteSuministros";
import {
  addStockRequest,
  assignSuppliesRequest,
  deleteSupplyRequest,
  getAllRoomsRequest,
  getAllSuppliesRequest,
} from "../api/auth";
import SupplyForm from "../components/SupplyForm";
import { Mensaje } from "../components/Message";

const Suministros = () => {
  const [showReport, setShowReport] = useState(false);
  const [showSupplyForm, setShowSupplyForm] = useState(false);
  const [supplies, setSupplies] = useState([]);
  const [form, setForm] = useState({});
  const [formAssign, setFormAssign] = useState({});
  const [room, setRoom] = useState(1);
  const [numberRooms, setNumberRooms] = useState(1);

  //Message states
  const [typeMessage, setTypeMessage] = useState('')
  const [message, setMessage] = useState('')

  //Loading states
  const [loadingAddStock, setLoadingAddStock] = useState(false)
  const [loadingAssign, setLoadingAssign] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)

  useEffect(() => {
    suppliesData();
    setNRooms();
  }, []);

  const setNRooms = async () => {
    setNumberRooms(await getAllRoomsRequest())
  }
  const suppliesData = async () => {
    const aux = await getAllSuppliesRequest();
    const suppliesArray = Object.entries(aux);
    setSupplies(suppliesArray);
  };

  const toggleReport = () => {
    setShowReport(!showReport);
  };

  const toggleSupplyForm = async () => {
    setShowSupplyForm(!showSupplyForm);
    await suppliesData();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: Number(value) });
  };

  const handleChangeAssign = (e) => {
    const { name, value } = e.target;
    setFormAssign({ ...formAssign, [name]: Number(value) });
  };
  const handleChangeRoom = (e) => {
    setRoom(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const suppliesArray = Object.keys(form).map((key) => [key, form[key]]);
    suppliesArray.map(async (supply) => {
      try {
        setLoadingAddStock(true)
        const response = await addStockRequest(supply[0], {
          quantity: supply[1],
        });
        if (response) {
          form[supply[0]] = '';
          await suppliesData();
          setMessage(response.msg || response.data.msg)
          setTypeMessage(response.status === 400 ? 'Error: ': '')
          setTimeout(()=>{
            setMessage('')
            setTypeMessage('')
          },3000)
        }        
      } catch (error) {
        console.log(error)
        setLoadingAddStock(false)
      }finally{
        setLoadingAddStock(false)
      }
    });
  };

  const handleSubmitAssign = async (e) => {
    e.preventDefault();
    const suppliesDataAssign = [];
    Object.keys(formAssign).forEach((key) =>
    {
      if (formAssign[key]>0){
        suppliesDataAssign.push({ name: key, quantity: formAssign[key] })
      }
    }
    );
    const dataRequest = {
      supplies: suppliesDataAssign,
    };
    try {
      setLoadingAssign(true)
      const response = await assignSuppliesRequest(room, dataRequest);
      if (response.status === 200) {
        setRoom(1);
        // Reset values
        for (let key in formAssign) {
          if (Object.prototype.hasOwnProperty.call(formAssign, key)) {
            formAssign[key] = ''
          }
        }
        setMessage(response.data.msg)
        setTimeout(()=>{
          setMessage('')
        },3000)
        await suppliesData();
      }else{
        setTypeMessage('Error: ')
        setMessage(response.data.msg)
        setTimeout(()=>{
          setTypeMessage('')
          setMessage('')
        }, 3000)
      }
    } catch (error) {
      console.log(error)
      setLoadingAssign(false)
    }finally{
      setLoadingAssign(false)
    }
  };

  //Consume delete supply endpoint
  const handleDeleteSupply = async (id) => {
    try {
      setLoadingDelete(true)
      const response = await deleteSupplyRequest(id);
      console.log(response);
      if (response.status === 200) {
        setMessage(response.data.msg)
        setTimeout(()=> {
          setMessage('')
        }, 3000)
        await suppliesData();
      }else{
        setTypeMessage('Error: ')
        setMessage(response.data.msg)
        setTimeout(()=>{
          setTypeMessage('')
          setMessage('')
        }, 3000)
      }
      
    } catch (error) {
      console.log(error)
      setLoadingDelete(false)
    } finally {
      setLoadingDelete(false)
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {supplies.map((supply, index) => (
          <div
            key={supply[1]._id}
            className={`flex flex-col justify-center ${
              supply[1].quantity < 10 ? "bg-red-200" : "bg-blue-200"
            } text-center ${index > 3 ? "p-1" : "p-4"} rounded-lg shadow-md`}
          >
            <p
              className={`${
                index > 3 ? "text-xl sm:text-2xl" : "text-2xl sm:text-4xl"
              }  font-bold`}
            >
              {supply[1].quantity}
            </p>
            <p className="text-sm sm:text-lg">{supply[1].name}</p>
            {supply[1].quantity === 0 && (
              <p className="text-xs text-red-500 font-bold">
                <span
                  onClick={() => handleDeleteSupply(supply[1]._id)}
                  className="text-center hover:cursor-pointer"
                >
                  {loadingDelete ? 'Eliminando' : 'Eliminar'}
                </span>
              </p>
            )}
          </div>
        ))}
        <div
          onClick={toggleSupplyForm}
          className="bg-blue-100 text-center px-4 rounded-lg shadow-md text-gray-600 hover:text-gray-950 hover:cursor-pointer"
        >
          <p className="text-2xl sm:text-4xl font-bold">+</p>
          <p className="text-sm sm:text-lg font-bold">Ingresar Suministro</p>
        </div>
      </div>

      <button
        className="bg-sky-800 text-white px-4 py-2 rounded-lg shadow-md mb-8 hover:bg-sky-950 transition-colors"
        onClick={toggleReport}
      >
        Generar Reporte
      </button>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full justify-items-center">
        <div className="bg-gray-200 p-6 rounded-lg shadow-md w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Añadir Existencias
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {supplies.map((supply) => (
              <label
              key={supply[1]._id}
                className="flex justify-between items-center"
                >
                {supply[1].name}:
                <input
                  type="number"
                  name={supply[1].name}
                  value={form[supply[1].name]}
                  onChange={handleChange}
                  min={0}
                  max="99"
                  className="w-20 p-2 border rounded-md"
                  />
              </label>
            ))}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-sky-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-sky-950 transition-colors"
                disabled={loadingAddStock}
                >
                {loadingAddStock ? 'Ingresando...' : 'Ingresar'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-gray-200 p-6 rounded-lg shadow-md w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Asignar a Habitación
          </h3>
          <form className="space-y-4 w-full" onSubmit={handleSubmitAssign}>
            <label className="flex justify-between items-center">
              Habitación:
              <input
                type="number"
                min={1}
                max={numberRooms}
                value={room}
                onChange={handleChangeRoom}
                className="w-20 p-2 border rounded-md"
                />
            </label>
            {supplies.map((supply) => (
              <label
              key={supply[1]._id}
              className="flex justify-between items-center"
              >
                {supply[1].name}:
                <input
                  name={supply[1].name}
                  value={formAssign[supply[1].name]}
                  onChange={handleChangeAssign}
                  type="number"
                  min={0}
                  max={99}
                  className="w-20 p-2 border rounded-md"
                  />
              </label>
            ))}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-sky-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-sky-950 transition-colors"
                disabled={loadingAssign}
                >
                {loadingAssign ? 'Asignando...' : 'Asignar'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {message && <Mensaje type={typeMessage} message={message}/>}
      {showReport && <ReporteSuministros toggleReport={toggleReport} />}
      {showSupplyForm && <SupplyForm toggleSupplyForm={toggleSupplyForm} />}
    </div>
  );
};

export default Suministros;
