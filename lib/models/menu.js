const pool = require('../utils/pool');

class Menu {
  id;
  item;
  detail;
  price;

  constructor(row) {
    this.id = row.id;
    this.item = row.item;
    this.detail = row.detail;
    this.price = row.price;
  }

  static async insert(menu) {
    const { rows } = await pool.query(
      'INSERT INTO menus (item, detail, price) VALUES ($1, $2, $3) RETURNING *',
      [menu.item, menu.detail, menu.price]
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

  static async updateMenuById(id, updatedMenu) {
    const { rows } = await pool.query(
      `UPDATE menus
      SET item=$1,
          detail=$2,
          price=$3
      WHERE id=$4
      RETURNING *
      `,
      [updatedMenu.item, updatedMenu.detail, updatedMenu.price, id]
    );
    
    return new Menu(rows[0]);
  }

  static async deleteMenuById(id) {
    const { rows } = await pool.query(
      `DELETE FROM menus WHERE id=$1 
      RETURNING *`,
      [id]
    );

    return new Menu(rows[0]);
  }
}

module.exports = Menu;
