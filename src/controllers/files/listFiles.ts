import { Request, Response } from 'express';
import { listFiles } from '../../services/files';
import { getPreSignedUrl } from '../../services/s3';

export const listFilesController = async (req: Request, res: Response) => {

    try {

      const limit : number = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const offset : number = req.query.offset ? parseInt(req.query.offset as string) : 0;

      const files = await listFiles(limit, offset);

      const urls = await Promise.all(files.map(file => getPreSignedUrl(file.path)));

      const filesWithUrls = files.map((file, index) => ({
          ...file,
          url: urls[index]
      }));


      return res.json({
          status: 'ok',
          files: filesWithUrls
      });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};