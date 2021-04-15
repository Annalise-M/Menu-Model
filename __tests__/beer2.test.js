require('../data/data-helpers');
// const request = require('supertest');
const { getAgent } = require('../data/data-helpers');
const Beer = require('../lib/models/beer');
// const app = require('../lib/app');
// const Admin = require('../lib/models/admin');


describe('Beer routes', () => {
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

  
  it('FINDS a beer by id', async() => {
    const beer = await Beer.findById(1);
    const response = await getAgent()
      .get('/api/v1/beers/1');

    expect(response.body).toEqual({
      ...beer
    });
  });


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


  // DELETES a beer by id w/ auth
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
