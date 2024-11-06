import { useEffect, useState } from 'react';
import Reporte from '../components/Reporte';
import { createCampaignRequest, getAllDonationsRequest, verifyCedulaRequest } from '../api/auth';

const Donaciones = () => {
    const [items, setItems] = useState([])
    const [donations, setDonations] = useState([])

    const [isOtherItem, setIsOtherItem] = useState(true);
    const [validInputName, setValidInputName] = useState(true)
    const [validInput, setValidInput] = useState(true)
    
    const [campaignName, setCampaignName] = useState('')
    const [itemName, setItemName] = useState('')
    const [newItemName, setNewItemName] = useState('')
    const [itemQuantity, setItemQuantity] = useState(0)
    
    const [showReport, setShowReport] = useState(false);
    const [selectedItem, setSelectedItem] = useState('');

    const [cedula, setCedula] = useState("");
    const [beneficiaryData, setBeneficiaryData] = useState(null);
    const [isVerified, setIsVerified] = useState(false);

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
        const selectedValue = e.target.value;
    
        if (selectedValue === 'Otro') {
            setIsOtherItem(true);
            setItemName(''); 
        } else {
            setIsOtherItem(false);
            setNewItemName(''); 
            setItemName(selectedValue);
    
            if (selectedValue === 'Dinero') {
                setItemQuantity(''); 
            } else {
                setItemQuantity('');
            }
        }
    };
    const handleChangeQuantity = (e) => { setItemQuantity(e.target.value) }
    const handleChangeNewItemName = (e) =>{ setNewItemName(e.target.value) }
    const handleCamapaignName = e => { setCampaignName(e.target.value) }

