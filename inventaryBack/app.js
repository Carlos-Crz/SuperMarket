const express = require('express')
const cors = require('cors');  // Para permitir conexiones desde React
const session = require('express-session');
const mysql = require('mysql2/promise');
const app = express();
const port = 3001;

// Middleware para manejar JSON
app.use(express.json()); // Esto es necesario para poder leer JSON en req.body
// Middleware para manejar datos de formularios URL encoded
app.use(express.urlencoded({ extended: true })); 
// Configuración de CORS
app.use(cors({
  origin: 'http://localhost:3000', // Esto es la ruta frontend
  credentials: true,  
}));

// Configuración de sesiones
app.use(session({
  secret: 'clave123',
   resave: false,
   saveUninitialized: true,
   cookie: { secure: false, maxAge: 4 * 60 * 60 * 1000, }
}));

// Conexión a la base de datos
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'supermarketdb',
});

// Ruta de inicio de sesión
app.get('/login', async (req, res) => {
  const datos = req.query;
  try {
    const [results, fields] = await connection.query(
      "SELECT * FROM `usuarios` WHERE `nombre_usuario` = ? AND `contrasenia` = ?", 
      [datos.nombre_usuario, datos.contrasenia]
    );
    
    if (results.length > 0) {
      const user = results[0];
      req.session.isAuthenticated = true;
      req.session.nombre_usuario = user.nombre_usuario;
      req.session.nombre = user.nombre; // Agregar nombre
      req.session.apellido = user.apellido; // Agregar apellido
      res.status(200).send({
        success: true,
        message: 'Inicio de Sesión correcto',
        nombre: user.nombre,
        apellido: user.apellido
      });
    } else {
      res.status(401).send({ success: false, message: 'Datos incorrectos' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
});

app.get('/user', async (req, res) => {
  if (req.session.isAuthenticated) {
    try {
      const [userResults] = await connection.query(
        "SELECT usuarios.nombre_usuario, usuarios.nombre, usuarios.apellido, cargo.nombre_cargo AS cargo FROM usuarios JOIN cargo ON usuarios.id_cargo = cargo.id_cargo WHERE usuarios.nombre_usuario = ?",
        [req.session.nombre_usuario]
      );

      if (userResults.length > 0) {
        const user = userResults[0];
        res.status(200).json({
          nombre: user.nombre,
          apellido: user.apellido,
          cargo: user.cargo, // Añadimos el cargo
          nombre_usuario: user.nombre_usuario // También mandamos el nombre de usuario
        });
      } else {
        res.status(401).json({ message: 'Usuario no encontrado' });
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario', error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  } else {
    res.status(401).json({ message: 'Usuario no autenticado' });
  }
});




// Ruta para verificar el estado de autenticación
app.get('/auth/status', (req, res) => {
  if (req.session.isAuthenticated) {
    res.status(200).json({ authenticated: true, user: req.session.user });
  } else {
    res.status(401).json({ authenticated: false });
  }
});


// Ruta para cerrar sesión
app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ success: false, message: 'Error al cerrar sesión' });
    } else {
      res.status(200).json({ success: true, message: 'Sesión cerrada correctamente' });
    }
  });
});


