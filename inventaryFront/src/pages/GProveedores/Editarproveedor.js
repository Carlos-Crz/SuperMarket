import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import InfoSection from '../../components/InfoSection';
import Form from '../../components/Form';


function Actualizarproveedor() {
  const { id } = useParams();  // Obtener el ID del proveedor desde los parámetros de la URL
  const [formData, setFormData] = useState({ nombre_proveedor: '', encargado: '', telefono: '', email: '' });
  const navigate = useNavigate();

  // Función para cargar los datos del proveedor desde el backend
  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        const response = await fetch(`http://localhost:3001/proveedoresver/${id}`);
        const data = await response.json();
        setFormData(data[0]);
      } catch (error) {
        console.error('Error al cargar la proveedor:', error);
      }
    };

    fetchProveedor();
  }, [id]);

  // Función para manejar el envío del formulario de actualización
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/proveedoresupdate/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Navegar de vuelta a la lista de proveedors después de actualizar
        navigate('/Gestionproveedores');
      } else {
        alert('Error al actualizar el proveedor');
      }
    } catch (error) {
      console.error('Error al actualizar el proveedor:', error);
      alert('Error al actualizar ela proveedor');
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
    { text: 'Actualizar proveedor', type: 'submit', hidden: false },
  ];

  return (
    <Layout>
      <InfoSection
        title="Actualizar proveedor"
        showSubtitle={false} // Mostrar subtítulo
        showDescription={false} // Mostrar descripción
      />
      <Form
        fields={fields}
        title="Información de la proveedor"
        buttons={buttons}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}  // Asignar la función de envío de formulario
      />
    </Layout>
  );
}

export default Actualizarproveedor;
