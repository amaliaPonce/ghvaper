const express = require('express');
const dotenv = require('dotenv');
const router = require('./src/routes/apiRoutes');
const validateEnv = require('./src/config/validateEnv');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

dotenv.config();
validateEnv();

const port = process.env.PORT || 8080;
app.use(express.json());

app.use('/', router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

