const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Ruta para listar medicamentos con paginación
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1; // Número de página, por defecto 1
  const limit = parseInt(req.query.limit) || 10; // Número de resultados por página, por defecto 10
  const offset = (page - 1) * limit; // Calcular el desplazamiento

  db.query('SELECT * FROM medicamentos WHERE activo = 1 LIMIT ? OFFSET ?', [limit, offset], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


// Ruta para agregar un nuevo medicamento
router.post('/agregar', (req, res) => {
  const { nombre_generico, concentracion, forma_farmaceutica, presentacion } = req.body;

  db.query('INSERT INTO medicamentos (nombre_generico, concentracion, forma_farmaceutica, presentacion, activo) VALUES (?, ?, ?, ?, 1)',
    [nombre_generico, concentracion, forma_farmaceutica, presentacion],
    (err, result) => {
      if (err) {
        console.error('Error al agregar el medicamento:', err);
        return res.status(500).json({ message: 'Error al agregar el medicamento', error: err });
      }
      res.json({ message: 'Medicamento agregado con éxito', id_medicamento: result.insertId });
    }
  );
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

// Ruta para desactivar un medicamento (soft delete)
router.put('/desactivar/:id', (req, res) => {
  const id = req.params.id;
  db.query('UPDATE medicamentos SET activo = 0 WHERE id_medicamento = ?', [id], (err) => {
    if (err) {
      console.error('Error al desactivar:', err);
      return res.status(500).json({ message: 'Error al desactivar el medicamento', error: err });
    }
    res.json({ message: 'Medicamento desactivado' });
  });
});
// Ruta para reactivar un medicamento
router.put('/reactivar/:id', (req, res) => {
  const id = req.params.id;
  db.query('UPDATE medicamentos SET activo = 1 WHERE id_medicamento = ?', [id], (err) => {
    if (err) {
      console.error('Error al reactivar:', err);
      return res.status(500).json({ message: 'Error al reactivar el medicamento', error: err });
    }
    res.json({ message: 'Medicamento reactivado' });
  });
});
// Ruta para buscar medicamentos con paginación
router.get('/buscar', (req, res) => {
  const { nombre_generico, concentracion, forma_farmaceutica, presentacion, page = 1, limit = 10 } = req.query;

  const offset = (page - 1) * limit; // Calcular el desplazamiento para la paginación

  // Construir la consulta de búsqueda
  let query = 'SELECT * FROM medicamentos WHERE activo = 1';
  const params = [];

  if (nombre_generico) {
    query += ' AND nombre_generico LIKE ?';
    params.push(`%${nombre_generico}%`);
  }
  if (concentracion) {
    query += ' AND concentracion LIKE ?';
    params.push(`%${concentracion}%`);
  }
  if (forma_farmaceutica) {
    query += ' AND forma_farmaceutica LIKE ?';
    params.push(`%${forma_farmaceutica}%`);
  }
  if (presentacion) {
    query += ' AND presentacion LIKE ?';
    params.push(`%${presentacion}%`);
  }

  // Agregar paginación a la consulta
  query += ' LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset)); // Asegúrate de pasar números enteros

  db.query(query, params, (err, results) => {
    if (err) throw err;

    // Obtener el total de resultados para la paginación
    db.query('SELECT COUNT(*) as total FROM medicamentos WHERE activo = 1' + (params.length > 0 ? ` AND ${params.join(' AND ')}` : ''), (err, totalResult) => {
      if (err) throw err;

      const total = totalResult[0].total; // Total de medicamentos activos
      const totalPages = Math.ceil(total / limit); // Cálculo de páginas

      res.json({
        total,
        totalPages,
        currentPage: page,
        results
      });
    });
  });
});




module.exports = router;
