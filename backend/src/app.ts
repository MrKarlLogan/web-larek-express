import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import { errors } from 'celebrate';
import errorHandler from './middlewares/error-handler';
import { errorLogger, requestLogger } from './middlewares/logger';
import routes from './routes/index';

dotenv.config();
const {
  PORT = 4200,
  ORIGIN_ALLOW = 'http://localhost:5173',
  DB_ADDRESS = 'mongodb://127.0.0.1:27017/weblarek',
} = process.env;

const app = express();

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
