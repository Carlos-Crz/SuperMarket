import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Button from '../components/Button';
import InfoSection from '../components/InfoSection';



function Gclientes() {
  const [clientes, setClientes] = useState([]);
  const GclientesColumns = [ 'id_cliente', 'tipo_documento', 'documento', 'nombre_cliente', 'telefono', 'email' ];
  const navigate = useNavigate();

  useEffect(() => {
    // Función para obtener los clientes del backend
    const fetchClientes = async () => {
      try {
        const response = await fetch('http://localhost:3001/clientes');
        const data = await response.json();
        setClientes(data);
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    };

    fetchClientes();
  }, []);

  // Función para eliminar una clientes
  const handleDelete = async (cliente) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este cliente?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/clientesdelete/${cliente.id_cliente}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Eliminar la categoría del estado local para que la tabla se actualice
        setClientes(clientes.filter((c) => c.id_cliente !== cliente.id_cliente));
      } else {
        alert('Error al eliminar la categoría');
      }
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
      alert('Error al eliminar la categoría');
    }
  };

  const handleView = (cliente) => {
    navigate(`/GestionclientesVer/${cliente.id_cliente}`);
};

const handleEdit = (cliente) => {
    navigate(`/GestionclientesEditar/${cliente.id_cliente}`);
};

  return (
    <Layout>
      <InfoSection
        title="Gestión de clientes"
        description="En este módulo usted puede registrar nuevos clientes en el sistema, actualizar la información de los clientes existentes y eliminar clientes si es necesario"
        showSubtitle={false} // Mostrar subtítulo
        showDescription={true} // Mostrar descripción
      />
      <Button text="Nuevo cliente" onClick={() => navigate('/GestionclientesCrear')}/>
            
      <Table columns={GclientesColumns} data={clientes} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
    </Layout>
  );
}

export default Gclientes;
