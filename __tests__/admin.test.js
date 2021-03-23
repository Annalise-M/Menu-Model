// const { getAgent } = require('../data/data-helpers');
const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
// const admin = require('../lib/models/admin');

describe('admin routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('signup an admin via POST', async() => {
    const response = await request(app)
      .post('/api/v1/auth/signup')
      .send({
        email: 'test@test.com',
        password: 'password'
      });
      // .then(console.log());
  
    expect(response.body).toEqual({
      id: expect.any(String),
      email: 'test@test.com'
    });
  });


  // it('logs in admin via POST', async() => {
  //   const response = await request(app)
  //     .post('/v1/admin/login')
  //     .send({
  //       email: 'test@test.com',
  //       password: 'password1'
  //     });

  //   expect(response.body).toEqual({
  //     id: expect.any(String),
  //     email: 'test@test.com'
  //   });
  // });


});
