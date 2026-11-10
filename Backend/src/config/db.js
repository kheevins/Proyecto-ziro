
const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MonguitoDB conectado correctamente');
  } catch (error) {
    console.error('No se pudo conectar con Monguitodb:', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;