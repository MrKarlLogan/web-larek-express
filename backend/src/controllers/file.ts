import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import { UPLOAD_PATH_TEMP } from '../config';

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Можно загружать только изображения!'));
  }
};

const uploadDir = path.join(__dirname, '..', 'public', UPLOAD_PATH_TEMP || 'temp');

const upload = multer({
  dest: uploadDir,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;
