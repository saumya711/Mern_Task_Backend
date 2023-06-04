const request = require('supertest');
const app = require('../server');

describe('POST api/products/post-product', () => {
  let server;

  beforeAll(async () => {
    // Start the server and store the server instance
    server = await app.listen(5000);
  });

  afterAll(async () => {
    // Stop the server
    await server.close();
  });

  it('should return 200 if the required fields are provided', async () => {
    await request(server)
      .post('/api/products/post-product') // Update the route path
      .send({
        productName: 'Test Product',
        category: 'Test Category',
      })
      .expect(200);
  });

  it('should return 500 if productName is missing', async () => {
    await request(server)
      .post('/api/products/post-product') // Update the route path
      .send({
        category: 'Test Category',
      })
      .expect(500);
  });

  it('should return 500 if category is missing', async () => {
    await request(server)
      .post('/api/products/post-product') // Update the route path
      .send({
        productName: 'Test Product',
      })
      .expect(500);
  });
});
