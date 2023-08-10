require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const rootRoute = require('./routes/index');
const genErrorHandler = require('./middlewares/genErrorHandler');
const limiter = require('./middlewares/limiter');
const corsHandler = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();
const { PORT = 3000 } = process.env;
const { NODE_ENV, DB_CONNECTION } = process.env;

// подключаемся к серверу mongo
mongoose.connect(NODE_ENV === 'production' ? DB_CONNECTION : 'mongodb://127.0.0.1:27017/bitfilmsdb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsHandler);
app.use(cookieParser());
app.use(helmet());
app.use(limiter);
app.use(requestLogger); // подключаем логгер запросов
app.use('/', rootRoute);
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors());
app.use(genErrorHandler);

app.listen(PORT);
