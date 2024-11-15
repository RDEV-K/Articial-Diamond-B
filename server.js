require('dotenv').config();
const path = require('path');
const fastify = require('fastify')({ logger: true });
const sequelizePlugin = require('./plugins/sequelize');
const loadRoutes = require('./loadRoutes');
const cors = require('@fastify/cors');
const multipart = require('fastify-multipart');

// Register the sequelize plugin
fastify.register(sequelizePlugin);

fastify.register(multipart, {
  attachFieldsToBody: true,
  limits: { fileSize: 10 * 1024 * 1024 } 
});

// Autoload routes from the 'routes' directory
fastify.register(loadRoutes);

fastify.register(require('@fastify/cors'), {
  // origin: false,
  origin: ['http://127.0.0.1:3000', 'http://localhost:3000','https://labnet.diamonds','http://labnet.diamonds','https://main.d151wgcu3whf4m.amplifyapp.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'], // Customize your allowed headers,
  credentials: true
});


// fastify.register(require('@fastify/swagger'), {
//   openapi: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Test swagger',
//       description: 'Testing the Fastify swagger API',
//       version: '0.1.0'
//     },
//     servers: [
//       {
//         url: 'http://localhost:3000',
//         description: 'Development server'
//       }
//     ],
//     tags: [
//       { name: 'user', description: 'User related end-points' },
//       { name: 'code', description: 'Code related end-points' }
//     ],
//     components: {
//       securitySchemes: {
//         apiKey: {
//           type: 'apiKey',
//           name: 'apiKey',
//           in: 'header'
//         }
//       }
//     },
//     externalDocs: {
//       url: 'https://swagger.io',
//       description: 'Find more info here'
//     }
//   }
// });
//     fastify.register(require('@fastify/swagger-ui'), {
//       routePrefix: '/documentation',
//       uiConfig: {
//         docExpansion: 'full',
//         deepLinking: false
//       },
//       uiHooks: {
//         onRequest: function (request, reply, next) { next() },
//         preHandler: function (request, reply, next) { next() }
//       },
//       staticCSP: true,
//       transformStaticCSP: (header) => header,
//       transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
//       transformSpecificationClone: true
//     })
// Start the server
const start = async () => {
  try {
    await fastify.listen({port:process.env.PORT || 3030});
    fastify.log.info(`Server is running at http://localhost:${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
