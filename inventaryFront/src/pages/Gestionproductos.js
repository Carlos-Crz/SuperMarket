import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Table from '../components/Table';
import Button from '../components/Button';
import InfoSection from '../components/InfoSection';


function GProductos() {
  const [productos, setProductos] = useState([]);
  const GproductosColumns = ['id_producto', 'codigo_barras', 'descripcion', 'precio_venta', 'stock'];
  const navigate = useNavigate();

  useEffect(() => {
    // Función para obtener las categorías del backend
    const fetchProductos = async () => {
      try {
        const response = await fetch('http://localhost:3001/productos');
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error('Error al obtener las categorías:', error);
      }
    };

    fetchProductos();
  }, []);

  // Función para eliminar una categoría
  const handleDelete = async (producto) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este producto?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:3001/productosdelete/${producto.id_producto}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Eliminar la categoría del estado local para que la tabla se actualice
        setProductos(productos.filter((p) => p.id_producto !== producto.id_producto));
      } else {
        alert('Error al eliminar el producto');
      }
    } catch (error) {
      console.error('Error al eliminar la categoría:', error);
      alert('Error al eliminar el producto');
    }
  };
  const handleView = (producto) => {
    navigate(`/GestionproductosVer/${producto.id_producto}`);
};

const handleEdit = (producto) => {
    navigate(`/GestionproductosEditar/${producto.id_producto}`);
};

  return (
    <Layout>
      <InfoSection
        title="Gestión de Productos"
        description="En este módulo usted puede registrar nuevos productos en el sistema, actualizar la información de los productos existentes y eliminar productos si es necesario"
        showSubtitle={false} // Mostrar subtítulo
        showDescription={true} // Mostrar descripción
      />
      <Button text="Nuevo Producto" onClick={() => navigate('/GestionproductosCrear')}/> 
      <Table columns={GproductosColumns} data={productos} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
    </Layout>
  );
}

export default GProductos;
