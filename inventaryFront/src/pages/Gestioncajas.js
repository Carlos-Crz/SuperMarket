import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Button from '../components/Button';
import InfoSection from '../components/InfoSection';



function Gcajas() {
  const [cajas, setcajas] = useState([]);
  const GcajasColumns = ['id_caja', 'numero_caja', 'nombre', 'efectivo', 'estado'];
  const navigate = useNavigate();

  useEffect(() => {
    // Función para obtener los cajas del backend
    const fetchcajas = async () => {
      try {
        const response = await fetch('http://localhost:3001/cajas');
        const data = await response.json();
        setcajas(data);
      } catch (error) {
        console.error('Error al obtener los cajas:', error);
      }
    };

    fetchcajas();
  }, []);

  // Función para eliminar una cajas
  const handleDelete = async (caja) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este caja?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/cajasdelete/${caja.id_caja}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Eliminar la categoría del estado local para que la tabla se actualice
        setcajas(cajas.filter((u) => u.id_caja !== caja.id_caja));
      } else {
        alert('Error al eliminar la categoría');
      }
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
      alert('Error al eliminar la categoría');
    }
  };

  const handleView = (caja) => {
    navigate(`/GestioncajasVer/${caja.id_caja}`);
};

const handleEdit = (caja) => {
    navigate(`/GestioncajasEditar/${caja.id_caja}`);
};

  return (
    <Layout>
      <InfoSection
        title="Gestión de cajas"
        description="En este módulo usted puede registrar nuevos cajas en el sistema, actualizar la información de los cajas existentes y eliminar cajas si es necesario"
        showSubtitle={false} // Mostrar subtítulo
        showDescription={true} // Mostrar descripción
      />
      <Button text="Nuevo caja" onClick={() => navigate('/GestioncajasCrear')}/>
            
      <Table columns={GcajasColumns} data={cajas} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
    </Layout>
  );
}

export default Gcajas;
