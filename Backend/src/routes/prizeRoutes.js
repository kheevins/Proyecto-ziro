
const express = require('express');
const router = express.Router();

const {
  obtenerInventario,
  reclamarPremio
} = require('../controllers/prizeController');

// consulta al inventario
router.get('/inventory', obtenerInventario);

// reclama un premio
router.post('/claim', reclamarPremio);

module.exports = router;
