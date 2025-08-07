import { Request, Response } from 'express';
import { 
    getNumberOfFilesByCategory,
    getNumberOfFilesByLanguage,
    getTotalNumberOfFiles 
} from '../../services/files';

export const statsController = async (req: Request, res: Response) => {

  try {

    const [
        totalFiles,
        numberOfFilesByCategory,
        numberOfFilesByLanguage,
    ] = await Promise.all([
        getTotalNumberOfFiles(),
        getNumberOfFilesByCategory(),
        getNumberOfFilesByLanguage()
    ]);

    return res.json({
        status: 'ok',
        totalFiles,
        numberOfFilesByCategory,
        numberOfFilesByLanguage
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
};