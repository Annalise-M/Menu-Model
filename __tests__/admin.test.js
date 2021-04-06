const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const AdminService = require('../lib/services/admin-service');
const { getAgent } = require('../data/data-helpers');


describe('admin routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('signup an admin via POST', async() => {
    const response = await request(app)
      .post('/api/v1/admin/signup')
      .send({
        email: 'test@test.com',
        password: 'password'
      });
  
    expect(response.body).toEqual({
      id: expect.any(String),
      email: 'test@test.com'
    });
  });


  it('logs in admin via POST', async() => {
    const admin = await AdminService.create({
      email: 'test@test.com',
      password: 'password'
    });

    const response = await request(app)
      .post('/api/v1/admin/login')
      .send({
        email: 'test@test.com',
        password: 'password'
      });

    expect(response.body).toEqual({
      id: admin.id,
      email: 'test@test.com'
    });
  });


  it.skip('verifies an admin via GET', async() => {
    const response = await getAgent()
      .get('/api/v1/admin/verify');

    expect(response.body).toEqual({
      id: expect.any(String),
      email: 'test0@test.com',
    });

    const responseWithoutAuth = await request(app)
      .get('/api/v1/admin/verify');

    expect(responseWithoutAuth.body).toEqual({
      status: 401,
      message: 'jwt must be provided'
    });
  });

});
