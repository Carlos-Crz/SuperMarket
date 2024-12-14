import { BrowserRouter as Router, Route, Routes, Navigate  } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

// Gestion Categorias
import Gestioncategorias from './pages/Gestioncategorias';
import Crearcategoria from './pages/GCategorias/Crearcategoria';
import Vercategoria from './pages/GCategorias/Vercategoria';
import Editarcategoria from './pages/GCategorias/Editarcategoria';

// Gestion Usuarios
import Gestionusuarios from './pages/Gestionusuarios';
import Crearusuarios from './pages/GUsuarios/Crearusuario';
import Verusuarios from './pages/GUsuarios/Verusuario';
import Editarusuarios from './pages/GUsuarios/Editarusuario';

// Gestion Productos
import Gestionproductos from './pages/Gestionproductos'
import Crearproductos from './pages/GProductos/Crearproducto'
import Verproductos from './pages/GProductos/Verproducto'
import Editarproducto from './pages/GProductos/Editarproducto';

// Gestion Proveedores
import Gestionproveedores from './pages/Gestionproveedores'
import Crearproveedores from './pages/GProveedores/Crearproveedor'
import Verproveedores from './pages/GProveedores/Verproveedor'
import Editarproveedores from './pages/GProveedores/Editarproveedor'

// Gestion Clientes
import Gestionclientes from './pages/Gestionclientes'
import Crearclientes from './pages/GClientes/Crearcliente'
import Verclientes from './pages/GClientes/Vercliente'
import Editarclientes from './pages/GClientes/Editarcliente'

// Gestion Cajas
import Gestioncajas from './pages/Gestioncajas'
import Crearcajas from './pages/GCajas/Crearcaja'
import Vercajas from './pages/GCajas/Vercaja'
import Editarcajas from './pages/GCajas/Editarcaja'

import Login from './pages/Login';


function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta para la página de Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Navigate to="/" />} />
        {/* Ruta para la página de Dashboard */}
        <Route path="/Dashboard" element={<Dashboard />} />

        {/* Ruta para la página de Gestion de Categorias */}
        <Route path="/Gestioncategorias" element={<Gestioncategorias />} />
        <Route path="/GestioncategoriasCrear" element={<Crearcategoria />} />
        <Route path="/GestioncategoriasVer/:id" element={<Vercategoria />} />
        <Route path="/GestioncategoriasEditar/:id" element={<Editarcategoria />} />
        
        {/* Ruta para la página de Gestion de usuarios */}
        <Route path="/Gestionusuarios" element={<Gestionusuarios />} />
        <Route path="/GestionusuariosCrear" element={<Crearusuarios />} />
        <Route path="/GestionusuariosVer/:id" element={<Verusuarios />} />
        <Route path="/GestionusuariosEditar/:id" element={<Editarusuarios />} />
        
        {/* Ruta para la página de Gestion de Productos */}
        <Route path="/Gestionproductos" element={<Gestionproductos />} />
        <Route path="/GestionproductosCrear" element={<Crearproductos />} />
        <Route path="/GestionproductosVer/:id" element={<Verproductos />} />
        <Route path="/GestionproductosEditar/:id" element={<Editarproducto />} />

        {/* Ruta para la página de Gestion de Proveedores */}
        <Route path="/Gestionproveedores" element={<Gestionproveedores />} />
        <Route path="/GestionproveedoresCrear" element={<Crearproveedores />} />
        <Route path="/GestionproveedoresVer/:id" element={<Verproveedores />} />
        <Route path="/GestionproveedoresEditar/:id" element={<Editarproveedores />} />

        {/* Ruta para la página de Gestion de Proveedores */}
        <Route path="/Gestionclientes" element={<Gestionclientes />} />
        <Route path="/GestionclientesCrear" element={<Crearclientes />} />
        <Route path="/GestionclientesVer/:id" element={<Verclientes />} />
        <Route path="/GestionclientesEditar/:id" element={<Editarclientes />} />

        {/* Ruta para la página de Gestion de Cajas */}
        <Route path="/Gestioncajas" element={<Gestioncajas />} />
        <Route path="/GestioncajasCrear" element={<Crearcajas />} />
        <Route path="/GestioncajasVer/:id" element={<Vercajas />} />
        <Route path="/GestioncajasEditar/:id" element={<Editarcajas />} />

        {/* Ruta para la página de Gestion de Pedidos */}



      </Routes>
    </Router>
  );
}

export default App;
