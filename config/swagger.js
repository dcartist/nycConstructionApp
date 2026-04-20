const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NYC Job Construction Application API',
      version: '1.0.0',
      description: 'API documentation for NYC Job Construction Application - Track construction jobs, properties, contractors, and owners in NYC',
      contact: {
        name: 'Paula Bannerman (DCarist)',
        url: 'https://github.com/dcartist/nycConstructionApp'
      }
    },
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Development server'
      },
      {
        url: process.env.PRODUCTION_URL || 'https://api.example.com',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        Job: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Job ID'
            },
            job_num: {
              type: 'string',
              description: 'Job number'
            },
            job_type: {
              type: 'string',
              description: 'Type of job (e.g., A1, A2, A3, DM, NB)',
              enum: ['A1', 'A2', 'A3', 'DM', 'NB', 'PA', 'PR', 'SC', 'SG', 'SI', 'SU']
            },
            job_status: {
              type: 'string',
              description: 'Current status of the job'
            },
            job_status_descrp: {
              type: 'string',
              description: 'Description of job status'
            },
            property: {
              type: 'string',
              description: 'Property ID reference'
            },
            owner: {
              type: 'string',
              description: 'Owner ID reference'
            },
            contractor: {
              type: 'string',
              description: 'Contractor ID reference'
            },
            filing_date: {
              type: 'string',
              format: 'date',
              description: 'Date when job was filed'
            }
          }
        },
        Property: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Property MongoDB ObjectID'
            },
            house_num: {
              type: 'string',
              description: 'House number'
            },
            street_name: {
              type: 'string',
              description: 'Street name'
            },
            landmarked: {
              type: 'string',
              description: 'Landmarked status'
            },
            property_owner_firstName: {
              type: 'string',
              description: 'Property owner first name'
            },
            property_owner_lastName: {
              type: 'string',
              description: 'Property owner last name'
            },
            building_type: {
              type: 'string',
              description: 'Type of building'
            },
            existing_occupancy: {
              type: 'string',
              description: 'Existing occupancy type'
            },
            owner_type: {
              type: 'string',
              description: 'Owner type'
            },
            property_owner_business_name: {
              type: 'string',
              description: 'Property owner business name'
            },
            non_profit: {
              type: 'string',
              description: 'Non-profit status'
            },
            proptertyID: {
              type: 'number',
              description: 'Property ID number',
              default: 0
            },
            borough: {
              type: 'string',
              description: 'Borough name',
              enum: ['MANHATTAN', 'BROOKLYN', 'QUEENS', 'BRONX', 'STATEN ISLAND']
            },
            community___board: {
              type: 'number',
              description: 'Community board number',
              default: 0
            },
            ownerID: {
              type: 'string',
              description: 'Owner ObjectID reference'
            }
          }
        },
        Contractor: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Contractor MongoDB ObjectID'
            },
            license_sl_no: {
              type: 'string',
              description: 'License serial number'
            },
            license_type: {
              type: 'string',
              description: 'Type of license'
            },
            license_number: {
              type: 'string',
              description: 'License number'
            },
            last_name: {
              type: 'string',
              description: 'Last name'
            },
            first_name: {
              type: 'string',
              description: 'First name'
            },
            business_name: {
              type: 'string',
              description: 'Business name'
            },
            business_house_number: {
              type: 'string',
              description: 'Business house number'
            },
            business_street_name: {
              type: 'string',
              description: 'Business street name'
            },
            license_business_city: {
              type: 'string',
              description: 'Business city'
            },
            business_state: {
              type: 'string',
              description: 'Business state'
            },
            business_zip_code: {
              type: 'string',
              description: 'Business ZIP code'
            },
            business_phone_number: {
              type: 'string',
              description: 'Business phone number'
            },
            license_status: {
              type: 'string',
              description: 'Current license status',
              enum: ['Active', 'Expired', 'Ready for Renewal', 'Surrendered', 'Failed to Renew', 'Revoked', 'Voided', 'Suspended', 'Out of Business', 'Close']
            },
            job_listing: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of job IDs associated with this contractor',
              default: []
            }
          }
        },
        Owner: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Owner MongoDB ObjectID'
            },
            owner_id: {
              type: 'number',
              description: 'Unique owner ID number'
            },
            firstName: {
              type: 'string',
              description: 'Owner first name'
            },
            lastName: {
              type: 'string',
              description: 'Owner last name'
            },
            phone: {
              type: 'string',
              description: 'Phone number'
            },
            businessName: {
              type: 'string',
              description: 'Business name'
            },
            propertyID: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of property ObjectIDs owned by this owner'
            }
          }
        },
        Application: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Application ID'
            },
            applicant_firstName: {
              type: 'string',
              description: 'Applicant first name'
            },
            applicant_lastName: {
              type: 'string',
              description: 'Applicant last name'
            },
            applicant_title: {
              type: 'string',
              description: 'Professional title (RA, PE, RLA)',
              enum: ['RA', 'PE', 'RLA']
            },
            applicant_license: {
              type: 'string',
              description: 'License number'
            },
            job_listing: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Array of job numbers associated with this application',
              default: []
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            },
            details: {
              type: 'string',
              description: 'Error details'
            }
          }
        },
        Metadata: {
          type: 'object',
          properties: {
            JobTotal: {
              type: 'number',
              description: 'Total number of jobs'
            },
            OwnerTotal: {
              type: 'number',
              description: 'Total number of owners'
            },
            PropertyTotal: {
              type: 'number',
              description: 'Total number of properties'
            },
            ContractorTotal: {
              type: 'number',
              description: 'Total number of contractors'
            },
            ApplicationTotal: {
              type: 'number',
              description: 'Total number of applications'
            }
          }
        }
      },
      parameters: {
        PageParam: {
          in: 'query',
          name: 'page',
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          },
          description: 'Page number for pagination'
        },
        LimitParam: {
          in: 'query',
          name: 'limit',
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 30
          },
          description: 'Number of items per page'
        }
      },
      responses: {
        BadRequest: {
          description: 'Bad request',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              }
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'API Info',
        description: 'General API information and health checks'
      },
      {
        name: 'Jobs',
        description: 'Construction job management endpoints'
      },
      {
        name: 'Properties',
        description: 'Property management endpoints'
      },
      {
        name: 'Contractors',
        description: 'Contractor management endpoints'
      },
      {
        name: 'Owners',
        description: 'Property owner management endpoints'
      },
      {
        name: 'Applications',
        description: 'Application management endpoints'
      }
    ]
  },
  apis: ['./controllers/**/*.js', './index.js'], // Path to the API routes files
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = {
  swaggerSpec
};
