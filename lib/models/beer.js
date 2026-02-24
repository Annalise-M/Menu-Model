const pool = require('../utils/pool');

class Beer {
  id;
  brewery;
  style;
  abv;
  price;
  available;
  categoryId;
  createdAt;
  updatedAt;

  constructor(row) {
    this.id = row.id;
    this.brewery = row.brewery;
    this.style = row.style;
    this.abv = parseFloat(row.abv);
    this.price = parseFloat(row.price);
    this.available = row.available ?? true; // Default to true if not set
    this.categoryId = row.category_id;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }

  static async insert(beer) {
    const { rows } = await pool.query(
      'INSERT INTO beers (brewery, style, abv, price, available, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [beer.brewery, beer.style, beer.abv, beer.price, beer.available ?? true, beer.categoryId || null]
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
          available=$5,
          category_id=$6
      WHERE id=$7
      RETURNING *
      `,
      [updatedBeer.brewery, updatedBeer.style, updatedBeer.abv, updatedBeer.price, updatedBeer.available ?? true, updatedBeer.categoryId || null, id]
    );

    if(!rows[0]) throw new Error('No post with auth found');

    return new Beer(rows[0]);
  }

  static async deleteBeerById(id) {
    const { rows } = await pool.query(
      `DELETE FROM beers WHERE id=$1
      RETURNING *`,
      [id]
    );

    return new Beer(rows[0]);
  }

  static async bulkInsert(beers, client = pool) {
    if (!beers || beers.length === 0) {
      return [];
    }

    const values = [];
    const placeholders = [];
    let paramIndex = 1;

    beers.forEach(beer => {
      values.push(
        beer.brewery,
        beer.style,
        beer.abv,
        beer.price,
        beer.available ?? true,
        beer.categoryId || null
      );
      placeholders.push(
        `($${paramIndex}, $${paramIndex + 1}, $${paramIndex + 2}, $${paramIndex + 3}, $${paramIndex + 4}, $${paramIndex + 5})`
      );
      paramIndex += 6;
    });

    const query = `
      INSERT INTO beers (brewery, style, abv, price, available, category_id)
      VALUES ${placeholders.join(', ')}
      RETURNING *
    `;

    const { rows } = await client.query(query, values);
    return rows.map(row => new Beer(row));
  }
}

module.exports = Beer;
