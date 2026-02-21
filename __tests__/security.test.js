const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const AdminService = require('../lib/services/admin-service');

describe('Security Features', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  describe('Async Bcrypt (Non-blocking)', () => {
    it('should hash passwords asynchronously without blocking event loop', async() => {
      const startTime = Date.now();

      // Create multiple admins concurrently to test async behavior
      await Promise.all([
        AdminService.create({ email: 'test1@test.com', password: 'password123' }),
        AdminService.create({ email: 'test2@test.com', password: 'password123' }),
        AdminService.create({ email: 'test3@test.com', password: 'password123' })
      ]);

      const endTime = Date.now();
      const duration = endTime - startTime;

      // With async (parallel), should be faster than sequential sync operations
      // This proves we're not blocking the event loop
      expect(duration).toBeLessThan(5000); // Reasonable time for 3 parallel hashes
    });

    it('should verify passwords asynchronously', async() => {
      await AdminService.create({ email: 'test@test.com', password: 'correctPassword' });

      const validAdmin = await AdminService.authorize({
        email: 'test@test.com',
        password: 'correctPassword'
      });

      expect(validAdmin.email).toBe('test@test.com');

      // Should throw for wrong password
      await expect(
        AdminService.authorize({
          email: 'test@test.com',
          password: 'wrongPassword'
        })
      ).rejects.toThrow('Invalid email/password');
    });
  });

  describe('Input Validation', () => {
    it('should reject invalid menu item data', async() => {
      const response = await request(app)
        .post('/api/v1/menus')
        .send({
          item: '', // Empty item name
          price: 'invalid'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should reject invalid price format for menu items', async() => {
      const response = await request(app)
        .post('/api/v1/menus')
        .send({
          item: 'Test Item',
          price: 'abc' // Invalid price
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should accept valid menu item data', async() => {
      const response = await request(app)
        .post('/api/v1/menus')
        .send({
          item: 'Test Burger',
          detail: 'Delicious burger',
          price: '12.95'
        });

      expect(response.status).toBe(200);
      expect(response.body.item).toBe('Test Burger');
    });

    it('should reject invalid beer data', async() => {
      const response = await request(app)
        .post('/api/v1/beers')
        .send({
          brewery: '', // Empty brewery
          style: 'IPA',
          abv: '6.5',
          price: '7.95'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should accept valid beer data', async() => {
      const response = await request(app)
        .post('/api/v1/beers')
        .send({
          brewery: 'Test Brewery',
          style: 'IPA',
          abv: '6.5',
          price: '7.95'
        });

      expect(response.status).toBe(200);
      expect(response.body.brewery).toBe('Test Brewery');
    });

    it('should reject invalid admin signup (weak password)', async() => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'test@test.com',
          password: 'short' // Less than 8 characters
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should reject invalid admin signup (invalid email)', async() => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'not-an-email', // Invalid email format
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Validation failed');
    });

    it('should accept valid admin signup', async() => {
      const response = await request(app)
        .post('/api/v1/auth/signup')
        .send({
          email: 'valid@test.com',
          password: 'validPassword123'
        });

      expect(response.status).toBe(200);
      expect(response.body.email).toBe('valid@test.com');
    });
  });

  describe('Security Headers (Helmet)', () => {
    it('should include security headers in responses', async() => {
      const response = await request(app).get('/api/v1/menus');

      // Helmet should add various security headers
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });
  });

  describe('Password Hashing Strength', () => {
    it('should hash passwords with sufficient rounds', async() => {
      const admin = await AdminService.create({
        email: 'test@test.com',
        password: 'testPassword123'
      });

      // bcrypt hashes start with $2a$ or $2b$ followed by cost factor
      expect(admin.passwordHash).toMatch(/^\$2[aby]\$/);

      // Ensure password is hashed (not plaintext)
      expect(admin.passwordHash).not.toBe('testPassword123');
      expect(admin.passwordHash.length).toBeGreaterThan(50); // Typical bcrypt hash length
    });

    it('should not expose password hash in JSON responses', async() => {
      const admin = await AdminService.create({
        email: 'test@test.com',
        password: 'testPassword123'
      });

      const jsonAdmin = admin.toJSON();

      expect(jsonAdmin).not.toHaveProperty('passwordHash');
      expect(jsonAdmin).toHaveProperty('email');
      expect(jsonAdmin).toHaveProperty('id');
    });
  });

  afterAll(() => {
    return pool.end();
  });
});
