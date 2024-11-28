import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import InfoSection from '../../components/InfoSection';
import Form from '../../components/Form';


function Crearproveedor() {
  const [formData, setFormData] = useState({ nombre_proveedor: '', encargado: '', telefono: '', email: '' });
  const navigate = useNavigate();

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/proveedorescreate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Navegar de vuelta a la lista de proveedores después de crear el proveedor
        navigate('/Gestionproveedores');
      } else {
        alert('Error al crear la proveedor');
      }
    } catch (error) {
      console.error('Error al crear la proveedor:', error);
      alert('Error al crear la proveedor');
    }
  };

  const fields = [
    { name: 'nombre_proveedor', type: 'text', label: 'Nombre del proveedor', placeholder: 'Ingresa el nombre del proveedor', required: true },
    { name: 'encargado', type: 'text', label: 'Encargado', placeholder: 'Ingrese el nombre del encargado del proveedor', required: false },
    { name: 'telefono', type: 'text', label: 'Teléfono', placeholder: 'Ingrese el número de teléfono del proveedor', required: false },
    { name: 'email', type: 'text', label: 'Correo Electrónico', placeholder: 'Ingrese el correo electrónico del proveedor', required: false }
  ];

  const buttons = [
    { text: 'Cancelar', type: 'button', className: 'buttons-can', onClick: () => navigate('/Gestionproveedores'), hidden: false },
    { text: 'Crear proveedor', type: 'submit', hidden: false },
  ];
  
  return (
    <Layout>
      <InfoSection
        title="Crear nuevo proveedor"
        showSubtitle={false} // Mostrar subtítulo
        showDescription={false} // Mostrar descripción
      />
      
      <Form
      fields={fields}
      title="Información del proveedor"
      buttons={buttons}
      onSubmit={handleSubmit}
      formData={formData}
      setFormData={setFormData}
      />
    </Layout>
  );
}

export default Crearproveedor;
