import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { errors } from 'celebrate';
import { PORT, ORIGIN_ALLOW, DB_ADDRESS } from './config';
import errorHandler from './middlewares/error-handler';
import { errorLogger, requestLogger } from './middlewares/logger';
import routes from './routes/index';

const app = express();

app.use((req, _res, next) => {
  if (req.path === '/product' && req.method === 'POST') {
    console.log('=== ПОЛУЧЕНЫ ДАННЫЕ ДЛЯ СОЗДАНИЯ ПРОДУКТА ===');
    console.log('Method:', req.method);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    console.log('Image object:', req.body?.image);
    console.log('==========================================');
  }
  next();
});

app.use(cookieParser());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // Логируем тело POST/PATCH запросов
  if (req.method === 'POST' || req.method === 'PATCH') {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }

  // Логируем ошибки
  const oldSend = res.send;
  res.send = function df(data) {
    console.log(`Response status: ${res.statusCode}`);
    if (res.statusCode >= 400) {
      console.log('Error response:', data);
    }
    return oldSend.call(this, data);
  };

  next();
});

app.use(requestLogger);
app.use(cors({ origin: ORIGIN_ALLOW, credentials: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

const startServer = async () => {
  try {
    await mongoose.connect(String(DB_ADDRESS));

    app.listen(PORT, () => {
      console.log(`Сервер запущен на ${PORT} порту`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

startServer();
