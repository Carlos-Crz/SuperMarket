import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import InfoSection from '../../components/InfoSection';
import Form from '../../components/Form';

function Verproveedor() {
  const { id } = useParams();  // Obtener el ID de la proveedor desde los parámetros de la URL
  const [formData, setFormData] = useState({ nombre_proveedor: '', encargado: '', telefono: '', email: '' });
  const navigate = useNavigate();

  // Función para cargar los datos del proveedor desde el backend
  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        const response = await fetch(`http://localhost:3001/proveedoresver/${id}`);
        const data = await response.json();
        console.log("Datos cargados: ",data);
        setFormData(data[0]);
      } catch (error) {
        console.error('Error al cargar el proveedor:', error);
      }
    };

    fetchProveedor();
  }, [id]);

  const fields = [
    { name: 'nombre_proveedor', type: 'text', label: 'Nombre del proveedor', placeholder: 'Ingresa el nombre del proveedor', required: true, readOnly: true },
    { name: 'encargado', type: 'text', label: 'Encargado', placeholder: 'Ingrese el nombre del encargado del proveedor', required: false, readOnly: true },
    { name: 'telefono', type: 'text', label: 'Teléfono', placeholder: 'Ingrese el número de teléfono del proveedor', required: false, readOnly: true },
    { name: 'email', type: 'text', label: 'Correo Electrónico', placeholder: 'Ingrese el correo electrónico del proveedor', required: false, readOnly: true }
  ];

  const buttons = [
    { text: 'Volver', type: 'button', className: 'buttons-can', onClick: () => navigate('/Gestionproveedores'), hidden: false },
  ];

  return (
    <Layout>
      <InfoSection
        title="Ver proveedor"
        showSubtitle={false} // Mostrar subtítulo
        showDescription={false} // Mostrar descripción
      />
        <Form
          fields={fields}
          title="Información del proveedor"
          buttons={buttons}
          formData={formData}
          setFormData={setFormData}
        />

    </Layout>
  );
}

export default Verproveedor;
