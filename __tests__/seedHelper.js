// __tests__/seedHelper.js
// Helper for seeding test data
const Property = require('../models/v2/Property');
const Contractor = require('../models/v2/Contractor');
const Jobs = require('../models/v2/Jobs');
const Application = require('../models/v2/Application');
const Owner = require('../models/v2/Owner');

const seedTestData = {
  // Create sample owner
  createOwner: async (overrides = {}) => {
    const ownerData = {
      owner_id: Math.floor(Math.random() * 10000),
      firstName: 'Test',
      lastName: 'Owner',
      businessName: 'Test Business',
      phone: '5551234567',
      ...overrides
    };
    
    const owner = new Owner(ownerData);
    await owner.save();
    return owner;
  },

  // Create sample property
  createProperty: async (overrides = {}) => {
    const propertyData = {
      house_num: '123',
      street_name: 'Test Street',
      borough: 'BROOKLYN',
      zip: '10001',
      ...overrides
    };

    const property = new Property(propertyData);
    await property.save();
    return property;
  },

  // Create sample contractor
  createContractor: async (overrides = {}) => {
    const contractorData = {
      business_name: 'Test Contractors Inc',
      business_house_number: '456',
      business_street_name: 'Contractor St',
      license_business_city: 'New York',
      business_state: 'NY',
      business_zip_code: '10002',
      business_phone_number: '5559876543',
      license_status: 'ACTIVE',
      ...overrides
    };

    const contractor = new Contractor(contractorData);
    await contractor.save();
    return contractor;
  },

  // Create sample job
  createJob: async (overrides = {}) => {
    const jobData = {
      job_number: `JOB${Math.floor(Math.random() * 999999999)}`,
      job_status: 'A',
      job_status_descrp: 'PRE-FILING',
      job_type: 'NB',
      approved: false,
      initial_cost: 10000,
      total_est__fee: 500,
      contractors: [],
      ...overrides
    };

    const job = new Jobs(jobData);
    await job.save();
    return job;
  },

  // Create sample application
  createApplication: async (overrides = {}) => {
    const appData = {
      job_number: `JOB${Math.floor(Math.random() * 999999999)}`,
      applicant_firstName: 'Test',
      applicant_lastName: 'Applicant',
      applicant_title: 'RA',
      applicant_license: `LIC${Math.floor(Math.random() * 999999)}`,
      job_listing: [],
      ...overrides
    };

    const app = new Application(appData);
    await app.save();
    return app;
  },

  // Create a complete job scenario with all related data
  createCompleteJobScenario: async () => {
    const owner = await seedTestData.createOwner();
    const property = await seedTestData.createProperty({ ownerID: owner._id });
    const contractor = await seedTestData.createContractor();
    const job = await seedTestData.createJob({
      propertyID: property._id,
      contractors: [contractor._id]
    });
    const application = await seedTestData.createApplication({
      job_listing: [job.job_number]
    });

    // Update job with application reference
    job.application_id = application._id;
    await job.save();

    return { owner, property, contractor, job, application };
  }
};

module.exports = seedTestData;
