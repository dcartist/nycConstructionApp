// __tests__/controllers/owners.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { connect, closeDatabase, clearDatabase } = require('../testDb');
const ownersRouter = require('../../controllers/v2/owners');
const Owner = require('../../models/v2/Owner');

// Create a test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v2/owners', ownersRouter);
  return app;
};

describe('Owners Controller', () => {
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

  describe('GET /api/v2/owners', () => {
    test('should return all owners', async () => {
      const ownerData = {
        owner_id: 1000,
        firstName: 'John',
        lastName: 'Doe',
        businessName: 'Doe Enterprises',
        phone: '5551234567'
      };

      const owner = new Owner(ownerData);
      await owner.save();

      const response = await request(app)
        .get('/api/v2/owners')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('firstName', 'John');
    });

    test('should return empty array when no owners exist', async () => {
      const response = await request(app)
        .get('/api/v2/owners')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('GET /api/v2/owners/id/:id', () => {
    test('should return owner by ID with properties', async () => {
      const ownerData = {
        owner_id: 1001,
        firstName: 'Jane',
        lastName: 'Smith',
        businessName: 'Smith Properties',
        phone: '5559876543'
      };

      const owner = new Owner(ownerData);
      await owner.save();

      const response = await request(app)
        .get(`/api/v2/owners/id/${owner._id}`)
        .expect(200);

      expect(response.body).toHaveProperty('firstName', 'Jane');
      expect(response.body._id.toString()).toBe(owner._id.toString());
    });

    test('should return 404 for non-existent owner', async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/v2/owners/id/${fakeId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error');
    });
  });
});
