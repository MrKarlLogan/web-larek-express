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
import NotFoundError from './errors/not-found-error';

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ORIGIN_ALLOW, credentials: true }));
app.use(requestLogger);
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);
app.use('*', (_req, _res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

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
