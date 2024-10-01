const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Ruta para listar medicamentos
router.get('/', (req, res) => {
  db.query('SELECT * FROM medicamentos', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Ruta para modificar medicamento
router.put('/modificar/:id', (req, res) => {
  const { nombre_generico, concentracion, forma_farmaceutica, presentacion } = req.body;
  const id = req.params.id;
  db.query('UPDATE medicamentos SET nombre_generico = ?, concentracion = ?, forma_farmaceutica = ?, presentacion = ? WHERE id_medicamento = ?',
    [nombre_generico, concentracion, forma_farmaceutica, presentacion, id],
    (err) => {
      if (err) throw err;
      res.json({ message: 'Medicamento actualizado' });
    }
  );
});

// Ruta para desactivar un medicamento
router.delete('/desactivar/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM medicamentos WHERE id_medicamento = ?', [id], (err) => {
    if (err) throw err;
    res.json({ message: 'Medicamento desactivado' });
  });
});

module.exports = router;
