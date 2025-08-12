import express, { Request, Response, NextFunction, ErrorRequestHandler, RequestHandler } from 'express';
import request from 'supertest';
import expressWinston from 'express-winston';
import { format, transports } from 'winston';
import { Writable } from 'stream';

// Petit flux mémoire pour capturer les logs
class MemoryStream extends Writable {
  public chunks: string[] = [];
  _write(chunk: any, _enc: BufferEncoding, cb: (error?: Error | null) => void) {
    this.chunks.push(String(chunk));
    cb();
  }
  output() {
    return this.chunks.join('');
  }
}


// error handler
const errorHandler: ErrorRequestHandler = (_err, _req, res, _next) => {
  res.status(500).json({ error: 'boom' });
};

const pingHandler: RequestHandler = (_req, res) => {
  res.status(200).json({ ok: true });
};

describe('logger middlewares (version simple)', () => {
  it('httpLogger: log la requête et inclut le requestId', async () => {
    const stream = new MemoryStream();

    const app = express();

    // on force un requestId stable (pas besoin de mock uuid)
    app.use((req: Request, _res: Response, next: NextFunction) => {
      (req as any).requestId = 'fixed-uuid';
      next();
    });

    // logger HTTP avec transport mémoire
    app.use(
      expressWinston.logger({
        transports: [new transports.Stream({ stream })],
        format: format.json(),
        meta: true,
        dynamicMeta: (req) => ({ requestId: (req as any).requestId }),
        msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
      })
    );

    // route simple
    app.get('/ping', pingHandler);


    await request(app).get('/ping').expect(200);

    const out = stream.output();
    expect(out).toContain('/ping');
    expect(out).toContain('fixed-uuid');
    expect(out).toMatch(/"statusCode":\s*200/);
  });

/*   it('errorLogger: log une erreur quand une route throw', async () => {
    const stream = new MemoryStream();

    const app = express();

    app.use((req: Request, _res: Response, next: NextFunction) => {
      (req as any).requestId = 'fixed-uuid';
      next();
    });

    // logger d’erreurs avec transport mémoire
    app.use(
      expressWinston.errorLogger({
        transports: [new transports.Stream({ stream })],
        format: format.json(),
      })
    );

    app.use(errorHandler);

    await request(app).get('/boom').expect(404);

    const out = stream.output();
    expect(out).toContain('boom');
    expect(out).toContain('fixed-uuid');
    expect(out).toMatch(/"statusCode":\s*404/);
  }); */
});
