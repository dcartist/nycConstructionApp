// __tests__/controllers/property.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { connect, closeDatabase, clearDatabase } = require('../testDb');
const propertyRouter = require('../../controllers/v2/property');
const Property = require('../../models/v2/Property');
const Owner = require('../../models/v2/Owner');

// Create a test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v2/property', propertyRouter);
  return app;
};

describe('Property Controller', () => {
  let app;

  beforeAll(async () => {
    await connect();
    app = createTestApp();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  beforeEach(async () => {
    await clearDatabase();
  });

  describe('GET /api/v2/property', () => {
    test('should return all properties', async () => {
      const propertyData = {
        house_num: '123',
        street_name: 'Main St',
        borough: 'BROOKLYN',
        zip: '10001'
      };

      const property = new Property(propertyData);
      await property.save();

      const response = await request(app)
        .get('/api/v2/property')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('street_name', 'Main St');
    });

    test('should return empty array when no properties exist', async () => {
      const response = await request(app)
        .get('/api/v2/property')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/v2/property/id/:propertyID', () => {
    test('should return a property by ID', async () => {
      const propertyData = {
        house_num: '456',
        street_name: 'Oak Ave',
        borough: 'MANHATTAN',
        zip: '10002'
      };

      const property = new Property(propertyData);
      await property.save();

      const response = await request(app)
        .get(`/api/v2/property/id/${property._id}`)
        .expect(200);

      expect(response.body).toHaveProperty('street_name', 'Oak Ave');
      expect(response.body._id.toString()).toBe(property._id.toString());
    });

    test('should return 404 for non-existent property', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/v2/property/id/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });
});
