const request = require('supertest');
const { getAgent } = require('../data/data-helpers');
const Menu = require('../lib/models/menu');
const app = require('../lib/app');

describe('Menu routes', () => {
  // CREATES
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

  // FINDS by id
  it('FINDS a menu by id', async() => {
    const menu = await Menu.findById(1);
    const response = await getAgent()
      .get('/api/v1/menus/1');

    expect(response.body).toEqual({
      ...menu
    });
  });

  // NULL if it can't find an id
  it('Returns NULL if it can\'t find a menu item by id', async() => {
    const Burgers = await Menu.findById(60);

    expect(Burgers).toEqual(null);
  });

  // FINDS ALL items
  it('FINDS ALL menu items by admin id via GET', async() => {
    const menus = await Promise.all([
      Menu.insert({ item: 'Street tacos', detail: 'Pollo, Chorizo, Mushroom', price: '$3.50' }),
      Menu.insert({ item: 'Papas Bravas', detail: 'Fried Potatoes, Cotija, Pickeled Red Onion, Cilantro with choice of meat', price: '$13' }),
      Menu.insert({ item: 'Green Salad', detail: 'Farm Greens, creamy jalapeno cilantro dressing', price: '$8' })
    ]);

    return request(app)
      .get('/api/v1/menus')
      .then(response => {
        expect(response.body).toEqual(expect.arrayContaining(menus));
      });
  });
  
  // UPDATES A MENU item by id
  it('UPDATES a menu', async() => {
    const response = await getAgent()
      .put('/api/v1/menus/1')
      .send({
        adminId: 1,
        item: 'Papas Bravas',
        detail: 'Fried Potatoes, Cotija, Pickeled Red Onion, Cilantro with choice of meat',
        price: '$13'
      });

    expect(response.body).toEqual({
      id: expect.any(String),
      adminId: '1',
      item: 'Papas Bravas',
      detail: 'Fried Potatoes, Cotija, Pickeled Red Onion, Cilantro with choice of meat',
      price: '$13'
    });
  });

  // DELETES a beer by id
  it('DELETES a menu by id', async() => {
    const response = await getAgent()
      .delete('/api/v1/menus/1');
    
    expect(response.body).toEqual({
      id: expect.any(String),
      adminId: expect.any(String),
      item: 'food',
      detail: 'delicious',
      price: '8.50'
    });
  });

});

