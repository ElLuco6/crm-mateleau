import request from 'supertest';
import app from '../../app';
import { loginUser } from '../../services/AuthService';

jest.mock('../../services/AuthService');

describe('AuthController', () => {
  describe('POST /api/auth/login', () => {
    it('should return 200 and set cookies on successful login', async () => {
      (loginUser as jest.Mock).mockResolvedValue({
        token: 'token',
        userId: 'userId',
        role: 'user',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'password' });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logged in successfully');
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should return 400 on login failure', async () => {
      (loginUser as jest.Mock).mockRejectedValue(new Error('Invalid email or password'));

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should return 200 and clear cookies on logout', async () => {
      const response = await request(app).post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Logged out successfully');
      expect(response.headers['set-cookie']).toBeDefined();
    });
  });
});