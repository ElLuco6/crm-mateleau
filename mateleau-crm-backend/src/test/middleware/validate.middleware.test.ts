import { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { validate } from '../../middleware/validateMiddleware';

describe('validate middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should call next() when validation passes', async () => {
    req.body = { name: 'Test' };

    const middleware = validate([
      body('name').isString().isLength({ min: 1 })
    ]);

    await middleware(req as Request, res as Response, next as NextFunction);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('should return 400 when validation fails', async () => {
    req.body = { name: '' }; // invalide

    const middleware = validate([
      body('name').isString().isLength({ min: 1 })
    ]);

    await middleware(req as Request, res as Response, next as NextFunction);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ errors: expect.any(Array) })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
