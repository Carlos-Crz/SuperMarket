import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import InfoSection from '../../components/InfoSection';
import Form from '../../components/Form';

function Editarproducto() {
  const { id } = useParams();  // Obtener el ID del producto desde los parámetros de la URL
  const [formData, setFormData] = useState({ codigo_barras: '', nombre_producto: '', descripcion: '', presentacion: '', precio_compra: '', precio_venta: '', stock: '',  id_categoria: '' });
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);

  // Obtener las categorias desde el backend
  useEffect(() => {
    axios.get('http://localhost:3001/categorias')
      .then(response => setCategorias(response.data))
      .catch(error => console.error('Error al obtener los categorias:', error));
  }, []);

  // Función para cargar los datos del producto desde el backend
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const response = await fetch(`http://localhost:3001/productosver/${id}`);
        const data = await response.json();
        setFormData(data[0]);
      } catch (error) {
        console.error('Error al cargar el producto:', error);
      }
    };

    fetchProducto();
  }, [id]);

  // Función para manejar el envío del formulario de actualización
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/productosupdate/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Navegar de vuelta a la lista de productos después de actualizar
        navigate('/Gestionproductos');
      } else {
        alert('Error al actualizar el producto no ok');
      }
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      alert('Error al actualizar el producto sever');
    }
  };


  // Definir los campos del formulario
  const fields = [
    { name: 'codigo_barras', label: 'Código de barras', type: 'text', placeholder: '00010000000010', required: true },
    { name: 'nombre_producto', label: 'Nombre del producto', type: 'text', placeholder: 'Ingrese el nombre del producto', required: true },
    { name: 'presentacion', label: 'Presentacion del producto', type: 'select', required: true },
    { name: 'stock', label: 'Cantidad', type: 'text', placeholder: 'Cantidad del producto', required: true },
    { name: 'precio_compra', label: 'Precio de compra', type: 'text', placeholder: '0.0', required: true },
    { name: 'precio_venta', label: 'Precio de venta', type: 'text', placeholder: '0.0', required: true },
    { name: 'id_categoria', label: 'Categoria al que pertenece el producto', type: 'select', required: true },
    { name: 'descripcion', label: 'Descripción', type: 'text', placeholder: 'Brev descripción del producto', required: true }
  ];

  // Cargar opciones de categorias en el select
  const selectOptions = {
    presentacion: [
      { value: 'Kl', label: 'Por kilos' },
      { value: 'Lb', label: 'Por libras' },
      { value: 'Gm', label: 'Por gramos' },
    ],
    id_categoria: categorias.map(categoria => ({
      value: categoria.id_categoria,
      label: categoria.nombre_categoria
    }))
  };

  const buttons = [
    { text: 'Cancelar', type: 'button', className: 'buttons-can', onClick: () => navigate('/Gestionproductos'), hidden: false },
    { text: 'Actualizar Producto', type: 'submit', hidden: false },
  ];

  return (
    <Layout>
      <InfoSection
        title="Actualizar Producto"
        showSubtitle={false} // Mostrar subtítulo
        showDescription={false} // Mostrar descripción
      />
      <Form
        fields={fields}
        title="Información del Producto"
        buttons={buttons}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}  // Asignar la función de envío de formulario
        selectOptions={selectOptions}
      />
    </Layout>
  );
}

export default Editarproducto;
