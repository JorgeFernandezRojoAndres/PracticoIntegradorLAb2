const express = require('express');
const bcrypt = require('bcrypt');  
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../config/db');

// Ruta para actualizar un médico
router.put('/actualizar/:id', function(req, res)  {
  const { id } = req.params; // Obtener el id de los parámetros de la URL
  const { nombre, apellido, documento, especialidad, domicilio, matricula } = req.body; // Obtener datos del cuerpo de la solicitud

  db.query(
    'UPDATE medicos SET nombre = ?, apellido = ?, documento = ?, especialidad = ?, domicilio = ?, matricula = ? WHERE id = ?',
    [nombre, apellido, documento, especialidad, domicilio, matricula, id],
    (err, result) => {
      if (err) {
        console.error('Error al actualizar:', err); // Log de error
        return res.status(500).json({ message: 'Error al actualizar el médico', error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Médico no encontrado' });
      }
      res.json({ message: 'Médico actualizado con éxito' });
    }
  );
});




// Ruta para listar médicos
router.get('/', (req, res) => {
  db.query('SELECT * FROM medicos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Ruta para agregar un nuevo médico
router.post('/agregar', async (req, res) => {
  const { nombre, apellido, documento, especialidad, domicilio, matricula, password } = req.body;

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query('INSERT INTO medicos (nombre, apellido, documento, especialidad, domicilio, matricula, password) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [nombre, apellido, documento, especialidad, domicilio, matricula, hashedPassword],
    (err, result) => {
      if (err) {
        console.error('Error en la inserción:', err);
        return res.status(500).json({ message: 'Error al agregar el médico', error: err });
      }
      res.json({ message: 'Médico agregado con éxito', id: result.insertId });
    }
  );
});
// Ruta para eliminar un médico
router.delete('/eliminar/:id', (req, res) => {
  const { id } = req.params;  // Desestructurar el id correctamente

  db.query('DELETE FROM medicos WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar:', err);
      return res.status(500).json({ message: 'Error al eliminar el médico', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Médico no encontrado' });
    }
    res.json({ message: 'Médico eliminado con éxito' });
  });
});





// Ruta para iniciar sesión
router.post('/login', (req, res) => {
  const { documento, password } = req.body;

  db.query('SELECT * FROM medicos WHERE documento = ?', [documento], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send('Usuario no encontrado');

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Contraseña incorrecta');

    // Genera un token
    const token = jwt.sign({ id: user.id }, 'tu_secreto', { expiresIn: '1h' });
    res.json({ message: 'Inicio de sesión exitoso', token });
  });
});

// Proteger la ruta para listar médicos
router.get('/', verifyToken, (req, res) => {
  db.query('SELECT * FROM medicos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Middleware para proteger rutas
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('Token no proporcionado.');

  jwt.verify(token, 'tu_secreto', (err, decoded) => {
    if (err) return res.status(401).send('Token no válido.');
    req.userId = decoded.id;
    next();
  });
}


module.exports = router;
