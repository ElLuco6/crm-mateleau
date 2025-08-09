import { ZodObject, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate =
  (schema: ZodObject<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (e) {
      const err = e as ZodError;
      return res.status(400).json({ message: 'Invalid input', issues: err.issues });
    }
  };
