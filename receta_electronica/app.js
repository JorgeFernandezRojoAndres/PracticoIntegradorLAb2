const express = require('express');
const bodyParser = require('body-parser');

// Importar las rutas
const medicosRoutes = require('./routes/medicos');
const pacientesRoutes = require('./routes/pacientes');
const prescripcionesRoutes = require('./routes/prescripciones');
const medicamentosRoutes = require('./routes/medicamentos');

const app = express();
app.use(bodyParser.json());  // Para manejar JSON en las solicitudes

// Ruta para la raíz ('/')
app.get('/', (req, res) => {
  res.send('Bienvenido a la API de Receta Electrónica');
});

// Definir las rutas
app.use('/medicos', medicosRoutes);
app.use('/pacientes', pacientesRoutes);
app.use('/prescripciones', prescripcionesRoutes);
app.use('/medicamentos', medicamentosRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
    