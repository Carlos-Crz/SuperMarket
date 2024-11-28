import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import InfoSection from '../../components/InfoSection';
import Form from '../../components/Form';

function Verproducto() {
  const { id } = useParams();  // Obtener el ID del producto desde los parámetros de la URL
  const [formData, setFormData] = useState({ codigo_barras: '', nombre_producto: '', descripcion: '', presentacion: '', precio_compra: '', precio_venta: '', stock: '',  nombre_categoria: '' });
  const navigate = useNavigate();

  // Función para cargar los datos del producto desde el backend
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(`http://localhost:3001/productosver/${id}`);
        const data = await response.json();
        console.log("Datos cargados: ",data);
        setFormData(data[0]);
        
      } catch (error) {
        console.error('Error al cargar el producto:', error);
      }
    };

    fetchProducto();
  }, [id]);


      // Definir los campos del formulario
  const fields = [
    { name: 'codigo_barras', label: 'Código de barras', type: 'text', required: true, readOnly: true },
    { name: 'nombre_producto', label: 'Nombre del producto', type: 'text', required: true, readOnly: true },
    { name: 'presentacion', label: 'Presentacion del producto', type: 'text', required: true, readOnly: true },
    { name: 'stock', label: 'Cantidad', type: 'text', required: true, readOnly: true },
    { name: 'precio_compra', label: 'Precio de compra', type: 'text', required: true, readOnly: true },
    { name: 'precio_venta', label: 'Precio de venta', type: 'text', required: true, readOnly: true },
    { name: 'nombre_categoria', label: 'Categoria al que pertenece el producto', type: 'text', required: true, readOnly: true },
    { name: 'descripcion', label: 'Descripción', type: 'text', required: true, readOnly: true }
  ];

  const buttons = [
    { text: 'Volver', type: 'button', className: 'buttons-can', onClick: () => navigate('/Gestionproductos'), hidden: false },
  ];

  return (
    <Layout>
      <InfoSection
        title="Ver producto"
        showSubtitle={false} // Mostrar subtítulo
        showDescription={false} // Mostrar descripción
      />
        <Form
          fields={fields}
          title="Información del producto"
          buttons={buttons}
          formData={formData}
          setFormData={setFormData}
        />

    </Layout>
  );
}

export default Verproducto;
