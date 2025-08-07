import { Router } from 'express';
import multer from 'multer';
import { healthcheck } from '../controllers/healthcheck';
import { uploadFileController } from '../controllers/files/uploadFile';
import { listFilesController } from '../controllers/files/listFiles';
import { getFileController } from '../controllers/files/getFile';
import { statsController } from '../controllers/files/stats';
import { validateFileUpload, validateListFiles, validateGetFile } from '../middleware/validation';
import config from '../config/config';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.filesUpload.maxFileSize,
    files: 1,
  }
});

router.get('/healthcheck', healthcheck);

router.get('/files', validateListFiles, listFilesController);
router.get('/files/stats', statsController);
router.post('/files', upload.single('file'), validateFileUpload, uploadFileController);
router.get('/files/:id', validateGetFile, getFileController);

export default router;