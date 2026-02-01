const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
              description: 'Property ID'
            },
            house_num: {
              type: 'string',
              description: 'House number'
            },
            street_name: {
              type: 'string',
              description: 'Street name'
            },
            borough: {
              type: 'string',
              description: 'Borough name',
              enum: ['MANHATTAN', 'BROOKLYN', 'QUEENS', 'BRONX', 'STATEN ISLAND']
            },
            bin: {
              type: 'string',
              description: 'Building Identification Number'
            },
            block: {
              type: 'string',
              description: 'Block number'
            },
            lot: {
              type: 'string',
              description: 'Lot number'
            },
            zip_code: {
              type: 'string',
              description: 'ZIP code'
            }
          }
        },
        Contractor: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Contractor ID'
            },
            owner_business_name: {
              type: 'string',
              description: 'Business name'
            },
            owner_phone: {
              type: 'string',
              description: 'Phone number'
            }
          }
        },
        Owner: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              description: 'Owner ID'
            },
            owner_business_name: {
              type: 'string',
              description: 'Business name'
            },
            owner_phone: {
              type: 'string',
              description: 'Phone number'
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
            job: {
              type: 'string',
              description: 'Job ID reference'
            },
            doc_num: {
              type: 'string',
              description: 'Document number'
            },
            filing_status: {
              type: 'string',
              description: 'Filing status'
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
  swaggerUi,
  swaggerSpec
};
