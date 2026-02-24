const pool = require('../utils/pool');

class Menu {
  id;
  item;
  detail;
  price;
  available;
  categoryId;
  createdAt;
  updatedAt;

  constructor(row) {
    this.id = row.id;
    this.item = row.item;
    this.detail = row.detail;
    this.price = parseFloat(row.price);
    this.available = row.available ?? true; // Default to true if not set
    this.categoryId = row.category_id;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }

  static async insert(menu) {
    const { rows } = await pool.query(
      'INSERT INTO menus (item, detail, price, available, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [menu.item, menu.detail, menu.price, menu.available ?? true, menu.categoryId || null]
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
          available=$4,
          category_id=$5
      WHERE id=$6
      RETURNING *
      `,
      [updatedMenu.item, updatedMenu.detail, updatedMenu.price, updatedMenu.available ?? true, updatedMenu.categoryId || null, id]
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
