const { getAgent } = require('../data/data-helpers');

const Menu = require('../lib/models/menu');
// const request = require('supertest');
// const app = require('../lib/app');
// const Admin = require('../lib/models/admin');
// const Menu = require('../lib/models/menu');

describe('Menu routes', () => {

  it('creates a menu item via POST', async() => {
    const response = await getAgent()
      .post('/api/v1/menus')
      .send({
        item: 'food',
        detail: 'delicious',
        price: '$8.50'
      });

    expect(response.body).toEqual({
      adminId: expect.any(String),
      id: expect.any(String),
      item: 'food',
      detail: 'delicious',
      price: '$8.50'
    });
  });

  it('finds a menu by id', async() => {
    const menu = await Menu.findById(1);
    const response = await getAgent()
      .get('/api/v1/menus/1');

    expect(response.body).toEqual({
      ...menu
    });
  });

});

