import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import InfoSection from '../../components/InfoSection';
import Form from '../../components/Form';

function Vercaja() {
  const { id } = useParams();  // Obtener el ID del caja desde los parámetros de la URL
  const [formData, setFormData] = useState({ id_usuario: '', id_caja_registradora: '' });
  const navigate = useNavigate();

  // Función para cargar los datos del caja desde el backend
  useEffect(() => {
    const fetchCaja = async () => {
      try {
        const response = await fetch(`http://localhost:3001/cajasver/${id}`);
        const data = await response.json();
        console.log("Datos cargados: ",data);
        setFormData(data[0]);
        
      } catch (error) {
        console.error('Error al cargar el caja:', error);
      }
    };

    fetchCaja();
  }, [id]);

  const fields = [
    { name: 'nombre', label: 'Usuario Asignado', type: 'text', required: true, readOnly: true },
    { name: 'numero_caja', label: 'Caja Registradora', type: 'text', required: true, readOnly: true }
  ];

  const buttons = [
    { text: 'Volver', type: 'button', className: 'buttons-can', onClick: () => navigate('/Gestioncajas'), hidden: false },
  ];

  return (
    <Layout>
      <InfoSection
        title="Ver caja"
        showSubtitle={false} // Mostrar subtítulo
        showDescription={false} // Mostrar descripción
      />
        <Form
          fields={fields}
          title="Información del caja"
          buttons={buttons}
          formData={formData}
          setFormData={setFormData}
        />

    </Layout>
  );
}

export default Vercaja;
