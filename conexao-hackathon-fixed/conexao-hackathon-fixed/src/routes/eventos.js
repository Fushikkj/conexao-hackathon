const express = require('express');
const router = express.Router();

const {
    listarEventos
} = require('../controllers/eventosController');

router.get('/', listarEventos);

module.exports = router;