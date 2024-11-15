const skuController = require('../controllers/skuController');

async function routes(fastify, options) {
  // Register the fastify-jwt plugin
  fastify.register(require('fastify-jwt'), {
    secret: 'supersecretkey' // Replace with your actual secret key
  });

  // Decorate fastify instance with an authentication method
  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  fastify.get('/sku', { preValidation: [fastify.authenticate] }, skuController.getAllSkus);
  fastify.post('/sku', { preValidation: [fastify.authenticate] }, skuController.createSku);
 
  // Add more routes as needed
}

module.exports = routes;