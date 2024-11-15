const userController = require('../controllers/userController');
const fastify = require('fastify')();
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

  fastify.get('/users', { preValidation: [fastify.authenticate] }, userController.getAllUsers);
  fastify.get('/users/active', userController.getAllActiveUsers);
  fastify.get('/users/sellers', userController.getAllSellers);
  fastify.get('/users/buyers', userController.getAllBuyers);
  fastify.get('/users/sellers/active', userController.getAllActiveSellers);
  fastify.get('/users/buyers/active', userController.getAllActiveBuyers);
  fastify.post('/users', userController.createUser);
  fastify.post('/login', userController.userLogin);
  fastify.post('/logout/:id', userController.userLogout);
  fastify.patch('/update-user/:id', { preValidation: [fastify.authenticate] }, userController.updateUser);

  // Add more routes as needed
}

module.exports = routes;
