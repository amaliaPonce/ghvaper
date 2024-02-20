const express = require('express');
const router = express.Router();

const formularioController = require('../controllers/formularioController');
router.post('/formulario', formularioController.procesarFormulario);
module.exports = router;
