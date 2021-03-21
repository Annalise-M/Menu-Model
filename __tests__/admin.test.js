// const { getAgent } = require('../data/data-helpers');
const request = require('supertest');
const app = require('../lib/app');

describe('admin routes', () => {
  it('signup a admin via POST', async() => {
    const response = await request(app)
      .post('/v1/admin/signup')
      .send({
        email: 'test@test.com',
        password: 'password'
      });
  
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
