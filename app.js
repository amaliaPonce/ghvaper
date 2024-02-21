const express = require('express');
const dotenv = require('dotenv');
const router = require('./src/routes/apiRoutes');

const app = express();

dotenv.config();

const port = process.env.PORT || 8080;
app.use(express.json());

app.use('/', router);

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});

