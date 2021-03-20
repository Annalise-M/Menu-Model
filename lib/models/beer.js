const pool = require('../utils/pool');

class Beer {
  id;
  brewery;
  style;
  abv;
  price;

  constructor(row) {
    this.id = row.id;
    this.brewery = row.brewery;
    this.style = row.style;
    this.abv = row.abv;
    this.price = row.price;
  }

  static async insert(beer) {
    const { rows } = await pool.query(
      'INSERT INTO beers (brewery, style, abv, price) VALUES ($1, $2, $3, $4 ) RETURNING *',
      [beer.brewery, beer.style, beer.abv, beer.price]
    );

    return new Beer(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM beers WHERE id = $1',
      [id]
    );

    if(!rows[0]) return null;
    else return new Beer(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM beers',
    );

    return rows.map(row => new Beer(row));
  }

  // static async update(id, updatedMenu) {
  //   const { rows } = await pool.query(
  //     `UPDATE menus
  //     SET item=$1,
  //         detail=$2,
  //         price=$3
  //     WHERE id = $4
  //     RETURNING *
  //     `,
  //     [updatedMenu.item, updatedMenu.detail, updatedMenu.price, id]
  //   );
    
  //   return new Menu(rows[0]);
  // }

  // static async delete(id) {
  //   const { rows } = await pool.query(
  //     'DELETE FROM menus WHERE id = $1 RETURNING *',
  //     [id]
  //   );

  //   return new Menu(rows[0]);
  // }
}

module.exports = Beer;
