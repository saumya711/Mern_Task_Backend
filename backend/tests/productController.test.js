const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const Product = require('../models/productModel');

describe('Product Controller', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await Product.deleteMany();
  });

  it('should create a new product', async () => {
    const productData = {
      productName: 'Test Product',
      category: 'Test Category',
    };

    const response = await request(app)
      .post('/api/products/post-product')
      .send(productData);

    expect(response.status).toBe(200);
    expect(response.body.productName).toBe(productData.productName);
    expect(response.body.category).toBe(productData.category);
  });

  it('should get all products', async () => {
    await Product.create({
      productName: 'Product 1',
      category: 'Category 1',
    });
    await Product.create({
      productName: 'Product 2',
      category: 'Category 2',
    });

    const response = await request(app).get('/api/products/get-products');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });

  it('should return a single product if it exists', async () => {
    const product = await Product.create({
      productName: 'Test Product',
      category: 'Test Category',
    });

    const response = await request(app).get(`/api/products/get-product/${product._id}`);

    expect(response.status).toBe(200);
    expect(response.body.productName).toBe(product.productName);
    expect(response.body.category).toBe(product.category);
  });

  it('should return 404 if product does not exist', async () => {
    const invalidProductId = 'invalidProductId';

    const response = await request(app).get(`/api/products/get-product/${invalidProductId}`);

    expect(response.status).toBe(404);
    expect(response.body).toBe(`No Product with id: ${invalidProductId}`);
  });

  it('should update a product if it exists', async () => {
    const product = await Product.create({
      productName: 'Test Product',
      category: 'Test Category',
    });

    const updatedProductData = {
      productName: 'Updated Product',
      category: 'Updated Category',
    };

    const response = await request(app)
      .put(`/api/products/update-product/${product._id}`)
      .send(updatedProductData);

    expect(response.status).toBe(200);
    expect(response.body.productName).toBe(updatedProductData.productName);
    expect(response.body.category).toBe(updatedProductData.category);
  });

  it('should return 404 if product does not exist (update)', async () => {
    const invalidProductId = 'invalidProductId';

    const response = await request(app)
      .put(`/api/products/update-product/${invalidProductId}`)
      .send({
        productName: 'Updated Product',
        category: 'Updated Category',
      });

    expect(response.status).toBe(404);
    expect(response.body).toBe(`No Product with id: ${invalidProductId}`);
  });


  it('should delete a product if it exists', async () => {
    const product = await Product.create({
      productName: 'Test Product',
      category: 'Test Category',
    });

    const response = await request(app).delete(`/api/products/delete-product/${product._id}`);

    expect(response.status).toBe(200);
    expect(response.text).toBe('Product Deleted');

    const deletedProduct = await Product.findById(product._id);
    expect(deletedProduct).toBeNull();
  });

  it('should return 404 if product does not exist', async () => {
    const invalidProductId = 'invalidProductId';

    const response = await request(app).delete(`/api/products/delete-product/${invalidProductId}`);

    expect(response.status).toBe(404);
    expect(response.body).toBe(`No Product with id: ${invalidProductId}`);
  });

});