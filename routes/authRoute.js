const userController = require('../controllers/userController');

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

  fastify.get('/auth/google', userController.googleLogin)
  fastify.get('/auth/google/callback', userController.googleCallback)

  // Add more routes as needed
 }

module.exports = routes;