const pool = require('../utils/pool');

class Menu {
  id;
  item;
  description;
  price;

  constructor(row) {
    this.id = row.id;
    this.item = row.item;
    this.description = row.description;
    this.price = row.price;
  }

  static async insert(menu) {
    const { rows } = await pool.query(
      'INSERT INTO menus (item, description, price) VALUES ($1, $2, $3) RETURNING *',
      [menu.item, menu.description, menu.price]
    );

    return new Menu(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM menus WHERE id = $1',
      [id]
    );

    if(!rows[0]) return null;
    else return new Menu(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM menus',
    );

    return rows.map(row => new Menu(row));
  }


  static async update(id, updatedMenu) {
    const { rows } = await pool.query(
      `UPDATE menus
      SET item=$1,
          description=$2,
          price=$3
      WHERE id = $4
      RETURNING *
      `,
      [updatedMenu.item, updatedMenu.description, updatedMenu.price, id]
    );
    
    return new Menu(rows[0]);
  }

}

module.exports = Menu;
