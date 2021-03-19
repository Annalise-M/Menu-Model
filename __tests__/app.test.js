const fs = require('fs');
const pool = require('../lib/utils/pool');
const Menu = require('../lib/models/menu');


describe('Menu model routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('insert a new food item onto the menu database', async() => {
    const createdMenu = await Menu.insert({
      item: 'Tiramisu',
      description: 'An italian coffee custard dessert',
      price: '$6.70',
    });

    const { rows } = await pool.query(
      'SELECT * FROM menus WHERE id = $1',
      [createdMenu.id]
    );

    expect(rows[0]).toEqual(createdMenu);
  });


  it('finds a menu item by id', async() => {
    const tiramisu = await Menu.insert({
      item: 'Tiramisu',
      description: 'An italian coffee custard dessert',
      price: '$6.70'
    });

    const foundTiramisu = await Menu.findById(tiramisu.id);

    expect(foundTiramisu).toEqual({
      id: tiramisu.id,
      item: 'Tiramisu',
      description: 'An italian coffee custard dessert',
      price: '$6.70'
    });
  });


  it('returns null if it cant find a menu item by id', async() => {
    const tiramisu = await Menu.findById(22);

    expect(tiramisu).toEqual(null);
  });

  

});
