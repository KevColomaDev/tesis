import { useEffect, useState } from 'react';
import Reporte from '../components/Reporte';
import { createCampaignRequest, getAllDonationsRequest, verifyCedulaRequest, createBeneficiaryRequest, assignItemsToBeneficiaryRequest } from '../api/auth';


// Falta corriguir que deje enviar los datos con el @ //

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

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");

    const [message, setMessage] = useState('');

    const [isCedulaNotFound, setIsCedulaNotFound] = useState(false);

    const [itemQuantityBeneficiarie, setItemQuantityBeneficiarie] = useState(0)
    const [itemsBeneficiarie, setItemsBeneficiarie] = useState([])
    const [itemNameBeneficiarie, setItemNameBeneficiarie] = useState('')
    const [isOtherItemBeneficiarie, setIsOtherItemBeneficiarie] = useState(true);

    

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

    const handleChangeBeneficiarie = (e) => {
        const selectedValue = e.target.value;
    
        if (selectedValue === 'Otro') {
            setIsOtherItemBeneficiarie(true);
            setItemNameBeneficiarie(''); 
        } else {
            setIsOtherItemBeneficiarie(false);
            setNewItemNameBeneficiarie(''); 
            setItemNameBeneficiarie(selectedValue);
    
            if (selectedValue === 'Dinero') {
                setItemQuantityBeneficiarie(''); 
            } else {
                setItemQuantityBeneficiarie('');
            }
        }
    };
    const handleChangeQuantity = (e) => { setItemQuantity(e.target.value) }
    const handleChangeQuantityBeneficiarie= (e) => { setItemQuantityBeneficiarie(e.target.value) }
    const handleChangeNewItemName = (e) =>{ setNewItemName(e.target.value) }
    const handleCamapaignName = e => { setCampaignName(e.target.value) }


    const handleCedulaSubmit = async () => {
        try {
            const response = await verifyCedulaRequest(cedula);
            if (response) {
                setBeneficiaryData(response.beneficiary);
                setIsVerified(true);
                setIsCedulaNotFound(false);  
            } else {
                setBeneficiaryData(null);
                setIsVerified(false);
                setIsCedulaNotFound(true);  
                console.log("Cédula no válida");
            }
        } catch (error) {
            console.error("Error al verificar la cédula:", error);
            setBeneficiaryData(null);
            setIsVerified(false);
            setIsCedulaNotFound(true);  
        }
    };


    const handleCreateBeneficiary = async () => {
        const beneficiaryData = {
          cedula,
          nombre,
          apellido,
          email,
          telefono,
        };
      
        try {
          const result = await createBeneficiaryRequest(beneficiaryData);
      
          if (result) {
            alert("Beneficiario creado exitosamente");
          } else {
            alert("Hubo un error al crear el beneficiario");
          }
        } catch (error) {
          console.error('Error al crear el beneficiario:', error);
          alert("Hubo un error inesperado al crear el beneficiario");
        }
      };




   

    const handleRemoveItem = (index) => {
    const newItems = [...items];  
    newItems.splice(index, 1);  
    setItems(newItems);  
    };

    const handleRemoveItemBeneficiarie = (index) => {
        const newItemsBeneficiarie = [...items];  
        newItemsBeneficiarie.splice(index, 1);  
        setItemsBeneficiarie(newItems);  
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

    const handleClickItemBeneficiarie = () => {
        if (itemQuantityBeneficiarie > 0 && itemQuantityBeneficiarie < 100){
            // If item already exists add the quantity to them
            if (itemsBeneficiarie.find(item => item.name === itemNameBeneficiarie)){
                const newItems = items.map(item => {
                    if(item.name === itemNameBeneficiarie){
                        item.quantity = Number(item.quantity) + Number(itemQuantityBeneficiarie)
                    }
                    return item
                })
                setItemsBeneficiarie(newItems)
            }else{
                items.push({name:itemNameBeneficiarie, quantity: Number(itemQuantityBeneficiarie)})
            }
            setItemQuantityBeneficiarie(0)
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
                            
                            <input onChange={handleCamapaignName} value={campaignName} type="text" placeholder="Nombre de la Campaña" className="w-full ml-1 p-1 border rounded-md" />
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

                    {isVerified && (
                        <div className="mt-4 space-y-2">
                            {/* Información del beneficiario */}
                            {beneficiaryData && (
                                <div className="space-y-2">
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

                            {/* Lista de elementos */}
                            {items && items.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="w-24 p-2 border rounded-md">{item.name}</div>
                                    <div className="w-24 p-2 border rounded-md">{item.quantity}</div>
                                    <button 
                                        onClick={() => handleRemoveItemBeneficiarie(index)} 
                                        className="w-8 h-8 bg-red-500 text-white font-bold rounded-md hover:bg-red-700 flex items-center justify-center text-xl"
                                        style={{ marginLeft: '10px' }} // Ajustar margen izquierdo
                                    >
                                        -
                                    </button>
                                </div>
                            ))}

                            {/* Sección para agregar un nuevo ítem */}
                            <label className="flex justify-between items-center">
                                <select onChange={handleChangeBeneficiarie} name="item" className="w-40 p-2 border rounded-md">
                                    {donations.map(donation => (
                                        <option key={donation[1]._id} value={donation[1].name}>{donation[1].name}</option>
                                    ))}
                                    
                                </select>

                                {/* Input de cantidad */}
                                <input 
                                    name="quantity" 
                                    value={itemQuantityBeneficiarie} 
                                    onChange={handleChangeQuantityBeneficiarie} 
                                    type="number" 
                                    max="99" 
                                    min="0" 
                                    step={selectedItem === "Dinero" ? "0.01" : "1"} // Permitir decimales solo si "Dinero" está seleccionado
                                    className={`w-24 p-2 border rounded-md ${!validInput ? 'border-red-500' : ''}`} 
                                    placeholder="Cantidad" 
                                />


                                {!isOtherItem && 
                                    <button onClick={handleClickItemBeneficiarie} className="px-4 py-2 bg-sky-800 text-white font-bold rounded-md hover:bg-sky-950">
                                        +
                                    </button>
                                }
                            </label>

                        </div>
                    )}

                    {/* Muestra los campos de entrada cuando la cédula no se encuentra */}
                    {isCedulaNotFound && (
                        <div className="mt-4 space-y-4">
                        <input
                            type="text"
                            placeholder="Nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full p-1 border rounded-md"
                        />
                        <input
                            type="text"
                            placeholder="Apellido"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                            className="w-full p-1 border rounded-md"
                        />
                        <input
                            type="email"
                            placeholder="Correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-1 border rounded-md"
                        />
                        <input
                            type="tel"
                            placeholder="Teléfono"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            className="w-full p-1 border rounded-md"
                        />
                        <button
                            onClick={handleCreateBeneficiary}
                            className="px-4 py-2 bg-sky-800 text-white rounded-md hover:bg-sky-950"
                        >
                            Crear beneficiario
                        </button>
                        </div>
                    )}

                    <div className="flex justify-center mt-4">
                        {/* Botón Asignar solo visible si la cédula es verificada */}
                        {isVerified && (
                            <button
                                type="submit"
                                className="px-4 py-2 bg-sky-800 text-white rounded-md hover:bg-sky-950"
                            >
                                Asignar
                            </button>
                        )}

                    </div>
                </form>
            </div>
            </div>

            {showReport && <Reporte toggleReport={toggleReport} />}
        </div>
    );
};

export default Donaciones;