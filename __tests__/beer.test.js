const fs = require('fs');
const pool = require('../lib/utils/pool');
const Beer = require('../lib/models/beer');


describe('Menu model routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });


  it('insert a new beer item onto the beer database', async() => {
    const createdBeer = await Beer.insert({
      brewery: '2 Towns Bright Cider',
      style: 'Cider',
      abv: '6 %',
      price: '$6'
    });

    const { rows } = await pool.query(
      'SELECT * FROM beers WHERE id = $1',
      [createdBeer.id]
    );

    expect(rows[0]).toEqual(createdBeer);
  });


  it('finds a beer item by id', async() => {
    const TwoTowns = await Beer.insert({
      brewery: '2 Towns Bright Cider',
      style: 'Cider',
      abv: '6 %',
      price: '$6'
    });

    const found2Towns = await Beer.findById(TwoTowns.id);

    expect(found2Towns).toEqual({
      id: TwoTowns.id,
      brewery: '2 Towns Bright Cider',
      style: 'Cider',
      abv: '6 %',
      price: '$6'
    });
  });


  it('returns null if it cant find a menu item by id', async() => {
    const TwoTowns = await Beer.findById(18);

    expect(TwoTowns).toEqual(null);
  });


  it('finds all the beer items', async() => {
    await Promise.all([
      Beer.insert({
        brewery: '2 Towns Bright Cider',
        style: 'Cider',
        abv: '6 %',
        price: '$6'
      }),
      Beer.insert({
        brewery: '2 Towns Cosmic Crisp',
        style: 'Cider',
        abv: '8 %',
        price: '$7'
      }),
      Beer.insert({
        brewery: 'Breakside - Wanderlust IPA',
        style: 'IPA',
        abv: '6.6 %',
        price: '$6'
      })
    ]);

    const beers = await Beer.find();

    expect(beers).toEqual(expect.arrayContaining([
      { 
        id: expect.any(String), 
        brewery: '2 Towns Bright Cider',
        style: 'Cider',
        abv: '6 %',
        price: '$6'
      },
      { 
        id: expect.any(String), 
        brewery: '2 Towns Cosmic Crisp',
        style: 'Cider',
        abv: '8 %',
        price: '$7'
      },
      { 
        id: expect.any(String),
        brewery: 'Breakside - Wanderlust IPA',
        style: 'IPA',
        abv: '6.6 %',
        price: '$6'
      }
    ]));
  });
  
  // it('updates a row by id', async() => {
  //   const createdMenu = await Menu.insert({
  //     item: 'Tiramisu',
  //     detail: 'An italian coffee custard dessert',
  //     price: '$5.95',
  //   });

  //   const updatedMenu = await Menu.update(createdMenu.id, {
  //     item: 'Affagato',
  //     detail: 'An italian coffee and gelato dessert',
  //     price: '$3.95'
  //   });

  //   expect(updatedMenu).toEqual({
  //     id: createdMenu.id,
  //     item: 'Affagato',
  //     detail: 'An italian coffee and gelato dessert',
  //     price: '$3.95'
  //   });
  // });

  // it('deletes a row by id', async() => {
  //   const createdMenu = await Menu.insert({
  //     item: 'Eggplant Parmesan',
  //     detail: 'Classic italian dish with eggplant and a tomato based sauce',
  //     price: '$7.95'
  //   });

  //   const deletedMenu = await Menu.delete(createdMenu.id);

  //   expect(deletedMenu).toEqual({
  //     id: createdMenu.id,
  //     item: 'Eggplant Parmesan',
  //     detail: 'Classic italian dish with eggplant and a tomato based sauce',
  //     price: '$7.95'
  //   });


  // });

});
