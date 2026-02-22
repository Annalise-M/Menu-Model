const pool = require('../utils/pool');

class Menu {
  id;
  item;
  detail;
  price;
  available;
  createdAt;
  updatedAt;

  constructor(row) {
    this.id = row.id;
    this.item = row.item;
    this.detail = row.detail;
    this.price = parseFloat(row.price);
    this.available = row.available ?? true; // Default to true if not set
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }

  static async insert(menu) {
    const { rows } = await pool.query(
      'INSERT INTO menus (item, detail, price, available) VALUES ($1, $2, $3, $4) RETURNING *',
      [menu.item, menu.detail, menu.price, menu.available ?? true]
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
          price=$3,
          available=$4
      WHERE id=$5
      RETURNING *
      `,
      [updatedMenu.item, updatedMenu.detail, updatedMenu.price, updatedMenu.available ?? true, id]
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
