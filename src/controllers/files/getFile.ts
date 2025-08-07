import { Request, Response } from 'express';
import { getFile } from '../../services/files';
import { getPreSignedUrl } from '../../services/s3';

export const getFileController = async (req: Request, res: Response) => {

    try {
    const id = req.params.id;

    const file = await getFile(id);

    if (!file) {
      return res.status(404).json({
          status: 'error',
          message: 'File not found'
      });
    }

    const url = await getPreSignedUrl(file.path);

    return res.json({
        status: 'ok',
        file,
        url
      });

    } catch (error) {

        console.error(error);
        
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};