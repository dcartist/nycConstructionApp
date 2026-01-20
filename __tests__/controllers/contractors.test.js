// __tests__/controllers/contractors.test.js
const request = require('supertest');
const express = require('express');
const { connect, closeDatabase, clearDatabase } = require('../testDb');
const contractorsRouter = require('../../controllers/v2/contractors');
const Contractor = require('../../models/v2/Contractor');

// Create a test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v2/contractors', contractorsRouter);
  return app;
};

describe('Contractors Controller', () => {
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

  describe('GET /api/v2/contractors', () => {
    test('should return all contractors', async () => {
      const contractorData = {
        business_name: 'ABC Construction',
        business_house_number: '100',
        business_street_name: 'Construction Ave',
        license_business_city: 'New York',
        business_state: 'NY',
        business_zip_code: '10001',
        business_phone_number: '5551234567',
        license_status: 'ACTIVE'
      };

      const contractor = new Contractor(contractorData);
      await contractor.save();

      const response = await request(app)
        .get('/api/v2/contractors')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('business_name', 'ABC Construction');
    });

    test('should return empty array when no contractors exist', async () => {
      const response = await request(app)
        .get('/api/v2/contractors')
        .expect(200);

      expect(response.body).toEqual([]);
    });
  });

  describe('POST /api/v2/contractors/add', () => {
    test('should create a new contractor', async () => {
      const contractorData = {
        business_name: 'XYZ Construction',
        business_house_number: '200',
        business_street_name: 'Build St',
        license_business_city: 'Brooklyn',
        business_state: 'NY',
        business_zip_code: '10002',
        business_phone_number: '5559876543',
        license_status: 'ACTIVE'
      };

      const response = await request(app)
        .post('/api/v2/contractors/add')
        .send(contractorData);

      expect(response.status).toBeLessThan(400); // Either 200 or 201
      expect(response.body).toHaveProperty('business_name', 'XYZ Construction');
    });
  });
});
