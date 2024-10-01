const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Ruta para listar pacientes
router.get('/', (req, res) => {
  db.query('SELECT * FROM pacientes', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Ruta para listar pacientes
router.get('/', (req, res) => {
  db.query('SELECT * FROM pacientes', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Ruta para agregar un nuevo paciente
router.post('/agregar', (req, res) => {
  const { nombre, apellido, documento, fecha_nacimiento, sexo, obra_social, plan, domicilio } = req.body;
  db.query('INSERT INTO pacientes (nombre, apellido, documento, fecha_nacimiento, sexo, obra_social, plan, domicilio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [nombre, apellido, documento, fecha_nacimiento, sexo, obra_social, plan, domicilio],
    (err, result) => {
      if (err) throw err;
      res.json({ message: 'Paciente agregado con éxito', id: result.insertId });
    }
  );
});

module.exports = router;
