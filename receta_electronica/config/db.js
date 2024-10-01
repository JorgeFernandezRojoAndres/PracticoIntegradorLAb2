const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',  // Sin contraseña
  database: 'receta_electronica',
  port: 3306,   // Puerto por defecto de MariaDB
  
  charset: 'utf8mb4'  // Asegura el uso de UTF-8 para caracteres especiales
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Conectado a la base de datos MariaDB');
});

module.exports = connection;
