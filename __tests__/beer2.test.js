const { getAgent } = require('../data/data-helpers');



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
      adminId: expect.any(String),
      id: expect.any(String),
      brewery: '2 Towns Bright Cider',
      style: 'Cider',
      abv: '6 %',
      price: '$6'
    });
  });
});
