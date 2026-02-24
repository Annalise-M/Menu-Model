const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const Menu = require('../lib/models/menu');

describe('Menu bulk import routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('imports multiple valid menu items', async () => {
    const items = [
      { item: 'Caesar Salad', detail: 'Fresh romaine with parmesan', price: 12.99 },
      { item: 'Classic Burger', detail: 'Beef patty with lettuce', price: 14.99 },
      { item: 'Fish & Chips', detail: 'Beer-battered cod with fries', price: 15.99 }
    ];

    const res = await request(app)
      .post('/api/v1/menus/bulk-import')
      .send({ items });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.imported).toBe(3);
    expect(res.body.items).toHaveLength(3);
    expect(res.body.items[0]).toEqual({
      id: expect.any(String),
      item: 'Caesar Salad',
      detail: 'Fresh romaine with parmesan',
      price: 12.99,
      available: true,
      categoryId: null,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });

    // Verify items were inserted into database
    const menus = await Menu.find();
    expect(menus).toHaveLength(3);
  });

  it('processes large batches (>100 items)', async () => {
    // Create 250 items to test batching
    const items = [];
    for (let i = 1; i <= 250; i++) {
      items.push({
        item: `Item ${i}`,
        detail: `Description ${i}`,
        price: 10 + i
      });
    }

    const res = await request(app)
      .post('/api/v1/menus/bulk-import')
      .send({ items });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.imported).toBe(250);

    // Verify all items were inserted
    const menus = await Menu.find();
    expect(menus).toHaveLength(250);
  });

  it('rolls back transaction on validation failure', async () => {
    const items = [
      { item: 'Valid Item', detail: 'Good data', price: 10.99 },
      { item: '', detail: 'Invalid - no name', price: -5 } // Invalid: empty name and negative price
    ];

    const res = await request(app)
      .post('/api/v1/menus/bulk-import')
      .send({ items });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Bulk validation failed');

    // Verify NO items were inserted (transaction rolled back)
    const menus = await Menu.find();
    expect(menus).toHaveLength(0);
  });

  it('rejects imports with no items', async () => {
    const res = await request(app)
      .post('/api/v1/menus/bulk-import')
      .send({ items: [] });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Bulk validation failed');
  });

  it('rejects imports exceeding 1000 items', async () => {
    const items = [];
    for (let i = 1; i <= 1001; i++) {
      items.push({
        item: `Item ${i}`,
        detail: `Description ${i}`,
        price: 10
      });
    }

    const res = await request(app)
      .post('/api/v1/menus/bulk-import')
      .send({ items });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Bulk validation failed');
  });

  it('handles items with category assignments', async () => {
    const items = [
      { item: 'Salad', detail: 'Fresh greens', price: 8.99, categoryId: 1 },
      { item: 'Soup', detail: 'Hot soup', price: 6.99, categoryId: 2 }
    ];

    const res = await request(app)
      .post('/api/v1/menus/bulk-import')
      .send({ items });

    expect(res.status).toBe(200);
    expect(res.body.imported).toBe(2);
    // categoryId is stored as BIGINT and returned as string
    expect(res.body.items[0].categoryId).toBe('1');
    expect(res.body.items[1].categoryId).toBe('2');
  });

  it('escapes HTML in bulk import to prevent XSS', async () => {
    const items = [
      {
        item: '<script>alert("xss")</script>',
        detail: '<img src=x onerror=alert(1)>',
        price: 10
      }
    ];

    const res = await request(app)
      .post('/api/v1/menus/bulk-import')
      .send({ items });

    expect(res.status).toBe(200);
    expect(res.body.items[0].item).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    expect(res.body.items[0].detail).toBe('&lt;img src=x onerror=alert(1)&gt;');
  });
});
