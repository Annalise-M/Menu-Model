const pool = require('../utils/pool');

class Menu {
  id;
  adminId;
  item;
  detail;
  price;

  constructor(row) {
    this.id = row.id;
    this.adminId = row.admin_id;
    this.item = row.item;
    this.detail = row.detail;
    this.price = row.price;
  }

  static async insert(menu) {
    const { rows } = await pool.query(
      'INSERT INTO menus (admin_id, item, detail, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [menu.adminId, menu.item, menu.detail, menu.price]
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
      SET admin_id=$1
          item=$2,
          detail=$3,
          price=$4
      WHERE id=$5
      RETURNING *
      `,
      [updatedMenu.adminId, updatedMenu.item, updatedMenu.detail, updatedMenu.price, id]
    );
    
    return new Menu(rows[0]);
  }

  static async delete(id, adminId) {
    const { rows } = await pool.query(
      `DELETE FROM menus WHERE id=$1 
      AND admin_id=$2
      RETURNING *`,
      [id, adminId]
    );

    return new Menu(rows[0]);
  }
}

module.exports = Menu;
