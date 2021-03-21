const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('../lib/app');
const seed = require('supertest');
const app = require('../lib/app');

beforeEach(() => {
  return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
});

beforeEach(() => {
  return seed();
});

const agent = request.agent(app);
beforeEach(() => {
  return agent
    .post('/v1/auth/login')
    .send({
      email: 'test1@test.com',
      password: 'password1'
    });
});

module.exports = {
  getAgent: () => agent
};
