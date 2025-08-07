import { Request, Response } from 'express';
import { File, insertFile } from '../../services/files';
import { uploadToS3 } from '../../services/s3';
import config from '../../config/config';

export const uploadFileController = async (req: Request, res: Response) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'No file uploaded',
      });
    }

    if (req.file.size > config.filesUpload.maxFileSize) {
      return res.status(400).json({
        status: 'error',
        message: `File limit is ${config.filesUpload.maxFileSize} bytes`,
      });
    }

    const { title, description, category, language, provider, roles } = req.body;

    const s3Result = await uploadToS3(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    console.log('File uploaded to S3 successfully:', s3Result);

    const file: File = {
      title,
      description,
      category,
      language,
      provider,
      roles: { role_names: roles },
      path: s3Result.key,
    };

    const id = await insertFile(file);

    return res.json({
      status: 'ok',
      id
    });

  } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({
        status: 'error',
        message: 'Failed to upload file',
        error: error as string,
      });
  }
};