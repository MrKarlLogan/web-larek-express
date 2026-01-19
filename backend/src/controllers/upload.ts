import { NextFunction, Request, Response } from 'express';
import { constants } from 'http2';
import { UPLOAD_PATH } from '../config';
import BadRequestError from '../errors/bad-request-error';

const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      return next(new BadRequestError('Файл не загружен'));
    }
    const fileName = UPLOAD_PATH
      ? `/${UPLOAD_PATH}/${req.file.filename}`
      : `/${req.file?.filename}`;

    return res.status(constants.HTTP_STATUS_CREATED).send({
      fileName,
      originName: req.file?.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });
  } catch (e) {
    return next(e);
  }
};

export default uploadFile;
