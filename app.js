const express = require('express');
const parser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { connectDB } = require('./db/connection');

const { swaggerSpec } = require('./config/swagger');
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

const swaggerHtml = `<!DOCTYPE html>
<html>
  <head>
    <title>NYC Construction App API Documentation</title>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.31.0/swagger-ui.css">
    <style>.swagger-ui .topbar { display: none }</style>
  </head>
  <body>
  
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.31.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.31.0/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = function() {
        SwaggerUIBundle({
          url: "/api-docs/swagger.json",
          dom_id: '#swagger-ui',
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          layout: "StandaloneLayout"
        });
      }
    </script>
  </body>
</html>`;

// Serve swagger spec as JSON
app.get('/api-docs/swagger.json', (_req, res) => {
  res.json(swaggerSpec);
});

// Swagger UI using CDN assets (works on Vercel serverless)
app.get('/api-docs', (_req, res) => res.send(swaggerHtml));
app.get('/', (_req, res) => res.send(swaggerHtml));

app.use('/api/', indexController);
app.use('/api/user', userController);
app.use('/api/contractor', conController);
app.use('/api/owner', ownController);
app.use('/api/property', propController);
app.use('/api/job', jobController);
app.use('/api/v2', v2Controller);

module.exports = app;
