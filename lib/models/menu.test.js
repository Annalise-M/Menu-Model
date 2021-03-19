const fs = require('fs');
const pool = require('../utils/pool');
const Menu = require('./menu');

describe('Menu Model', () => {
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

});
