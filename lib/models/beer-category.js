const pool = require('../utils/pool');

class BeerCategory {
  id;
  name;
  displayOrder;
  createdAt;
  updatedAt;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.displayOrder = row.display_order;
    this.createdAt = row.created_at;
    this.updatedAt = row.updated_at;
  }

  static async insert(category) {
    const { rows } = await pool.query(
      'INSERT INTO beer_categories (name, display_order) VALUES ($1, $2) RETURNING *',
      [category.name, category.displayOrder ?? 0]
    );

    return new BeerCategory(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM beer_categories WHERE id = $1',
      [id]
    );

    if (!rows[0]) return null;
    return new BeerCategory(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM beer_categories ORDER BY display_order, name'
    );

    return rows.map(row => new BeerCategory(row));
  }

  static async update(id, updatedCategory) {
    const { rows } = await pool.query(
      `UPDATE beer_categories
       SET name = $1,
           display_order = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [updatedCategory.name, updatedCategory.displayOrder, id]
    );

    if (!rows[0]) return null;
    return new BeerCategory(rows[0]);
  }

  static async delete(id) {
    // Prevent deletion of "Uncategorized" category
    const category = await BeerCategory.findById(id);
    if (category && category.name === 'Uncategorized') {
      throw new Error('Cannot delete the Uncategorized category');
    }

    const { rows } = await pool.query(
      'DELETE FROM beer_categories WHERE id = $1 RETURNING *',
      [id]
    );

    if (!rows[0]) return null;
    return new BeerCategory(rows[0]);
  }

  /**
   * Get all categories with their associated beer items grouped
   * Returns array of: { category_id, category_name, display_order, items: [...] }
   */
  static async getBeersGroupedByCategory() {
    const { rows } = await pool.query(
      `SELECT
         bc.id as category_id,
         bc.name as category_name,
         bc.display_order,
         COALESCE(
           json_agg(
             json_build_object(
               'id', b.id,
               'brewery', b.brewery,
               'style', b.style,
               'abv', b.abv,
               'price', b.price,
               'available', b.available,
               'categoryId', b.category_id,
               'createdAt', b.created_at,
               'updatedAt', b.updated_at
             )
             ORDER BY b.brewery
           ) FILTER (WHERE b.id IS NOT NULL),
           '[]'
         ) as items
       FROM beer_categories bc
       LEFT JOIN beers b ON (bc.id = b.category_id OR (bc.id = 1 AND b.category_id IS NULL))
       GROUP BY bc.id, bc.name, bc.display_order
       ORDER BY bc.display_order, bc.name`
    );

    return rows;
  }
}

module.exports = BeerCategory;
