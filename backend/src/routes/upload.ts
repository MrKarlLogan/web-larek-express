import { Router } from 'express';
import uploadFile from '../controllers/upload';
import file from '../controllers/file';

const uploadRouter = Router();
uploadRouter.post('/', file.single('file'), uploadFile);

export default uploadRouter;
