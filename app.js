require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { corsHandler } = require('./middlewares/corsHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./middlewares/genErrorHandler');
const routes = require('./routes/index');
const limiter = require('./middlewares/limiter');

const app = express();
app.use(helmet());
app.use(cors());

const { NODE_ENV, PORT = 3000, DB_ADDRESS } = process.env;
mongoose.connect(NODE_ENV === 'production' ? DB_ADDRESS : 'mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(limiter);
app.use(requestLogger);

app.use(corsHandler);
app.use(limiter);
app.use(bodyParser.json());
app.use(routes);
app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('Сервер Запущен!');
});