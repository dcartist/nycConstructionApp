const express = require('express');
const parser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { swaggerUi, swaggerSpec } = require('./config/swagger');
const conController = require('./controllers/contractor.js');
const ownController = require('./controllers/owner.js');
const propController = require('./controllers/property.js');
const jobController = require('./controllers/job.js');
const indexController = require('./controllers/v2/index.js');
const v2Controller = require('./controllers/v2/index.js');
const userController = require('./controllers/users.js');

const app = express();

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());
app.use(cors());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Swagger API documentation
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'NYC Construction App API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  })
);

app.use('/api/', indexController);
app.use('/api/user', userController);
app.use('/api/contractor', conController);
app.use('/api/owner', ownController);
app.use('/api/property', propController);
app.use('/api/job', jobController);
app.use('/api/v2', v2Controller);

app.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: 'NYC Construction App API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
  })
);

module.exports = app;
