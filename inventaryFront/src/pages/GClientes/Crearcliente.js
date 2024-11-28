import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import InfoSection from '../../components/InfoSection';
import Form from '../../components/Form';


function Crearclientes() {
  const [formData, setFormData] = useState({ tipo_documento: '', documento: '', nombre_cliente: '', email: '',  telefono: '', ciudad: '', direccion: '' });
  const navigate = useNavigate();

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/clientescreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Navegar de vuelta a la lista de clientes después de crear el cliente
        navigate('/Gestionclientes');
      } else {
        alert('Error al crear el cliente');
      }
    } catch (error) {
      console.error('Error al crear el cliente:', error);
      alert('Error al crear el cliente server');
    }
  };

  // Definir los campos del formulario
  const fields = [
    { name: 'tipo_documento', label: 'Tipo de Documento', type: 'select', required: true },
    { name: 'documento', label: 'Número de documento', type: 'text', placeholder:'Ingrese el numero de documento', required: true },
    { name: 'nombre_cliente', label: 'Nombre del cliente', type: 'text', placeholder: 'Ingrese el nombre del cliente', required: true },
    { name: 'email', label: 'Correo Electrónico', type: 'email', placeholder: 'correo@ejemplo.com', required: true },
    { name: 'telefono', label: 'Teléfono', type: 'text', placeholder: 'Ingrese el número de teléfono', required: true },
    { name: 'ciudad', label: 'Ciudad', type: 'text', placeholder: 'Ingrese la ciudad', required: true },
    { name: 'direccion', label: 'Dirección', type: 'text', placeholder: 'Ingrese la dirección', required: true },
  ];

  // Cargar opciones de cargos en el select
  const selectOptions = {
    tipo_documento: [
      { value: 'CC', label: 'Cédula de Ciudadanía' },
      { value: 'TI', label: 'Tarjeta de Identidad' },
      { value: 'PA', label: 'Pasaporte' },
    ]
  };

  const buttons = [
    { text: 'Cancelar', type: 'button', className: 'buttons-can', onClick: () => navigate('/Gestionclientes'), hidden: false },
    { text: 'Crear Cliente', type: 'submit', hidden: false },
  ];
  
  return (
    <Layout>
      <InfoSection
        title="Crear nuevo cliente"
        showSubtitle={false} // Mostrar subtítulo
        showDescription={false} // Mostrar descripción
      />
      
      <Form
      fields={fields}
      title="Información de cliente"
      buttons={buttons}
      onSubmit={handleSubmit}
      formData={formData}
      setFormData={setFormData}
      selectOptions={selectOptions}
      />
    </Layout>
  );
}

export default Crearclientes;
