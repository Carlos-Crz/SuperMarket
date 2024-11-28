import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import InfoSection from '../../components/InfoSection';
import Form from '../../components/Form';

function Editarcaja() {
  const { id } = useParams();  // Obtener el ID de los cajas desde los parámetros de la URL
  const [formData, setFormData] = useState({ id_usuario: '', id_caja_registradora: '' });
  const navigate = useNavigate();
  const [cajasregis, setCajasregis] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Obtener todas las cajas registradora desde el backend
  useEffect(() => {
    axios.get('http://localhost:3001/cajaregistradora')
      .then(response => setCajasregis(response.data))
      .catch(error => console.error('Error al obtener los cajas registradora:', error));
  }, []);

  // Obtener todos los Usuarios desde el backend
  useEffect(() => {
    axios.get('http://localhost:3001/usuarios')
      .then(response => setUsuarios(response.data))
      .catch(error => console.error('Error al obtener los usuarios:', error));
  }, []);

  // Función para cargar los datos del caja desde el backend
  useEffect(() => {
    const fetchCaja = async () => {
      try {
        const response = await fetch(`http://localhost:3001/cajasver/${id}`);
        const data = await response.json();
        setFormData(data[0]);
      } catch (error) {
        console.error('Error al cargar el caja:', error);
      }
    };

    fetchCaja();
  }, [id]);

  // Función para manejar el envío del formulario de actualización
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/cajasupdate/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Navegar de vuelta a la lista de cajas después de actualizar
        navigate('/Gestioncajas');
      } else {
        alert('Error al actualizar el caja no ok');
      }
    } catch (error) {
      console.error('Error al actualizar el caja:', error);
      alert('Error al actualizar el caja sever');
    }
  };


  // Definir los campos del formulario
  const fields = [
    { name: 'id_usuario', label: 'Usuario Asignado', type: 'select', required: true },
    { name: 'id_caja_registradora', label: 'Caja Registradora', type: 'select', required: true }
  ];

  // Cargar opciones de cajaregistradora en el select
  const selectOptions = {
    
    id_usuario: usuarios.map(usuarios => ({
      value: usuarios.id_usuario,
      label: usuarios.nombre
    })),

    id_caja_registradora: cajasregis.map(cajasregis => ({
      value: cajasregis.id_caja_registradora,
      label: cajasregis.numero_caja
    })),
  };


  const buttons = [
    {text: 'Cancelar', type: 'button', className: 'buttons-can', onClick: () => navigate('/Gestioncajas'), hidden: false },
    {text: 'Actualizar caja', type: 'submit', hidden: false },
  ];

  return (
    <Layout>
      <InfoSection
        title="Actualizar Categoría"
        showSubtitle={false} // Mostrar subtítulo
        showDescription={false} // Mostrar descripción
      />
      <Form
        fields={fields}
        title="Información de la categoría"
        buttons={buttons}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}  // Asignar la función de envío de formulario
        selectOptions={selectOptions}
      />
    </Layout>
  );
}

export default Editarcaja;
