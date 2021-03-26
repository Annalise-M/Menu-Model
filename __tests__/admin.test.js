// const { getAgent } = require('../data/data-helpers');
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


});
