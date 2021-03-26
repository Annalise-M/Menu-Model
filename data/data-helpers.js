const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('../lib/app');
const app = require('../lib/app');

beforeEach(() => {
  return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
});

const agent = request.agent(app);
beforeEach(() => {
  return agent
    .post('/api/v1/admin/login')
    .send({
      email: 'test@test.com',
      password: 'password'
    });
});

module.exports = {
  getAgent: () => agent
};
