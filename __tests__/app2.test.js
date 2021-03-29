// const { request } = require('express');
const { getAgent } = require('../data/data-helpers');
// const app = require('../lib/app');
// const menu = require('../lib/controllers/menu');
// const Admin = require('../lib/models/admin');
const Menu = require('../lib/models/menu');
// const request = require('supertest');
// const Admin = require('../lib/controllers/admin');

// const Admin = require('../lib/services/admin-service');


describe('Menu routes', () => {

  // beforeEach(async() => {
  //   await Admin.authorize(admins);
  // });

  it('CREATES a menu via POST', async() => {
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

  // it('finds all menus via GET', async() => {
    

  // });

});