// Endpoint para obtener datos del dashboard
app.get('/api/dashboard-data', async (req, res) => {
  try {
    const [usuarios] = await connection.query('SELECT COUNT(*) AS count FROM usuarios');
    const [proveedores] = await connection.query('SELECT COUNT(*) AS count FROM proveedores');
    const [productos] = await connection.query('SELECT COUNT(*) AS count FROM productos');
    const [cajas] = await connection.query('SELECT COUNT(*) AS count FROM cajas');
    const [categorias] = await connection.query('SELECT COUNT(*) AS count FROM categorias');
    const [clientes] = await connection.query('SELECT COUNT(*) AS count FROM clientes');

    res.json({
      usuarios: usuarios[0].count,
      proveedores: proveedores[0].count,
      productos: productos[0].count,
      cajas: cajas[0].count,
      categorias: categorias[0].count,
      clientes: clientes[0].count,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los datos del dashboard' });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


/* ----- CRUD CATEGORIAS ----- */
// Obtener todas las categorías
app.get('/categorias', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM categorias');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Ruta para crear una nueva categoría
app.post('/categoriascreate', async (req, res) => {
  const { nombre_categoria, ubicacion } = req.body;
  try {
    const [result] = await connection.query(
      'INSERT INTO categorias (nombre_categoria, ubicacion) VALUES (?, ?)',
      [nombre_categoria, ubicacion]
    );
    res.status(201).json({ id: result.insertId, nombre_categoria, ubicacion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la categoría' });
  }
});
// Obtener categoría por ID
app.get('/categoriasver/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await connection.query('SELECT * FROM categorias WHERE id_categoria = ?', [id]);
    if (categoria.length === 0) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    res.json(categoria[0]);
  } catch (error) {
    console.error('Error al obtener la categoría:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});
// Actualizar categoría por ID
app.put('/categoriasupdate/:id', async (req, res) => {
  const { id } = req.params;  // Obtener el ID de la categoría desde los parámetros de la URL
  const { nombre_categoria, ubicacion } = req.body;  // Obtener los datos enviados en el cuerpo de la solicitud

  try {
    // Usar la consulta SQL para actualizar la categoría
    const [result] = await connection.query(
      'UPDATE categorias SET nombre_categoria = ?, ubicacion = ? WHERE id_categoria = ?',
      [nombre_categoria, ubicacion, id]
    );

    // Verificar si alguna fila fue afectada
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    // Devolver un mensaje de éxito con los datos actualizados
    res.status(200).json({ message: 'Categoría actualizada correctamente', id, nombre_categoria, ubicacion });
  } catch (err) {
    console.error('Error al actualizar la categoría:', err);
    return res.status(500).json({ error: 'Error al actualizar la categoría' });
  }
});
// Eliminar categoría por ID
app.delete('/categoriasdelete/:id', async (req, res) => {
  const { id } = req.params;  // Obtener el ID de la categoría desde los parámetros de la URL

  try {
    // Verificar si la categoría está asociada a un producto
    const [associatedProduct] = await connection.query('SELECT * FROM productos WHERE id_categoria = ?', [id]);
    if (associatedProduct.length > 0) {
      return res.status(400).json({ error: 'No se puede eliminar la categoría, está asociada a un producto' });
    }


    // Usar la consulta SQL para eliminar la categoría
    const [result] = await connection.query(
      'DELETE FROM categorias WHERE id_categoria = ?',
      [id]
    );

    // Verificar si alguna fila fue afectada
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    // Verificar si el ID eliminado era el último de la tabla
    const [maxIdResult] = await connection.query('SELECT MAX(id_categoria) AS maxId FROM categorias');
    const maxId = maxIdResult[0].maxId;

    // Si el id eliminado era el último, reiniciar el auto_increment
    if (parseInt(id) > parseInt(maxId) || maxId === null) {
      await connection.query(`ALTER TABLE categorias AUTO_INCREMENT = ${id}`);
    } else {
      await connection.query(`ALTER TABLE categorias AUTO_INCREMENT = ${maxId + 1}`);
    }

    // Devolver un mensaje de éxito si la categoría fue eliminada
    res.status(200).json({ message: 'Categoría eliminada correctamente', id });
  } catch (err) {
    console.error('Error al eliminar la categoría:', err);
    return res.status(500).json({ error: 'Error al eliminar la categoría' });
  }
});
/* ----- END CRUD CATEGORIAS ----- */


/* ----- CRUD USUARIOS ----- */
// Obtener todos los Usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT u.id_usuario, u.documento, u.nombre, u.telefono, u.email, c.nombre_cargo FROM usuarios u JOIN cargo c ON u.id_cargo = c.id_cargo');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Obtener Usuario por ID
app.get('/usuariosver/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const categoria = await connection.query('SELECT u.id_usuario, u.documento, u.nombre, u.apellido, u.tipo_documento, u.documento, u.fecha_nacimiento, u.genero, u.email, u.telefono, u.nombre_usuario, u.contrasenia, c.nombre_cargo FROM usuarios u JOIN cargo c ON u.id_cargo = c.id_cargo WHERE u.id_usuario = ?', [id]);
    if (categoria.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(categoria[0]);
  } catch (error) {
    console.error('Error al obtener el usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});
// Obtener todos los cargos
app.get('/cargos', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT id_cargo, nombre_cargo FROM cargo');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error al obtener los cargos:', err);
    res.status(500).json({ error: 'Error al obtener los cargos' });
  }
});
// Ruta para crear un nuevo Usuario
app.post('/usuarioscreate', async (req, res) => {
  const { nombre, apellido, tipo_documento, documento, fecha_nacimiento, genero, email, telefono, nombre_usuario, contrasenia, id_cargo } = req.body;
  try {
    const [result] = await connection.query(
      'INSERT INTO usuarios (nombre, apellido, tipo_documento, documento, fecha_nacimiento, genero, email, telefono, nombre_usuario, contrasenia, id_cargo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellido, tipo_documento, documento, fecha_nacimiento, genero, email, telefono, nombre_usuario, contrasenia, id_cargo]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});
// Actualizar Usuario por ID
app.put('/usuariosupdate/:id', async (req, res) => {
  const { id } = req.params;  // Obtener el ID de la categoría desde los parámetros de la URL
  const { nombre, apellido, tipo_documento, documento, fecha_nacimiento, genero, email, telefono, nombre_usuario, contrasenia, id_cargo } = req.body;  // Obtener los datos enviados en el cuerpo de la solicitud

  try {
    // Usar la consulta SQL para actualizar la categoría
    const [result] = await connection.query(
      'UPDATE usuarios SET nombre = ?, apellido = ?, tipo_documento = ?, documento = ?, fecha_nacimiento = ?, genero = ?, email = ?, telefono = ?, nombre_usuario = ?, contrasenia = ?, id_cargo = ? WHERE id_usuario = ?',
      [nombre, apellido, tipo_documento, documento, fecha_nacimiento, genero, email, telefono, nombre_usuario, contrasenia, id_cargo, id]);

    // Verificar si alguna fila fue afectada
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Devolver un mensaje de éxito con los datos actualizados
    res.status(200).json({ message: 'Usuario actualizado correctamente', id, nombre, apellido, tipo_documento, documento, fecha_nacimiento, genero, email, telefono, nombre_usuario, contrasenia, id_cargo });
  } catch (err) {
    console.error('Error al actualizar la categoría:', err);
    return res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
});
// Eliminar Usuario por ID
app.delete('/usuariosdelete/:id', async (req, res) => {
  const { id } = req.params;  // Obtener el ID de la categoría desde los parámetros de la URL

  try {
    // Usar la consulta SQL para eliminar la categoría
    const [result] = await connection.query(
      'DELETE FROM usuarios WHERE id_usuario = ?',
      [id]
    );

    // Verificar si alguna fila fue afectada
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuarios no encontrada' });
    }

    // Verificar si el ID eliminado era el último de la tabla
    const [maxIdResult] = await connection.query('SELECT MAX(id_usuario) AS maxId FROM usuarios');
    const maxId = maxIdResult[0].maxId;

    // Si el id eliminado era el último, reiniciar el auto_increment
    if (parseInt(id) > parseInt(maxId) || maxId === null) {
      await connection.query(`ALTER TABLE usuarios AUTO_INCREMENT = ${id}`);
    } else {
      await connection.query(`ALTER TABLE usuarios AUTO_INCREMENT = ${maxId + 1}`);
    }

    // Devolver un mensaje de éxito si la categoría fue eliminada
    res.status(200).json({ message: 'Usuarios eliminada correctamente', id });
  } catch (err) {
    console.error('Error al eliminar la categoría:', err);
    return res.status(500).json({ error: 'Error al eliminar la usuarios' });
  }
});
/* ----- END CRUD USUARIOS ----- */


/* ----- CRUD PRODUCTOS ----- */
// Obtener Producto por ID
app.get('/productosver/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await connection.query('SELECT u.id_producto, u.codigo_barras, u.nombre_producto, u.descripcion, u.presentacion, u.precio_compra, u.precio_venta, u.stock, c.nombre_categoria FROM productos u JOIN categorias c ON u.id_categoria = c.id_categoria WHERE u.id_producto = ?', [id]);
    if (producto.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(producto[0]);
  } catch (error) {
    console.error('Error al obtener el :', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});
// Obtener todos los Productos
app.get('/productos', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT u.id_producto, u.codigo_barras, u.nombre_producto, u.descripcion, u.presentacion, u.precio_compra, u.precio_venta, u.stock FROM productos u JOIN categorias c ON u.id_categoria = c.id_categoria');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Ruta para crear un nuevo Producto
app.post('/productoscreate', async (req, res) => {
  const { codigo_barras, nombre_producto, descripcion, presentacion, precio_compra, precio_venta, stock, id_categoria } = req.body;
  try {
    const [result] = await connection.query(
      'INSERT INTO productos (codigo_barras, nombre_producto, descripcion, presentacion, precio_compra, precio_venta, stock, id_categoria) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [codigo_barras, nombre_producto, descripcion, presentacion, precio_compra, precio_venta, stock, id_categoria]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el producto' });
  }
});
// Actualizar Producto por ID
app.put('/productosupdate/:id', async (req, res) => {
  const { id } = req.params;  // Obtener el ID de la categoría desde los parámetros de la URL
  const { codigo_barras, nombre_producto, descripcion, presentacion, precio_compra, precio_venta, stock, id_categoria } = req.body; // Obtener los datos enviados en el cuerpo de la solicitud

  try {
    // Usar la consulta SQL para actualizar la categoría
    const [result] = await connection.query(
      'UPDATE productos SET codigo_barras = ?, nombre_producto = ?, descripcion = ?, presentacion = ?, precio_compra = ?, precio_venta = ?, stock = ?, id_categoria = ? WHERE id_producto = ?',
      [codigo_barras, nombre_producto, descripcion, presentacion, precio_compra, precio_venta, stock, id_categoria, id]);

    // Verificar si alguna fila fue afectada
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Devolver un mensaje de éxito con los datos actualizados
    res.status(200).json({ message: 'Producto actualizado correctamente', id, codigo_barras, nombre_producto, descripcion, presentacion, precio_compra, precio_venta, stock, id_categoria });
  } catch (err) {
    console.error('Error al actualizar la producto:', err);
    return res.status(500).json({ error: 'Error al actualizar el producto' });
  }
});
// Eliminar Producto por ID
app.delete('/productosdelete/:id', async (req, res) => {
  const { id } = req.params;  // Obtener el ID del producto desde los parámetros de la URL

  try {
    // Usar la consulta SQL para eliminar el producto
    const [result] = await connection.query(
      'DELETE FROM productos WHERE id_producto = ?',
      [id]
    );

    // Verificar si alguna fila fue afectada
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Productos no encontrados' });
    }

    // Verificar si el ID eliminado era el último de la tabla
    const [maxIdResult] = await connection.query('SELECT MAX(id_producto) AS maxId FROM productos');
    const maxId = maxIdResult[0].maxId;

    // Si el id eliminado era el último, reiniciar el auto_increment
    if (parseInt(id) > parseInt(maxId) || maxId === null) {
      await connection.query(`ALTER TABLE productos AUTO_INCREMENT = ${id}`);
    } else {
      await connection.query(`ALTER TABLE productos AUTO_INCREMENT = ${maxId + 1}`);
    }

    // Devolver un mensaje de éxito si la categoría fue eliminada
    res.status(200).json({ message: 'productos eliminados correctamente', id });
  } catch (err) {
    console.error('Error al eliminar los productos:', err);
    return res.status(500).json({ error: 'Error al eliminar los productos' });
  }
});
/* ----- END CRUD PRODUCTOS ----- */


/* ----- CRUD PROVEEDORES ----- */
// Obtener todos los Proveedores
app.get('/proveedores', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM proveedores');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Ruta para crear un nuevo Proveedor
app.post('/proveedorescreate', async (req, res) => {
  const { nombre_proveedor, encargado, telefono, email } = req.body;
  try {
    const [result] = await connection.query(
      'INSERT INTO proveedores (nombre_proveedor, encargado, telefono, email) VALUES (?, ?, ?, ?)',
      [nombre_proveedor, encargado, telefono, email]
    );
    res.status(201).json({ id: result.insertId, nombre_proveedor, encargado, telefono, email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el proveedor' });
  }
});
// Obtener Proveedor por ID
app.get('/proveedoresver/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const proveedor = await connection.query('SELECT * FROM proveedores WHERE id_proveedor = ?', [id]);
    if (proveedor.length === 0) {
      return res.status(404).json({ message: 'Proveedor no encontrado' });
    }
    res.json(proveedor[0]);
  } catch (error) {
    console.error('Error al obtener el proveedor:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});
// Actualizar proveedor por ID
app.put('/proveedoresupdate/:id', async (req, res) => {
  const { id } = req.params;  // Obtener el ID del proveedor desde los parámetros de la URL
  const { nombre_proveedor, encargado, telefono, email } = req.body;  // Obtener los datos enviados en el cuerpo de la solicitud

  try {
    // Usar la consulta SQL para actualizar el proveedor
    const [result] = await connection.query(
      'UPDATE proveedores SET nombre_proveedor = ?, encargado = ?, telefono = ?, email = ? WHERE id_proveedor = ?',
      [nombre_proveedor, encargado, telefono, email, id]
    );

    // Verificar si alguna fila fue afectada
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    // Devolver un mensaje de éxito con los datos actualizados
    res.status(200).json({ message: 'Proveedor actualizado correctamente', id, nombre_proveedor, encargado, telefono, email });
  } catch (err) {
    console.error('Error al actualizar el proveedor:', err);
    return res.status(500).json({ error: 'Error al actualizar el proveedor' });
  }
});
// Eliminar Proveedor por ID
app.delete('/proveedoresdelete/:id', async (req, res) => {
  const { id } = req.params;  // Obtener el ID de la proveedores desde los parámetros de la URL

  try {
    // Usar la consulta SQL para eliminar la proveedores
    const [result] = await connection.query(
      'DELETE FROM proveedores WHERE id_proveedor = ?',
      [id]
    );

    // Verificar si alguna fila fue afectada
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    // Verificar si el ID eliminado era el último de la tabla
    const [maxIdResult] = await connection.query('SELECT MAX(id_proveedor) AS maxId FROM proveedores');
    const maxId = maxIdResult[0].maxId;

    // Si el id eliminado era el último, reiniciar el auto_increment
    if (parseInt(id) > parseInt(maxId) || maxId === null) {
      await connection.query(`ALTER TABLE proveedores AUTO_INCREMENT = ${id}`);
    } else {
      await connection.query(`ALTER TABLE proveedores AUTO_INCREMENT = ${maxId + 1}`);
    }

    // Devolver un mensaje de éxito si la Proveedor fue eliminado
    res.status(200).json({ message: 'Proveedor eliminado correctamente', id });
  } catch (err) {
    console.error('Error al eliminar la proveedor:', err);
    return res.status(500).json({ error: 'Error al eliminar el proveedor' });
  }
});
/* ----- END CRUD PROVEEDORES ----- */


/* ----- CRUD CLIENTES ----- */
// Obtener todos los Clientes
app.get('/clientes', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM clientes');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Obtener Cliente por ID
app.get('/clientesver/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const proveedor = await connection.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
    if (proveedor.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(proveedor[0]);
  } catch (error) {
    console.error('Error al obtener el cliente:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});
// Ruta para crear un nuevo Cliente
app.post('/clientescreate', async (req, res) => {
  const { tipo_documento, documento, nombre_cliente, email, telefono, ciudad, direccion } = req.body;
  try {
    const [result] = await connection.query(
      'INSERT INTO clientes (tipo_documento, documento, nombre_cliente, email, telefono, ciudad, direccion) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [tipo_documento, documento, nombre_cliente, email, telefono, ciudad, direccion]
    );
    res.status(201).json({ id: result.insertId, tipo_documento, documento, nombre_cliente, email, telefono, ciudad, direccion });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el cliente' });
  }
});
// Actualizar Cliente por ID
app.put('/clientesupdate/:id', async (req, res) => {
  const { id } = req.params;  // Obtener el ID del cliente desde los parámetros de la URL
  const { tipo_documento, documento, nombre_cliente, email, telefono, ciudad, direccion } = req.body;  // Obtener los datos enviados en el cuerpo de la solicitud

  try {
    // Usar la consulta SQL para actualizar el cliente
    const [result] = await connection.query(
      'UPDATE clientes SET tipo_documento = ?, documento = ?, nombre_cliente = ?, email = ?, telefono = ?, ciudad = ?, direccion = ? WHERE id_cliente = ?',
      [tipo_documento, documento, nombre_cliente, email, telefono, ciudad, direccion, id]
    );

    // Verificar si alguna fila fue afectada
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Devolver un mensaje de éxito con los datos actualizados
    res.status(200).json({ message: 'Cliente actualizado correctamente', id, tipo_documento, documento, nombre_cliente, email, telefono, ciudad, direccion });
  } catch (err) {
    console.error('Error al actualizar el cliente:', err);
    return res.status(500).json({ error: 'Error al actualizar el cliente' });
  }
});
// Eliminar Cliente por ID
app.delete('/clientesdelete/:id', async (req, res) => {
  const { id } = req.params;  // Obtener el ID del cliente desde los parámetros de la URL

  try {
    // Usar la consulta SQL para eliminar la categoría
    const [result] = await connection.query(
      'DELETE FROM clientes WHERE id_cliente = ?',
      [id]
    );

    // Verificar si alguna fila fue afectada
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Verificar si el ID eliminado era el último de la tabla
    const [maxIdResult] = await connection.query('SELECT MAX(id_cliente) AS maxId FROM clientes');
    const maxId = maxIdResult[0].maxId;

    // Si el id eliminado era el último, reiniciar el auto_increment
    if (parseInt(id) > parseInt(maxId) || maxId === null) {
      await connection.query(`ALTER TABLE clientes AUTO_INCREMENT = ${id}`);
    } else {
      await connection.query(`ALTER TABLE clientes AUTO_INCREMENT = ${maxId + 1}`);
    }

    // Devolver un mensaje de éxito si la categoría fue eliminada
    res.status(200).json({ message: 'Cliente eliminado correctamente', id });
  } catch (err) {
    console.error('Error al eliminar el cliente:', err);
    return res.status(500).json({ error: 'Error al eliminar el cliente' });
  }
});
/* ----- END CRUD CLIENTES ----- */


/* ----- CRUD CAJAS ----- */
// Obtener todas las Cajas
app.get('/cajas', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT c.id_caja, u.nombre, cr.numero_caja, cr.efectivo, cr.estado FROM cajas c JOIN usuarios u ON c.id_usuario = u.id_usuario JOIN cajasregistradoras cr ON c.id_caja_registradora = cr.id_caja_registradora');
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Obtener Caja por ID
app.get('/cajasver/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const caja = await connection.query('SELECT c.id_caja, u.nombre, cr.numero_caja, cr.efectivo, cr.estado FROM cajas c JOIN usuarios u ON c.id_usuario = u.id_usuario JOIN cajasregistradoras cr ON c.id_caja_registradora = cr.id_caja_registradora WHERE c.id_caja = ?', [id]);
    if (caja.length === 0) {
      return res.status(404).json({ message: 'Caja no encontrado' });
    }
    res.json(caja[0]);
  } catch (error) {
    console.error('Error al obtener la caja:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});
// Obtener todos las cajas registradoras
app.get('/cajaregistradora', async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT id_caja_registradora, numero_caja, efectivo, estado FROM cajasregistradoras');
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error al obtener las cajas:', err);
    res.status(500).json({ error: 'Error al obtener las cajas' });
  }
});
// Ruta para crear una nueva caja
app.post('/cajascreate', async (req, res) => {
  const { id_usuario, id_caja_registradora } = req.body;
  try {
    const [result] = await connection.query(
      'INSERT INTO cajas (id_usuario, id_caja_registradora) VALUES (?, ?)',
      [id_usuario, id_caja_registradora]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear la caja' });
  }
});
// Actualizar Caja por ID
app.put('/cajasupdate/:id', async (req, res) => {
  const { id } = req.params;  // Obtener el ID de la categoría desde los parámetros de la URL
  const { id_usuario, id_caja_registradora } = req.body;  // Obtener los datos enviados en el cuerpo de la solicitud

  try {
    // Usar la consulta SQL para actualizar la categoría
    const [result] = await connection.query(
      'UPDATE cajas SET id_usuario = ?, id_caja_registradora = ? WHERE id_caja = ?',
      [id_usuario, id_caja_registradora, id]);

    // Verificar si alguna fila fue afectada
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Caja no encontrada' });
    }

    // Devolver un mensaje de éxito con los datos actualizados
    res.status(200).json({ message: 'Caja actualizado correctamente', id, id_usuario, id_caja_registradora });
  } catch (err) {
    console.error('Error al actualizar la caja:', err);
    return res.status(500).json({ error: 'Error al actualizar la caja' });
  }
});
// Eliminar Caja por ID
app.delete('/cajasdelete/:id', async (req, res) => {
  const { id } = req.params;  // Obtener el ID de la categoría desde los parámetros de la URL

  try {
    // Usar la consulta SQL para eliminar la caja
    const [result] = await connection.query(
      'DELETE FROM cajas WHERE id_caja = ?',
      [id]
    );

    // Verificar si alguna fila fue afectada
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Caja no encontrada' });
    }

    // Verificar si el ID eliminado era el último de la tabla
    const [maxIdResult] = await connection.query('SELECT MAX(id_caja) AS maxId FROM cajas');
    const maxId = maxIdResult[0].maxId;

    // Si el id eliminado era el último, reiniciar el auto_increment
    if (parseInt(id) > parseInt(maxId) || maxId === null) {
      await connection.query(`ALTER TABLE cajas AUTO_INCREMENT = ${id}`);
    } else {
      await connection.query(`ALTER TABLE cajas AUTO_INCREMENT = ${maxId + 1}`);
    }

    // Devolver un mensaje de éxito si la categoría fue eliminada
    res.status(200).json({ message: 'Caja eliminada correctamente', id });
  } catch (err) {
    console.error('Error al eliminar la categoría:', err);
    return res.status(500).json({ error: 'Error al eliminar las caja' });
  }
});
/* ----- END CRUD CAJAS ----- */
