import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Button from '../components/Button';
import InfoSection from '../components/InfoSection';

import { useNavigate } from 'react-router-dom';



function Gproveedores() {
  const [proveedores, setProveedores] = useState([]);
  const GproveedoresColumns = ['id_proveedor', 'nombre_proveedor', 'telefono', 'encargado', 'email'];
  const navigate = useNavigate();

  useEffect(() => {
    // Función para obtener las proveedores del backend
    const fetchProveedores = async () => {
      try {
        const response = await fetch('http://localhost:3001/proveedores');
        const data = await response.json();
        setProveedores(data);
      } catch (error) {
        console.error('Error al obtener las proveedores:', error);
      }
    };

    fetchProveedores();
  }, []);

  // Función para eliminar una proveedor
  const handleDelete = async (proveedor) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar esta proveedor?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/proveedoresdelete/${proveedor.id_proveedor}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Eliminar la proveedor del estado local para que la tabla se actualice
        setProveedores(proveedores.filter((p) => p.id_proveedor !== proveedor.id_proveedor));
      } else {
        alert('Error al eliminar la proveedor');
      }
    } catch (error) {
      console.error('Error al eliminar la proveedor:', error);
      alert('Error al eliminar la proveedor');
    }
  };
  const handleView = (proveedor) => {
    navigate(`/GestionproveedoresVer/${proveedor.id_proveedor}`);
};

const handleEdit = (proveedor) => {
    navigate(`/GestionproveedoresEditar/${proveedor.id_proveedor}`);
};

  return (
    <Layout>
      <InfoSection
        title="Gestión de proveedores"
        description="En este módulo usted puede registrar nuevas proveedores en el sistema, actualizar la información de los proveedores existentes y eliminar proveedor si es necesario"
        showSubtitle={false} // Mostrar subtítulo
        showDescription={true} // Mostrar descripción
      />
      <Button text="Nueva proveedor" onClick={() => navigate('/GestionproveedoresCrear')}/> 
      <Table columns={GproveedoresColumns} data={proveedores} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
    </Layout>
  );
}

export default Gproveedores;
