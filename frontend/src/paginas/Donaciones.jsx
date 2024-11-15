import { useEffect, useState } from 'react';
import ShowCampaigns from '../components/showCampaigns';
import { createCampaignRequest, getAllDonationsRequest, verifyCedulaRequest, createBeneficiaryRequest, updateBeneficiaryRequest, assignDonationsRequest } from '../api/auth';
import { ReporteDonaciones } from '../components/ReporteDonaciones';



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

    const [isCedulaNotFound, setIsCedulaNotFound] = useState(false);

    const [donationItems, setDonationItems] = useState([]);  // Para la lista de donaciones
    const [donationCedula, setDonationCedula] = useState("");  // Para la cédula
    const [donationItemName, setDonationItemName] = useState("default");  // Nombre del artículo
    const [donationItemQuantity, setDonationItemQuantity] = useState(0);  // Cantidad del artículo
    


    const handleAddDonationItem = () => {
        if (donationItemName === 'default') {
            alert("Selecciona un item!")
        }else{
            if (donationItemQuantity > 0 && donationItemQuantity < 100) {
                // Agregar artículo a la lista de donaciones
                const newDonationItems = [...donationItems, { name: donationItemName, quantity: Number(donationItemQuantity) }];
                setDonationItems(newDonationItems);
                setDonationItemQuantity(0);
                setDonationItemName("default");  // Limpiar campo de nombre del artículo
            } else {
                alert("Cantidad no válida, debe ser entre 1 y 99.");
            }
        }
    };

    const handleRemoveDonationItem = (index) => {
        const updatedItems = [...donationItems];
        updatedItems.splice(index, 1); // Elimina el ítem en el índice dado
        setDonationItems(updatedItems); // Actualiza el estado con la nueva lista
    };


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
    const handleCampaignName = e => { setCampaignName(e.target.value) }

    const [showModal, setShowModal] = useState(false);
    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);


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


