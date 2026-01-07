# Testing Guide for NYC Construction App

## Overview

This project uses **Jest** for unit and integration testing, with **Supertest** for HTTP endpoint testing and **MongoDB Memory Server** for isolated database testing.

## Test Structure

```
__tests__/
├── controllers/          # Integration tests for routes
│   ├── jobs.test.js      # Jobs controller tests
│   ├── property.test.js  # Property controller tests
│   ├── contractors.test.js
│   └── owners.test.js
├── testDb.js            # Database setup/teardown helper
└── seedHelper.js        # Utility functions for creating test data
```

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests in watch mode (auto-rerun on changes)
```bash
npm run test:watch
```

### Generate coverage report
```bash
npm run test:coverage
```

### Run specific test file
```bash
npm test -- __tests__/controllers/jobs.test.js
```

## Test Database Setup

Each test suite:
1. Connects to an in-memory MongoDB instance (no external database needed)
2. Clears all collections before each test
3. Disconnects after all tests complete

See `__tests__/testDb.js` for implementation details.

## Using the Seed Helper

The `seedHelper.js` module provides utilities to quickly create test data:

```javascript
const seedTestData = require('../seedHelper');

// Create individual records
const owner = await seedTestData.createOwner({
  firstName: 'John',
  lastName: 'Doe'
});

const property = await seedTestData.createProperty({
  street_name: 'Main St',
  borough: 'BROOKLYN'
});

const contractor = await seedTestData.createContractor({
  business_name: 'XYZ Construction'
});

const job = await seedTestData.createJob({
  job_number: 'JOB123456',
  propertyID: property._id,
  contractors: [contractor._id]
});

// Create a complete scenario with all related data
const { owner, property, contractor, job, application } = 
  await seedTestData.createCompleteJobScenario();
```

### Available Helper Methods

- `createOwner(overrides)` - Create an owner record
- `createProperty(overrides)` - Create a property record
- `createContractor(overrides)` - Create a contractor record
- `createJob(overrides)` - Create a job record
- `createApplication(overrides)` - Create an application record
- `createCompleteJobScenario()` - Create a complete linked scenario

All methods accept an `overrides` object to customize the data.

## Example Test

```javascript
const request = require('supertest');
const { connect, closeDatabase, clearDatabase } = require('../testDb');
const seedTestData = require('../seedHelper');
const jobsRouter = require('../../controllers/v2/jobs');

describe('Jobs Controller', () => {
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

  test('should create a job for a property', async () => {
    // Create test data
    const property = await seedTestData.createProperty();
    
    const jobData = {
      job_number: '123456789',
      propertyID: property._id.toString(),
      job_status: 'A'
    };

    // Make request
    const response = await request(app)
      .post('/api/v2/jobs/add')
      .send(jobData)
      .expect(201);

    // Assert
    expect(response.body.job).toHaveProperty('_id');
    expect(response.body.job.propertyID).toBe(property._id.toString());
  });
});
```

## Current Test Coverage

| Controller | Tests | Status |
|-----------|-------|--------|
| Jobs      | 8     | ✅ PASS |
| Property  | 3     | ✅ PASS |
| Owners    | 3     | ✅ PASS |
| Contractors | 3   | ✅ PASS |

**Total: 19 tests passing**

## Adding New Tests

1. Create a new test file in `__tests__/controllers/` with `.test.js` suffix
2. Import the required modules:
   ```javascript
   const request = require('supertest');
   const { connect, closeDatabase, clearDatabase } = require('../testDb');
   const seedTestData = require('../seedHelper');
   ```
3. Use the standard Jest test structure:
   ```javascript
   describe('Feature Name', () => {
     beforeAll(async () => { /* setup */ });
     afterAll(async () => { /* cleanup */ });
     beforeEach(async () => { /* reset before each test */ });
     
     test('should do something', async () => { /* test */ });
   });
   ```

## Seeding Production Data

To seed the database with actual NYC construction data:

```bash
node db/v2/seed.js
```

This script:
- Fetches data from NYC Open Data API
- Creates Property, Job, Contractor, Owner, and Application records
- Links all relationships
- Exits when complete

**Note:** Requires `db/v2/seed.js` to be run from the project root with a connected MongoDB instance.

## Notes

- Tests use MongoDB Memory Server, so no external database is required
- Each test suite gets a fresh, isolated database
- Mongoose connection cleanup happens automatically between tests
- See `jest.config.js` for configuration details
