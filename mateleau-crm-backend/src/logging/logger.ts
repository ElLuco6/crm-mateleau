import { v4 as uuid } from 'uuid';
import expressWinston from 'express-winston';
import { format, transports } from 'winston';
import { Request, Response, NextFunction } from 'express';

export const requestId = (req: Request, _res: Response, next: NextFunction) => {
  (req as any).requestId = uuid();
  next();
};

export const httpLogger = expressWinston.logger({
  transports: [new transports.Console()],
  format: format.json(),
  meta: true,
  dynamicMeta: (req) => ({ requestId: (req as any).requestId }),
  msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
});

export const errorLogger = expressWinston.errorLogger({
  transports: [new transports.Console()],
  format: format.json(),
});
