import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import InfoSection from '../../components/InfoSection';
import Form from '../../components/Form';

function Verclientes() {
  const { id } = useParams();  // Obtener el ID del cliente desde los parámetros de la URL
  const [formData, setFormData] = useState({ tipo_documento: '', documento: '', nombre_cliente: '', email: '',  telefono: '', ciudad: '', direccion: '' });
  const navigate = useNavigate();

  // Función para cargar los datos del cliente desde el backend
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await fetch(`http://localhost:3001/clientesver/${id}`);
        const data = await response.json();
        console.log("Datos cargados: ",data);
        setFormData(data[0]);
        
      } catch (error) {
        console.error('Error al cargar el cliente:', error);
      }
    };

    fetchCliente();
  }, [id]);

  const fields = [
    { name: 'tipo_documento', label: 'Tipo de Documento', type: 'text', required: true, readOnly: true },
    { name: 'documento', label: 'Número de documento', type: 'text', placeholder:'Ingrese el numero de documento', required: true, readOnly: true },
    { name: 'nombre_cliente', label: 'Nombre del cliente', type: 'text', placeholder: 'Ingrese el nombre del cliente', required: true, readOnly: true },
    { name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'correo@ejemplo.com', required: true, readOnly: true },
    { name: 'telefono', label: 'Teléfono', type: 'text', placeholder: 'Ingrese el número de teléfono', required: true, readOnly: true },
    { name: 'ciudad', label: 'Ciudad', type: 'text', placeholder: 'Ingrese la ciudad', required: true, readOnly: true },
    { name: 'direccion', label: 'Dirección', type: 'text', placeholder: 'Ingrese la dirección', required: true, readOnly: true },
  ];

  const buttons = [
    { text: 'Volver', type: 'button', className: 'buttons-can', onClick: () => navigate('/Gestionclientes'), hidden: false },
  ];

  return (
    <Layout>
      <InfoSection
        title="Ver cliente"
        showSubtitle={false} // Mostrar subtítulo
        showDescription={false} // Mostrar descripción
      />
        <Form
          fields={fields}
          title="Información del cliente"
          buttons={buttons}
          formData={formData}
          setFormData={setFormData}
        />

    </Layout>
  );
}

export default Verclientes;
