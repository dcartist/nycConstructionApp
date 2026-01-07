// __tests__/controllers/jobs.test.js
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { connect, closeDatabase, clearDatabase } = require('../testDb');
const seedTestData = require('../seedHelper');
const jobsRouter = require('../../controllers/v2/jobs');
const Jobs = require('../../models/v2/Jobs');
const Property = require('../../models/v2/Property');
const Contractor = require('../../models/v2/Contractor');

// Create a test app
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/v2/jobs', jobsRouter);
  return app;
};

describe('Jobs Controller - POST /api/v2/jobs/add', () => {
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

  test('should create a new job with valid data', async () => {
    const jobData = {
      job_number: '123456789',
      job_description: 'New construction project',
      job_status: 'A',
      job_status_descrp: 'PRE-FILING',
      job_type: 'NB',
      approved: false,
      initial_cost: 50000,
      total_est__fee: 500
    };

    const response = await request(app)
      .post('/api/v2/jobs/add')
      .send(jobData)
      .expect(201);

    expect(response.body.message).toBe('Job created successfully');
    expect(response.body.job).toHaveProperty('_id');
    expect(response.body.job.job_number).toBe('123456789');

    // Verify it's in the database
    const savedJob = await Jobs.findOne({ job_number: '123456789' });
    expect(savedJob).not.toBeNull();
    expect(savedJob.job_type).toBe('NB');
  });

  test('should return 400 if job_number is missing', async () => {
    const jobData = {
      job_description: 'New construction project',
      job_status: 'A'
    };

    const response = await request(app)
      .post('/api/v2/jobs/add')
      .send(jobData)
      .expect(400);

    expect(response.body.error).toBe('Job number is required');
  });

  test('should return 409 if job_number already exists', async () => {
    const jobData = {
      job_number: '123456789',
      job_description: 'First project',
      job_status: 'A'
    };

    // Create first job
    await request(app)
      .post('/api/v2/jobs/add')
      .send(jobData)
      .expect(201);

    // Try to create duplicate
    const response = await request(app)
      .post('/api/v2/jobs/add')
      .send(jobData)
      .expect(409);

    expect(response.body.error).toBe('Job with this job number already exists');
  });

  test('should return 400 if invalid propertyID provided', async () => {
    const jobData = {
      job_number: '123456789',
      propertyID: 'invalid_id',
      job_status: 'A'
    };

    const response = await request(app)
      .post('/api/v2/jobs/add')
      .send(jobData)
      .expect(400);

    expect(response.body.error).toBe('Invalid property ID format');
  });

  test('should create job with valid propertyID', async () => {
    // Create a property first
    const propertyData = {
      house_num: '123',
      street_name: 'Main St',
      borough: 'BROOKLYN',
      zip: '10001'
    };

    const property = new Property(propertyData);
    await property.save();

    const jobData = {
      job_number: '123456789',
      propertyID: property._id.toString(),
      job_status: 'A'
    };

    const response = await request(app)
      .post('/api/v2/jobs/add')
      .send(jobData)
      .expect(201);

    expect(response.body.job.propertyID).toBe(property._id.toString());
  });

  test('should set default values correctly', async () => {
    const jobData = {
      job_number: '123456789',
      job_status: 'A'
    };

    const response = await request(app)
      .post('/api/v2/jobs/add')
      .send(jobData)
      .expect(201);

    expect(response.body.job.approved).toBe(false);
    expect(response.body.job.initial_cost).toBe(0);
    expect(response.body.job.total_est__fee).toBe(0);
    expect(response.body.job.contractors).toEqual([]);
  });
});

describe('Jobs Controller - GET /api/v2/jobs', () => {
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

  test('should return empty array when no jobs exist', async () => {
    const response = await request(app)
      .get('/api/v2/jobs')
      .expect(200);

    expect(response.body).toEqual([]);
  });

  test('should return jobs with property info', async () => {
    const propertyData = {
      house_num: '123',
      street_name: 'Main St',
      borough: 'BROOKLYN',
      zip: '10001'
    };

    const property = new Property(propertyData);
    await property.save();

    const jobData = {
      job_number: '123456789',
      propertyID: property._id.toString(),
      job_status: 'A'
    };

    const job = new Jobs(jobData);
    await job.save();

    const response = await request(app)
      .get('/api/v2/jobs')
      .expect(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toHaveProperty('job_number', '123456789');
    expect(response.body[0]).toHaveProperty('property');
    expect(response.body[0].property).toHaveProperty('house_num', '123');
  });
});