// ---------------------------------- ESTO ----------------------------------------------------//

    const handleCedulaSubmit = async () => {
        try {
            const response = await verifyCedulaRequest(cedula);
            if (response) {  
                setBeneficiaryData(response.beneficiary);  
                setIsVerified(true);
            } else {
                setBeneficiaryData(null);  
                setIsVerified(false);  
                console.log("Cédula no válida");
            }
        } catch (error) {
            console.error("Error al verificar la cédula:", error);  
            setBeneficiaryData(null);
            setIsVerified(false);
        }
    };

    const handleRemoveItem = (index) => {
    const newItems = [...items];  
    newItems.splice(index, 1);  
    setItems(newItems);  
};

    const handleClickItem = () => {
        if (itemQuantity > 0 && itemQuantity < 100){
            // If item already exists add the quantity to them
            if (items.find(item => item.name === itemName)){
                const newItems = items.map(item => {
                    if(item.name === itemName){
                        item.quantity = Number(item.quantity) + Number(itemQuantity)
                    }
                    return item
                })
                setItems(newItems)
            }else{
                items.push({name:itemName, quantity: Number(itemQuantity)})
            }
            setItemQuantity(0)
        } else {
            setValidInput(false);
            setTimeout(() => setValidInput(true),2000)
        }
    }

    const handleClickNewItem = () => {
        if (itemQuantity > 0 && itemQuantity < 100){
            if (newItemName !== ''){
                // If item already exists add the quantity to them
                if (items.find(item => item.name === newItemName)){
                    const newItems = items.map(item => {
                        if(item.name === newItemName){
                            item.quantity = Number(item.quantity) + Number(itemQuantity)
                        }
                        return item
                    })
                    setItems(newItems)
                }else{
                    items.push({name: newItemName, quantity: Number(itemQuantity)})
                }
                setItemQuantity(0)
            } else {
                setValidInputName(false)
                setTimeout(() => setValidInputName(true),2000)
            }
        } else {
            setValidInput(false);
            setTimeout(() => setValidInput(true),2000)
        }
    }

    const handleSubmit = async () => {
        const form = {
            name: campaignName,
            items: items
        }
        const response = await createCampaignRequest(form);
        if (Object.keys(response).includes('response')) {
            console.log(response.response.data.msg)
        }else {
            setCampaignName('')
            setItems([])
            setItemQuantity(0)
            
            console.log(response)
        }
    }

    useEffect(()=>{
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
                    <div className="space-y-4 w-full">
                        <label className="flex justify-between items-center">
                            Campaña:
                            <input onChange={handleCamapaignName} value={campaignName} type="text" className="w-full ml-1 p-1 border rounded-md" />
                        </label>
                        {items.map((item, index) => (
                            <div key={index} className='flex justify-between items-center'>
                                <div className='w-24 p-2 border rounded-md'>{item.name}</div>
                                <div className='w-24 p-2 border rounded-md'>{item.quantity}</div>
                                <button 
                                    onClick={() => handleRemoveItem(index)} 
                                    className="w-8 h-8 bg-red-500 text-white font-bold rounded-md hover:bg-red-700 flex items-center justify-center text-xl"
                                    style={{ marginLeft: '10px' }} // Ajustar margen izquierdo
                                >
                                    -
                                </button>
                            </div>
                        ))}
                        <label className="flex justify-between items-center">
                            <select onChange={handleChange} name="item" className='w-40 p-2 border rounded-md'>
                                {donations.map(donation => (
                                    <option key={donation[1]._id} value={donation[1].name}>{donation[1].name}</option>
                                ))}
                                <option value="Otro">Ingresar Otro</option>
                            </select>
                            <input 
                                name="quantity" 
                                value={itemQuantity} 
                                onChange={handleChangeQuantity} 
                                type="number" 
                                max="99" 
                                min="0" 
                                step={selectedItem === "Dinero" ? "0.01" : "1"} // Permitir decimales solo si "Dinero" está seleccionado
                                className={`w-24 p-2 border rounded-md ${!validInput ? 'border-red-500' : ''}`} 
                                placeholder="Cantidad" 
                            />
                            {!isOtherItem && 
                                <button onClick={handleClickItem} className="px-4 py-2 bg-sky-800 text-white font-bold rounded-md hover:bg-sky-950">+</button>
                            }
                        </label>
                        {isOtherItem && (
                            <label className="flex justify-between">
                            <input 
                                type="text" 
                                onChange={handleChangeNewItemName} 
                                value={newItemName} 
                                className={`w-full mr-2 p-2 border rounded-md ${!validInputName ? 'border-red-500' : ''}`} 
                                placeholder="Nombre del nuevo item"
                            />
                            <button 
                                onClick={handleClickNewItem} 
                                className="px-4 py-2 bg-sky-800 text-white font-bold rounded-md hover:bg-sky-950"
                            >
                                +
                            </button>
                        </label>
                        )}
                        <div className="flex justify-center">
                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-sky-800 text-white rounded-md hover:bg-sky-950"
                            >
                                Registrar Campaña
                            </button>
                        </div>
                    </div>
                </div>


                <div className="bg-gray-200 p-6 rounded-lg shadow-md w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-4 text-center">Beneficiario</h3>
                    <form className="space-y-4 w-full">
                        <label className="flex justify-between items-center">
                        Cédula:
                        <div className="flex items-center w-full">
                            <input
                            type="text"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            className="w-3/4 p-1 border rounded-md"
                            placeholder="Ingrese la cédula"
                            />
                            <button
                            type="button"
                            onClick={handleCedulaSubmit}
                            className="w-1/4 ml-2 px-4 py-1 bg-sky-800 text-white rounded-md hover:bg-sky-950"
                            >
                            Verificar
                            </button>
                        </div>
                        </label>

                        {isVerified && beneficiaryData && (
                        <div className="mt-4 space-y-2">
                            <div className="flex justify-between">
                            <span>Nombre:</span>
                            <span>{beneficiaryData.nombre}</span>
                            </div>
                            <div className="flex justify-between">
                            <span>Apellido:</span>
                            <span>{beneficiaryData.apellido}</span>
                            </div>
                            <div className="flex justify-between">
                            <span>Correo:</span>
                            <span>{beneficiaryData.email}</span>
                            </div>
                            <div className="flex justify-between">
                            <span>Teléfono:</span>
                            <span>{beneficiaryData.telefono}</span>
                            </div>
                        </div>
                        )}

                        {!isVerified && beneficiaryData === null && (
                        <div className="mt-4 text-red-500">Cédula no encontrada</div>
                        )}

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