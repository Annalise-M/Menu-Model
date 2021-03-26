const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const AdminService = require('../lib/services/admin-service');


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
      password: 'password1'
    }); 

    const response = await request(app)
      .post('/api/v1/admin/login')
      .send({
        email: 'test@test.com',
        password: 'password1'
      });

    expect(response.body).toEqual({
      id: admin.id,
      email: 'test@test.com'
    });
  });


  it('verifies an admin via GET', async() => {
    const agent = request.agent(app);
    await agent
      .post('/api/v1/admin/signup')
      .send({
        email: 'test@test.com',
        password: 'password'
      });

    const response = await agent
      .get('/api/v1/admin/verify');

    expect(response.body).toEqual({
      id: expect.any(String),
      email: 'test@test.com',
    });

    const responseWithoutAuth = await request(app)
      .get('/api/v1/admin/verify');

    expect(responseWithoutAuth.body).toEqual({
      status: 401,
      message: 'jwt must be provided'
    });
  });

});
