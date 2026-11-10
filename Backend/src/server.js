
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const conectarDB = require('./config/db');
const contactRoutes = require('./routes/contactRoutes')
const leaderboardRoutes = require('./routes/leaderboardRoutes')
const prizeRoutes = require('./routes/prizeRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/contact', contactRoutes)
app.use('/api/leaderboard', leaderboardRoutes)
app.use('/api/prizes', prizeRoutes);

app.get('/', (req, res) => {
  res.json({
    mensaje: 'Bienvenido a la API de la Ziro Web, !logradooo¡'
  });
});

const iniciarServidor = async () => {
  await conectarDB();

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
  });
};

iniciarServidor();