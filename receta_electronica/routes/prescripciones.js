const express = require('express');
const router = express.Router();
const db = require('../config/db');

function normalizeString(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Ruta para listar prescripciones
router.get('/', (req, res) => {
  db.query('SELECT * FROM prescripciones', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// Ruta para registrar una nueva prescripción
router.post('/agregar', (req, res) => {
  const { id_medico, id_paciente, diagnostico, fecha_prescripcion, vigencia } = req.body;
  db.query('INSERT INTO prescripciones (id_medico, id_paciente, diagnostico, fecha_prescripcion, vigencia) VALUES (?, ?, ?, ?, ?)',
    [id_medico, id_paciente, diagnostico, fecha_prescripcion, vigencia],
    (err, result) => {
      if (err) {
        console.error('Error en la inserción:', err); // Log de error en consola
        return res.status(500).json({ message: 'Error al agregar la prescripción', error: err });
      }
      res.json({ message: 'Prescripción agregada con éxito', id: result.insertId });
    }
  );
});

// Ruta para actualizar una prescripción
router.put('/actualizar/:id', (req, res) => {
  const { id } = req.params; // Obtener el id de los parámetros de la URL
  const { id_medico, id_paciente, diagnostico, fecha_prescripcion, vigencia } = req.body; // Obtener datos del cuerpo de la solicitud

  db.query(
    'UPDATE prescripciones SET id_medico = ?, id_paciente = ?, diagnostico = ?, fecha_prescripcion = ?, vigencia = ? WHERE id_prescripcion = ?',
    [id_medico, id_paciente, diagnostico, fecha_prescripcion, vigencia, id],
    (err, result) => {
      if (err) {
        console.error('Error al actualizar:', err); // Log de error
        return res.status(500).json({ message: 'Error al actualizar la prescripción', error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Prescripción no encontrada' });
      }
      res.json({ message: 'Prescripción actualizada con éxito' });
    }
  );
});

// Ruta para eliminar una prescripción
router.delete('/eliminar/:id', (req, res) => {
  const { id } = req.params; // Obtener el id de los parámetros de la URL

  db.query('DELETE FROM prescripciones WHERE id_prescripcion = ?', [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar:', err); // Log de error
      return res.status(500).json({ message: 'Error al eliminar la prescripción', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Prescripción no encontrada' });
    }
    res.json({ message: 'Prescripción eliminada con éxito' });
  });
});
// Ruta para buscar prescripciones por diagnóstico
router.get('/buscar/:diagnostico', (req, res) => {
  const { diagnostico } = req.params;
  const normalizedDiagnostico = normalizeString(diagnostico); // Normalizar el diagnóstico  

  db.query(
    `SELECT * FROM prescripciones WHERE REPLACE(REPLACE(REPLACE(diagnostico, 'á', 'a'), 'é', 'e'), 'í', 'i') LIKE '%Sintomas%';`,
    [`%${normalizedDiagnostico}%`],
    (err, results) => {
      if (err) {
        console.error('Error en la búsqueda:', err);
        return res.status(500).json({ message: 'Error en la búsqueda', error: err });
      }
      res.json(results);
    }
  );
});


module.exports = router;
