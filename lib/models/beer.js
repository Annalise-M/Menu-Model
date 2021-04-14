const pool = require('../utils/pool');

class Beer {
  id;
  adminId;
  brewery;
  style;
  abv;
  price;

  constructor(row) {
    this.id = row.id;
    this.adminId = row.admin_id;
    this.brewery = row.brewery;
    this.style = row.style;
    this.abv = row.abv;
    this.price = row.price;
  }

  static async insert(beer) {
    const { rows } = await pool.query(
      'INSERT INTO beers (admin_id, brewery, style, abv, price) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [beer.adminId, beer.brewery, beer.style, beer.abv, beer.price]
    );

    return new Beer(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM beers WHERE id=$1',
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

  static async updateBeerById(id, updatedBeer) {
    const { rows } = await pool.query(
      `UPDATE beers
      SET brewery=$1,
          style=$2,
          abv=$3,
          price=$4,
          admin_id=$5
      WHERE id=$6
      RETURNING *
      `,
      [updatedBeer.brewery, updatedBeer.style, updatedBeer.abv, updatedBeer.price, updatedBeer.adminId, id]
    );
    
    if(!rows[0]) throw new Error('No post with auth found');
    
    return new Beer(rows[0]);
  }

  static async delete(id, adminId) {
    const { rows } = await pool.query(
      `DELETE FROM beers WHERE id = $1
      AND admin_id=$2
      RETURNING *
      `,
      [id, adminId]
    );

    return new Beer(rows[0]);
  }
}

module.exports = Beer;
