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

  static async insert(dish) {
    const { rows } = await pool.query(
      'INSERT INTO dishes (item, description, price) VALUES ($1, $2, $3) RETURNING *',
      [dish.item, dish.description, dish.price]
    );

    return new Menu(rows[0]);
  }

}

module.exports = Menu;
