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

  describe('PUT /api/v2/contractors/edit/:id', () => {
    test('should update an existing contractor with allowed fields only', async () => {
      const contractor = await Contractor.create({
        business_name: 'Old Name',
        business_house_number: '300',
        business_street_name: 'Old St',
        license_business_city: 'Queens',
        business_state: 'NY',
        business_zip_code: '11111',
        business_phone_number: '5550000000',
        license_status: 'ACTIVE'
      });

      const updatePayload = {
        business_name: 'New Name',
        license_status: 'EXPIRED',
        someRandomField: 'shouldBeIgnored'
      };

      const response = await request(app)
        .put(`/api/v2/contractors/edit/${contractor._id}`)
        .send(updatePayload)
        .expect(200);

      expect(response.body).toHaveProperty('_id', contractor._id.toString());
      expect(response.body).toHaveProperty('business_name', 'New Name');
      expect(response.body).toHaveProperty('license_status', 'EXPIRED');
      expect(response.body).not.toHaveProperty('someRandomField');

      const updatedFromDb = await Contractor.findById(contractor._id);
      expect(updatedFromDb.business_name).toBe('New Name');
      expect(updatedFromDb.license_status).toBe('EXPIRED');
    });

    test('should return 400 when body is empty', async () => {
      const contractor = await Contractor.create({
        business_name: 'Name',
        business_house_number: '10',
        business_street_name: 'Any St',
        license_business_city: 'NYC',
        business_state: 'NY',
        business_zip_code: '10000',
        business_phone_number: '5551111111',
        license_status: 'ACTIVE'
      });

      const response = await request(app)
        .put(`/api/v2/contractors/edit/${contractor._id}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    test('should return 404 when contractor does not exist', async () => {
      const nonExistingId = '65a0f3b8c1a5f5c1c0d9f123';

      const response = await request(app)
        .put(`/api/v2/contractors/edit/${nonExistingId}`)
        .send({ business_name: 'Does Not Matter' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Contractor not found');
    });
  });

  describe('GET /api/v2/contractors/newNumber', () => {
    test('should return baseline new number when no license numbers exist', async () => {
      const response = await request(app)
        .get('/api/v2/contractors/newNumber')
        .expect(200);

      expect(response.body).toHaveProperty('new_contractor_number');
      expect(response.body.new_contractor_number).toBe('100001');
    });

    test('should return next sequential number based on existing licenses', async () => {
      await Contractor.create([
        {
          business_name: 'Contractor 1',
          license_number: '100150',
          license_status: 'ACTIVE'
        },
        {
          business_name: 'Contractor 2',
          license_number: 'ABC100200',
          license_status: 'ACTIVE'
        },
        {
          business_name: 'Contractor 3',
          license_number: null,
          license_status: 'ACTIVE'
        }
      ]);

      const response = await request(app)
        .get('/api/v2/contractors/newNumber')
        .expect(200);

      // Highest numeric part is 100200 so next should be 100201
      expect(response.body).toHaveProperty('new_contractor_number', '100201');
    });
  });
});
