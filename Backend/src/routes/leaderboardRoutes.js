const express = require ('express');
const router = express.Router();

const {
    guardarPuntaje,
    puntaje,
    obtenerTop10
} = require ('../controllers/scoreController')

router.post('/', guardarPuntaje);
router.get('/', obtenerTop10);

module.exports = router;