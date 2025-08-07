import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export const validateRequest = (schemas: {body?: z.ZodSchema, query?: z.ZodSchema, params?: z.ZodSchema}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {

        if (schemas.body) {
            const validatedData = schemas.body.parse(req.body);
            req.body = validatedData;
        }
        if (schemas.query) {
            const validatedData = schemas.query.parse(req.query);
            Object.assign(req.query, validatedData);
        }
        if (schemas.params) {
            const validatedData = schemas.params.parse(req.params);
            Object.assign(req.params, validatedData);
        }
      next();
    } catch (error) {

      if (error instanceof ZodError) {

        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: error.issues.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      return res.status(500).json({
        status: 'error',
        message: 'Internal validation error'
      });
    }
  };
};

//Upload file validation schema
export const uploadFileSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 255 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  category: z.string().min(1, 'Category is required'),
  language: z.string().min(1, 'Language is required'),
  provider: z.string().min(1, 'Provider is required'),
  roles: z.string()
  .transform((str) => str.split(',').map(s => s.trim()))
  .pipe(z.array(z.string()).min(1, 'At least one role is required'))
  .or(z.array(z.string()).min(1, 'At least one role is required')),
});

export const validateFileUpload = validateRequest({ body: uploadFileSchema });

//List files validation schema
export const listFilesSchema = z.object({
  limit: z.coerce.number().optional(),
  offset: z.coerce.number().optional(),
});

export const validateListFiles = validateRequest({ query: listFilesSchema });

//Get file validation schema
export const getFileSchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
});

export const validateGetFile = validateRequest({ params: getFileSchema });
