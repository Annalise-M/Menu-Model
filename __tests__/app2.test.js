// const fs = require('fs');
// const pool = require('../lib/utils/pool');
const request = require('supertest');
const { getAgent } = require('../data/data-helpers');
const Menu = require('../lib/models/menu');
const app = require('../lib/app');


describe.skip('Menu routes', () => {
  // beforeEach(() => {
  //   return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
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
  // it('returns null if it can\'t find a Menu item by id', async() => {
   
  //   const response = await getAgent()
  //     .get('/api/v1/menus/22');

  //   expect(response.body).toEqual(null);
  // });


  // FINDS ALL MENU ITEMS VIA ADMIN ID
  it('finds all Menu items by admin id via GET', async() => {

    const menus = await Promise.all([
      Menu.insert({ item: 'hamburger', detail: 'cheesy delicious', price: '$9.50' }),
      Menu.insert({ item: 'fish and chips', detail: 'fresh', price: '$8.50' }),
      Menu.insert({ item: 'bucket of fries', detail: 'delicious', price: '$4.50' })
    ]);

    return request(app)
      .get('/api/v1/menus')
      .then(res => {
        expect(res.body).toEqual(expect.arrayContaining(menus));
      });

  });

  // UPDATES A ROW BY ID
  // DELETES
 
    
});

