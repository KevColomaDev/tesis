import { useEffect, useState } from 'react';
import Reporte from '../components/Reporte';
import { getAllDonationsRequest } from '../api/auth';

const Donaciones = () => {
    const [isOtherItem, setIsOtherItem] = useState(true);
    const [itemName, setItemName] = useState('')
    const [itemQuantity, setItemQuantity] = useState(0)
    const [items, setItems] = useState([])
    const [donations, setDonations] = useState([])
    const [showReport, setShowReport] = useState(false);

    const toggleReport = () => {
        setShowReport(!showReport);
    };

    useEffect(() => {
    const donationsData = async () => {
        const aux = await getAllDonationsRequest()
        const donationsArray = Object.entries(aux)
        setDonations(donationsArray);
    }
    donationsData()
    }, [donations])

    const handleChange = (e) => {
        if (e.target.value === 'Otro') {
            setIsOtherItem(true)
        }else {
            setIsOtherItem(false)
            setItemName(e.target.value)
        }
    }
    const handleChangeQuantity = (e) => {
        setItemQuantity(e.target.value)
    }
    const handleClickItem = (e) => {
        e.preventDefault()
        if (items.find(item => item.name === itemName)){
            const newItems = items.map(item => {
                if(item.name === itemName){
                    item.quantity = Number(item.itemQuantity) + itemQuantity
                }
                return item
            })
            setItems(newItems)
        }else{
            items.push({name:itemName, quantity: itemQuantity})
        }
        setItemQuantity(0)
    }

    useEffect(()=>{
        console.log(items)
        setItems(items)
    },[items])

    return (
        <div className="p-4 md:p-8 bg-gray-100 min-h-screen flex flex-col items-center">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {donations.map(donation => (
                    <div key={donation[1]._id} className="bg-blue-200 text-center p-4 rounded-lg shadow-md">
                        <p className="text-2xl sm:text-4xl font-bold">{donation[1].quantity}</p>
                        <p className="text-sm sm:text-lg">{donation[1].name}</p>
                    </div>
                ))}
            </div>
            <button
                className="bg-sky-800 text-white px-4 py-2 rounded-lg shadow-md mb-8 hover:bg-sky-950 transition-colors"
                onClick={toggleReport}
            >
                Generar Reporte
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full justify-items-center"> {/* Responsivo: 1 columna en móviles, 2 en pantallas más grandes */}
                <div className="bg-gray-200 p-6 rounded-lg shadow-md w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-4 text-center">Campaña</h3>
                    <form className="space-y-4 w-full">
                        <label className="flex justify-between items-center">
                            Campaña:
                            <input type="text" className="w-full ml-1 p-1 border rounded-md" />
                        </label>
                        {items.map((item, index) => (
                            <div key={index} className='flex justify-between items-center'>
                                <div className='w-24 p-2 border rounded-md'>{item.name}</div>
                                <div className='w-24 p-2 border rounded-md'>{item.quantity}</div>
                            </div>
                        ))}
                        <label className="flex justify-between items-center">
                            <select onChange={handleChange} name="item" className='w-40 p-2 border rounded-md'>
                                {donations.map(donation => (
                                    <option key={donation[1]._id} value={donation[1].name}>{donation[1].name}</option>
                                ))}
                                <option value="Otro" onChange={handleChange}>Ingresar Otro</option>
                            </select>
                            <input name='quantity' value={itemQuantity} onChange={handleChangeQuantity} type="number" max="99" className="w-24 p-2 border rounded-md" placeholder='Cantidad' />
                            {!isOtherItem && <button onClick={handleClickItem} className="px-4 py-2 bg-sky-800 text-white font-bold rounded-md hover:bg-sky-950">+</button>}
                        </label>
                        {isOtherItem && (
                        <label className="flex justify-between">
                            <input type="text" className="w-full mr-2 p-2 border rounded-md" placeholder='Nombre del nuevo item'/>
                            <button className="px-4 py-2 bg-sky-800 text-white font-bold rounded-md hover:bg-sky-950">+</button>
                        </label>
                        )}
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-sky-800 text-white rounded-md hover:bg-sky-950"
                            >
                                Registrar Campaña
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-gray-200 p-6 rounded-lg shadow-md w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-4 text-center">Beneficiario</h3>
                    <form className="space-y-4 w-full">
                        <label className="flex justify-between items-center">
                            Beneficiado:
                            <input type="text" className="w-full p-1 border rounded-md" />
                        </label>
                        <label className="flex justify-between items-center">
                            Cédula:
                            <input type="text" className="w-full p-1 border rounded-md" />
                        </label>
                        <label className="flex justify-between items-center">
                            Donación:
                            <select className="w-full p-2 border rounded-md">
                                {donations.map(donation => (
                                    <option key={donation[1]._id} value={donation[1].name}>{donation[1].name}</option>
                                ))}
                            </select>
                        </label>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-sky-800 text-white rounded-md hover:bg-sky-950"
                            >
                                Asignar
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {showReport && <Reporte toggleReport={toggleReport} />}
        </div>
    );
};

export default Donaciones;
