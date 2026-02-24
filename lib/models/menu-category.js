const pool = require('../utils/pool');

class MenuCategory {
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
      'INSERT INTO menu_categories (name, display_order) VALUES ($1, $2) RETURNING *',
      [category.name, category.displayOrder ?? 0]
    );

    return new MenuCategory(rows[0]);
  }

  static async findById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM menu_categories WHERE id = $1',
      [id]
    );

    if (!rows[0]) return null;
    return new MenuCategory(rows[0]);
  }

  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM menu_categories ORDER BY display_order, name'
    );

    return rows.map(row => new MenuCategory(row));
  }

  static async update(id, updatedCategory) {
    const { rows } = await pool.query(
      `UPDATE menu_categories
       SET name = $1,
           display_order = $2,
           updated_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [updatedCategory.name, updatedCategory.displayOrder, id]
    );

    if (!rows[0]) return null;
    return new MenuCategory(rows[0]);
  }

  static async delete(id) {
    // Prevent deletion of "Uncategorized" category
    const category = await MenuCategory.findById(id);
    if (category && category.name === 'Uncategorized') {
      throw new Error('Cannot delete the Uncategorized category');
    }

    const { rows } = await pool.query(
      'DELETE FROM menu_categories WHERE id = $1 RETURNING *',
      [id]
    );

    if (!rows[0]) return null;
    return new MenuCategory(rows[0]);
  }

  /**
   * Get all categories with their associated menu items grouped
   * Returns array of: { category_id, category_name, display_order, items: [...] }
   */
  static async getMenusGroupedByCategory() {
    const { rows } = await pool.query(
      `SELECT
         mc.id as category_id,
         mc.name as category_name,
         mc.display_order,
         COALESCE(
           json_agg(
             json_build_object(
               'id', m.id,
               'item', m.item,
               'detail', m.detail,
               'price', m.price,
               'available', m.available,
               'categoryId', m.category_id,
               'createdAt', m.created_at,
               'updatedAt', m.updated_at
             )
             ORDER BY m.item
           ) FILTER (WHERE m.id IS NOT NULL),
           '[]'
         ) as items
       FROM menu_categories mc
       LEFT JOIN menus m ON (mc.id = m.category_id OR (mc.id = 1 AND m.category_id IS NULL))
       GROUP BY mc.id, mc.name, mc.display_order
       ORDER BY mc.display_order, mc.name`
    );

    return rows;
  }
}

module.exports = MenuCategory;
