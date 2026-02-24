const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');
const Beer = require('../lib/models/beer');

describe('Beer bulk import routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('imports multiple valid beer items', async () => {
    const items = [
      { brewery: 'Deschutes', style: 'IPA', abv: 6.5, price: 8.00 },
      { brewery: 'Sierra Nevada', style: 'Pale Ale', abv: 5.6, price: 7.00 },
      { brewery: 'Guinness', style: 'Stout', abv: 4.2, price: 7.50 }
    ];

    const res = await request(app)
      .post('/api/v1/beers/bulk-import')
      .send({ items });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.imported).toBe(3);
    expect(res.body.items).toHaveLength(3);
    expect(res.body.items[0]).toEqual({
      id: expect.any(String),
      brewery: 'Deschutes',
      style: 'IPA',
      abv: 6.5,
      price: 8.00,
      available: true,
      categoryId: null,
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });

    // Verify items were inserted into database
    const beers = await Beer.find();
    expect(beers).toHaveLength(3);
  });

  it('processes large batches (>100 items)', async () => {
    // Create 250 items to test batching
    const items = [];
    for (let i = 1; i <= 250; i++) {
      items.push({
        brewery: `Brewery ${i}`,
        style: `Style ${i}`,
        abv: 5.0 + (i % 10),
        price: 7 + (i % 5)
      });
    }

    const res = await request(app)
      .post('/api/v1/beers/bulk-import')
      .send({ items });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.imported).toBe(250);

    // Verify all items were inserted
    const beers = await Beer.find();
    expect(beers).toHaveLength(250);
  });

  it('rolls back transaction on validation failure', async () => {
    const items = [
      { brewery: 'Valid Brewery', style: 'IPA', abv: 6.5, price: 8.00 },
      { brewery: '', style: '', abv: -1, price: -5 } // Invalid: empty fields and negative values
    ];

    const res = await request(app)
      .post('/api/v1/beers/bulk-import')
      .send({ items });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Bulk validation failed');

    // Verify NO items were inserted (transaction rolled back)
    const beers = await Beer.find();
    expect(beers).toHaveLength(0);
  });

  it('rejects imports with no items', async () => {
    const res = await request(app)
      .post('/api/v1/beers/bulk-import')
      .send({ items: [] });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Bulk validation failed');
  });

  it('rejects imports exceeding 1000 items', async () => {
    const items = [];
    for (let i = 1; i <= 1001; i++) {
      items.push({
        brewery: `Brewery ${i}`,
        style: `Style ${i}`,
        abv: 5.0,
        price: 8.00
      });
    }

    const res = await request(app)
      .post('/api/v1/beers/bulk-import')
      .send({ items });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Bulk validation failed');
  });

  it('handles items with category assignments', async () => {
    const items = [
      { brewery: 'Deschutes', style: 'IPA', abv: 6.5, price: 8.00, categoryId: 1 },
      { brewery: 'Guinness', style: 'Stout', abv: 4.2, price: 7.50, categoryId: 2 }
    ];

    const res = await request(app)
      .post('/api/v1/beers/bulk-import')
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
        brewery: '<script>alert("xss")</script>',
        style: '<img src=x onerror=alert(1)>',
        abv: 5.0,
        price: 8
      }
    ];

    const res = await request(app)
      .post('/api/v1/beers/bulk-import')
      .send({ items });

    expect(res.status).toBe(200);
    expect(res.body.items[0].brewery).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;');
    expect(res.body.items[0].style).toBe('&lt;img src=x onerror=alert(1)&gt;');
  });
});
