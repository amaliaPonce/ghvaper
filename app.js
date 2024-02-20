const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const router = require('./src/routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use('/', router);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
