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


  // it('finds a menu item by id', async() => {
  //   const tiramisu = await Menu.insert({
  //     item: 'Tiramisu',
  //     detail: 'An italian coffee custard dessert',
  //     price: '$5.95'
  //   });

  //   const foundTiramisu = await Menu.findById(tiramisu.id);

  //   expect(foundTiramisu).toEqual({
  //     id: tiramisu.id,
  //     item: 'Tiramisu',
  //     detail: 'An italian coffee custard dessert',
  //     price: '$5.95'
  //   });
  // });


  // it('returns null if it cant find a menu item by id', async() => {
  //   const tiramisu = await Menu.findById(22);

  //   expect(tiramisu).toEqual(null);
  // });


  // it('finds all the menu items', async() => {
  //   await Promise.all([
  //     Menu.insert({
  //       item: 'Cheese Burger',
  //       detail: 'A meat patty grilled in our delicious signature sauce, with your choice of select cheeses',
  //       price: '$12.95'
  //     }),
  //     Menu.insert({
  //       item: 'Fried Pickles',
  //       detail: 'A basket of our deep friend beer battered pickles with a side of aioli sauce',
  //       price: '$4.95'
  //     }),
  //     Menu.insert({
  //       item: 'Pretzel',
  //       detail: 'A classic Bavarian snack - made in house',
  //       price: '$5.95'
  //     })
  //   ]);

  //   const menus = await Menu.find();

  //   expect(menus).toEqual(expect.arrayContaining([
  //     { 
  //       id: expect.any(String), 
  //       item: 'Cheese Burger',
  //       detail: 'A meat patty grilled in our delicious signature sauce, with your choice of select cheeses',
  //       price: '$12.95'
  //     },
  //     { 
  //       id: expect.any(String), 
  //       item: 'Fried Pickles',
  //       detail: 'A basket of our deep friend beer battered pickles with a side of aioli sauce',
  //       price: '$4.95'
  //     },
  //     { 
  //       id: expect.any(String),
  //       item: 'Pretzel',
  //       detail: 'A classic Bavarian snack - made in house',
  //       price: '$5.95'
  //     }
  //   ]));
  // });
  
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