const handleUpdateBeneficiary = async () => {
        try {
            const updatedData = {
                cedula,
                nombre: beneficiaryData.nombre,
                apellido: beneficiaryData.apellido,
                email: beneficiaryData.email,
                telefono: beneficiaryData.telefono,
            };
            
            const response = await updateBeneficiaryRequest(updatedData);
            if (response) {
                alert("Beneficiario actualizado exitosamente");
            } else {
                alert("Error al actualizar el beneficiario");
            }
        } catch (error) {
            console.error("Error al actualizar el beneficiario:", error);
            alert("Hubo un error al actualizar el beneficiario");
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

    const handleSubmitAssignDonations = async () =>{
        const form = {
            ci: donationCedula,
            items: donationItems
        }
        const response = await assignDonationsRequest(form)
        if (Object.keys(response).includes('response')) {
            console.log(response.response.data.msg)
        }else {
            setDonationCedula('')
            setDonationItems([])
            
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
            <div className="flex space-x-4">
                <button className="bg-sky-800 text-white px-4 py-2 rounded-lg shadow-md mb-8 hover:bg-sky-950 transition-colors"
                    onClick={handleOpenModal}
                >
                    Campañas registradas</button>
                
                <button
                    className="bg-sky-800 text-white px-4 py-2 rounded-lg shadow-md mb-8 hover:bg-sky-950 transition-colors"
                    onClick={toggleReport}
                >
                    Generar Reporte
                </button>
            </div>
    
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full justify-items-center"> {/* Ajuste a 3 columnas en pantallas grandes */}
                <div className="bg-gray-200 p-6 rounded-lg shadow-md w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-4 text-center">Agregar campaña</h3>
                    <div className="space-y-4 w-full">
                        <label className="flex justify-between items-center">
                            <input onChange={handleCampaignName} value={campaignName} type="text" placeholder="Nombre de la Campaña" className="w-full ml-1 p-1 border rounded-md" />
                        </label>
                        {items.map((item, index) => (
                            <div key={index} className='flex justify-between items-center'>
                                <div className='w-24 p-2 border rounded-md'>{item.name}</div>
                                <div className='w-24 p-2 border rounded-md'>{item.quantity}</div>
                                <button 
                                    onClick={() => handleRemoveItem(index)} 
                                    className="w-8 h-8 bg-red-500 text-white font-bold rounded-md hover:bg-red-700 flex items-center justify-center text-xl"
                                    style={{ marginLeft: '10px' }}
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
                                step={selectedItem === "Dinero" ? "0.01" : "1"} 
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
                    <h3 className="text-lg font-semibold mb-4 text-center">Beneficiarios</h3>
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
                                {beneficiaryData && (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <label className="w-1/3">Nombre:</label>
                                            <input
                                                type="text"
                                                value={beneficiaryData.nombre}
                                                onChange={(e) => setBeneficiaryData({ ...beneficiaryData, nombre: e.target.value })}
                                                className="w-2/3 p-1 border rounded-md"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <label className="w-1/3">Apellido:</label>
                                            <input
                                                type="text"
                                                value={beneficiaryData.apellido}
                                                onChange={(e) => setBeneficiaryData({ ...beneficiaryData, apellido: e.target.value })}
                                                className="w-2/3 p-1 border rounded-md"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <label className="w-1/3">Email:</label>
                                            <input
                                                type="email"
                                                value={beneficiaryData.email}
                                                onChange={(e) => setBeneficiaryData({ ...beneficiaryData, email: e.target.value })}
                                                className="w-2/3 p-1 border rounded-md"
                                            />
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <label className="w-1/3">Teléfono:</label>
                                            <input
                                                type="text"
                                                value={beneficiaryData.telefono}
                                                onChange={(e) => setBeneficiaryData({ ...beneficiaryData, telefono: e.target.value })}
                                                className="w-2/3 p-1 border rounded-md"
                                            />
                                        </div>
                                        <div className="flex justify-center">
                                        <button
                                            type="button"
                                            onClick={handleUpdateBeneficiary}
                                            className="mt-4 px-9 py-2 bg-sky-800 text-white rounded-md hover:bg-sky-950"
                                        >
                                            Guardar
                                        </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

    
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
                                <div className="flex justify-center items-center h-full">
                                    <button
                                        onClick={handleCreateBeneficiary}
                                        className="px-4 py-2 bg-sky-800 text-white rounded-md hover:bg-sky-950"
                                    >
                                        Crear beneficiario
                                    </button>
                                </div>
                            </div>
                        )}
    
                    </form>
                </div>
    
                <div className="bg-gray-200 p-6 rounded-lg shadow-md w-full max-w-md">
                    <h3 className="text-lg font-semibold mb-4 text-center">Donaciones</h3>
                    <div className="space-y-7 w-full">
                        {/* Campo para cédula */}
                        <label className="flex justify-between items-center">
                            <input
                                type="text"
                                value={donationCedula}
                                onChange={(e) => setDonationCedula(e.target.value)}
                                className="w-full p-1 border rounded-md"
                                placeholder="Ingrese la cédula"
                            />
                        </label>

                        {/* Selección de objetos */}
                        <label className="flex justify-between items-center">
                            <select onChange={(e) => setDonationItemName(e.target.value)} value={donationItemName} className="w-40 p-2 border rounded-md">
                                <option defaultChecked value={"default"}>Selecciona un item</option>
                                {donations.map(donation => (
                                    <option key={donation[1]._id} value={donation[1].name}>{donation[1].name}</option>
                                ))}
                            </select>
                            <input
                                value={donationItemQuantity}
                                onChange={(e) => setDonationItemQuantity(e.target.value)}
                                type="number"
                                min="1"
                                max="99"
                                className="w-24 p-2 border rounded-md"
                                placeholder="Cantidad"
                            />
                            <button
                                type="button"
                                onClick={handleAddDonationItem}
                                className="px-4 py-2 bg-sky-800 text-white  rounded-md hover:bg-sky-950"
                            >
                                Agregar
                            </button>
                        </label>

                        {/* Mostrar los artículos agregados */}
                        {donationItems.map((item, index) => (
                            <div key={index} className="flex justify-between items-center space-x-4">
                                <span>{item.name}</span> <span>{item.quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveDonationItem(index)}
                                    className="px-4 py-2 bg-red-600 text-white  rounded-md hover:bg-red-700"
                                >
                                    Eliminar
                                </button>
                            </div>
                        ))}

                        {/* Botón para guardar las donaciones */}
                        <div className="flex justify-center mt-4">
                            <button
                                onClick={handleSubmitAssignDonations} // Aquí puedes definir qué hacer con los datos de donaciones
                                className="px-4 py-2 bg-sky-800 text-white rounded-md hover:bg-sky-950"
                            >
                                Registrar Donaciones
                            </button>
                        </div>
                    </div>
                </div>
            </div>
    
            {showReport && <ReporteDonaciones toggleReport={toggleReport} />}
            {showModal && <ShowCampaigns onClose={handleCloseModal} />}
        </div>
    );
    
};

export default Donaciones;