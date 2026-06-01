const express = require('express');
const router = express.Router();

const {
    marcarPresenca
} = require('../controllers/presencasController');

router.post('/', marcarPresenca);

module.exports = router;