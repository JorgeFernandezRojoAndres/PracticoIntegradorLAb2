const express = require('express');
const bcrypt = require('bcrypt');  // Asegúrate de instalar bcrypt
const router = express.Router();
const db = require('../config/db');

// Ruta para listar médicos
router.get('/', (req, res) => {
  db.query('SELECT * FROM medicos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Ruta para agregar un nuevo médico
router.post('/agregar', async (req, res) => {
  const { nombre, apellido, documento, dni, especialidad, domicilio, matricula, password } = req.body;

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query('INSERT INTO medicos (nombre, apellido, documento, dni, especialidad, domicilio, matricula, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [nombre, apellido, documento, dni, especialidad, domicilio, matricula, hashedPassword],
    (err, result) => {
      if (err) {
        console.error('Error en la inserción:', err);
        return res.status(500).json({ message: 'Error al agregar el médico', error: err });
      }
      res.json({ message: 'Médico agregado con éxito', id: result.insertId });
    }
  );
});



// Ruta para iniciar sesión
router.post('/login', (req, res) => {
  const { dni, password } = req.body;

  db.query('SELECT * FROM medicos WHERE dni = ?', [dni], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send('Usuario no encontrado');

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Contraseña incorrecta');

    // Puedes generar un token aquí si lo deseas (JWT)
    res.json({ message: 'Inicio de sesión exitoso', id: user.id });
  });
});


module.exports = router;
