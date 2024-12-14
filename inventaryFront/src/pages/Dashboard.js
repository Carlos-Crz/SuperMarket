import React, { useEffect, useState } from 'react'; 

import Layout from '../components/Layout';
import InfoSection from '../components/InfoSection';

import clientes from '../components/img/Clientes_Img.png';
import productos from '../components/img/Productos_Img.png';
import cajas from '../components/img/Cajas_Img.png';
import ventas from '../components/img/Ventas_Img.png';
import proveedores from '../components/img/Proveedores_Img.png';
import usuarios from '../components/img/Usuarios_Img.png';

function Dashboard() {
  const [user, setUser] = useState({ nombre: '', apellido: '' });
  const [data, setData] = useState({
    usuarios: 0,
    proveedores: 0,
    productos: 0,
    cajas: 0,
    categorias: 0,
    clientes: 0,
  });

  useEffect(() => {
    // Obtener datos del usuario
    fetch('http://localhost:3001/user', { credentials: 'include' }) // credentials: 'include' para enviar cookies
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('No se pudo obtener la información del usuario');
        }
      })
      .then((data) => {
        setUser({ nombre: data.nombre, apellido: data.apellido });
      })
      .catch((error) => console.error(error));

    // Llama al endpoint del backend
    fetch('http://localhost:3001/api/dashboard-data')
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error('Error al obtener datos del dashboard:', error));
  }, []);

  return (
    <Layout>
      <InfoSection
        title="Dashboard"
        subtitle={`¡Bienvenido ${user.nombre} ${user.apellido}!`}
        description="Aquí encontrarás atajos para acceder a los diferentes módulos y gestionar el sistema según tus privilegios."
        showSubtitle={true} // Mostrar subtítulo
        showDescription={true} // Mostrar descripción
      />
      <div class="conteiner__dashboard">
        <div class="conteiner__dashboard-item">
            <img src={clientes} alt="Item 1"/>
            <h3>Clientes</h3>
            <p>{data.clientes} Clientes registrados</p>
        </div>
        <div class="conteiner__dashboard-item">
            <img src={productos} alt="Item 2"/>
            <h3>Productos</h3>
            <p>{data.productos} Productos registrados</p>
        </div>
        <div class="conteiner__dashboard-item">
            <img src={cajas} alt="Item 2"/>
            <h3>Cajas</h3>
            <p>{data.cajas} Cajas en total</p>
        </div>
        <div class="conteiner__dashboard-item">
            <img src={ventas} alt="Item 2"/>
            <h3>Categorias</h3>
            <p>{data.categorias} Categorias Existentes</p>
        </div>
        <div class="conteiner__dashboard-item">
            <img src={proveedores} alt="Item 2"/>
            <h3>Proveedores</h3>
            <p>{data.proveedores} Proveedores en total</p>
        </div>
        <div class="conteiner__dashboard-item">
            <img src={usuarios} alt="Item 2"/>
            <h3>usuarios</h3>
            <p>{data.usuarios} Usuarios en el sistema</p>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
