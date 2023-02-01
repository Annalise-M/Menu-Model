const request = require('supertest');
const { getAgent } = require('../data/data-helpers');
const Beer = require('../lib/models/beer');
const app = require('../lib/app');

describe.skip('Beer routes', () => {
  // CREATES
  it('CREATES a beer via POST', async() => {
    const response = await getAgent()
      .post('/api/v1/beers')
      .send({
        brewery: '2 Towns Bright Cider',
        style: 'Cider',
        abv: '6 %',
        price: '$6'
      });

    expect(response.body).toEqual({
      id: expect.any(String),
      adminId: expect.any(String),
      brewery: '2 Towns Bright Cider',
      style: 'Cider',
      abv: '6 %',
      price: '$6'
    });
  });

  // FINDS by id
  it('FINDS a beer by id', async() => {
    const beer = await Beer.findById(1);
    const response = await getAgent()
      .get('/api/v1/beers/1');

    expect(response.body).toEqual({
      ...beer
    });
  });

  // NULL without id
  it('Returns NULL if it can\'t find a beer item by id', async() => {
    const TwoTowns = await Beer.findById(80);

    expect(TwoTowns).toEqual(null);
  });

  // FINDS ALL items
  it('FINDS ALL MENU ITEMS by admin id via GET', async() => {
    const beers = await Promise.all([
      Beer.insert({ 
        brewery: '2 Towns Bright Cider',
        style: 'Cider',
        abv: '6 %',
        price: '$6' }),
      Beer.insert({ 
        brewery: '2 Towns Bright IPA',
        style: 'IPA',
        abv: '6.7 %',
        price: '$8'
      }),
      Beer.insert({ 
        brewery: '2 Moons',
        style: 'Cider',
        abv: '5 %',
        price: '$6.50' })
    ]);
  
    return request(app)
      .get('/api/v1/beers')
      .then(response => {
        expect(response.body).toEqual(expect.arrayContaining(beers));
      });
  });

  // UPDATES
  it('UPDATES a beer', async() => {
    const response = await getAgent()
      .put('/api/v1/beers/1')
      .send({
        adminId: 1,
        brewery: '2 Towns Bright Cider',
        style: 'Cider',
        abv: '6.2 %',
        price: '$8'
      });

    expect(response.body).toEqual({
      id: '1',
      adminId: expect.any(String),
      brewery: '2 Towns Bright Cider',
      style: 'Cider',
      abv: '6.2 %',
      price: '$8'
    });
  });

  // DELETES
  it('DELETES a beer by id', async() => {
    const response = await getAgent()
      .delete('/api/v1/beers/1');
    
    expect(response.body).toEqual({
      id: expect.any(String),
      adminId: expect.any(String),
      brewery: '2 Towns Bright IPA',
      style: 'IPA',
      abv: '6.2 %',
      price: '$8'
    });
  });

});
