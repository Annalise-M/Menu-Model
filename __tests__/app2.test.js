const request = require('supertest');
const { getAgent } = require('../data/data-helpers');
const Admin = require('../lib/models/admin');
const Menu = require('../lib/models/menu');
const app = require('../lib/app');


describe.skip('Menu routes', () => {

  // beforeEach(async() => {
  //   await Admin.authorize(admins);
  // });

  // {INSERT} NEW MENU 
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

  // FINDS NEW MENU ITEM BY ID {GET}
  it('finds a menu by id', async() => {
    const menu = await Menu.findById(1);
    const response = await getAgent()
      .get('/api/v1/menus/1');

    expect(response.body).toEqual({
      ...menu
    });
  });

  // RETURNS NULL IF IT CAN'T FIND MENU ITEM BY ID
  it('returns null if it can\'t find a Menu item by id', async() => {
    const response = await Menu.findById(2);

    expect(response.body).toEqual(null);
  });

  // FINDS ALL MENU ITEMS VIA ADMIN ID
  it('finds all Menu items by admin id via GET', async() => {
    // const menu = await Menu.findById(1);
    // const response = await getAgent()
    //   .get('/api/v1/menus/admin/1');

    // expect(response.body).toEqual({
    //   ...menu
    // });

    const admin = await Admin.findByEmail('email0@email.com');

    const response = await request(app)
      .get(`/api/v1/menus/admin/${admin.id}`);

    expect(response.body).toContainEqual({
      id: expect.any(String),
      menu: expect.any(String),
      adminId: admin.id
    });
  });

  // UPDATES A ROW BY ID
  // DELETES
 
    
});

