// src/__tests__/app.test.ts
import request from 'supertest';

// --- Mocks AVANT d'importer app.ts ---

// Swagger: no-op
jest.mock('../swagger', () => ({
  setupSwagger: jest.fn(),
}));

// Rate limiters: pass-through
jest.mock('../security/rateLimit', () => ({
  apiLimiter: (_req: any, _res: any, next: any) => next(),
  loginLimiter: (_req: any, _res: any, next: any) => next(),
  loginSlowdown: (_req: any, _res: any, next: any) => next(),
}));

// Logger middlewares: no-op, avec requestId stable
jest.mock('../logging/logger', () => ({
  requestId: (req: any, _res: any, next: any) => {
    req.requestId = 'fixed-req-id';
    next();
  },
  httpLogger: (_req: any, _res: any, next: any) => next(),
  // errorLogger doit avoir 4 args pour qu'Express le traite comme error-mw
  errorLogger: (err: any, _req: any, _res: any, next: any) => next(err),
}));

// On crée des routers mock très simples pour CHAQUE fichier de routes
const makeRouter = (withEcho = false, withBoom = false) => {
  // on require ici pour ne pas casser la résolution côté Jest
  const express = require('express');
  const r = express.Router();

  r.get('/_ok', (_req: any, res: any) => res.json({ ok: true }));

  if (withEcho) {
    r.get('/_echoId', (req: any, res: any) =>
      res.json({ requestId: req.requestId })
    );
  }

  if (withBoom) {
    r.get('/_boom', () => {
      const e: any = new Error('kaboom');
      e.status = 500;
      throw e;
    });
  }
  return r;
};

// On choisit une route pour l’echo (users) et une route pour boom (dashboard)
jest.mock('../routes/userRoutes', () => ({
  __esModule: true,
  default: makeRouter(true, false),
}));
jest.mock('../routes/diverRoutes', () => ({ __esModule: true, default: makeRouter() }));
jest.mock('../routes/diveRoutes', () => ({ __esModule: true, default: makeRouter() }));
jest.mock('../routes/authRoutes', () => ({ __esModule: true, default: makeRouter() }));
jest.mock('../routes/boatRoutes', () => ({ __esModule: true, default: makeRouter() }));
jest.mock('../routes/divingGroupRoutes', () => ({ __esModule: true, default: makeRouter() }));
jest.mock('../routes/equipmentRoutes', () => ({ __esModule: true, default: makeRouter() }));
jest.mock('../routes/availabityRoutes', () => ({ __esModule: true, default: makeRouter() }));
jest.mock('../routes/taskRoutes', () => ({ __esModule: true, default: makeRouter() }));
jest.mock('../routes/spotRoutes', () => ({ __esModule: true, default: makeRouter() }));

// on met le _boom sur dashboard pour tester la chaîne d’erreurs + error handler
jest.mock('../routes/dashboardRoute', () => ({
  __esModule: true,
  default: makeRouter(false, true),
}));

// Maintenant on peut importer l’app réelle
import app from '../app';

describe('app bootstrap (middlewares & routes montées)', () => {
  it('GET /api/health -> 200 { message: "API is running!" }', async () => {
    await request(app)
      .get('/api/health')
      .expect(200)
      .expect({ message: 'API is running!' });
  });

  it('monte /api/users et propage requestId via requestId middleware', async () => {
    const res = await request(app).get('/api/users/_echoId').expect(200);
    expect(res.body).toEqual({ requestId: 'fixed-req-id' });
  });

  it('monte /api/users/_ok -> 200', async () => {
    await request(app).get('/api/users/_ok').expect(200, { ok: true });
  });

  
});
