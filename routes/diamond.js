const diamondController = require('../controllers/diamondController');

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

  fastify.get('/diamond', diamondController.getAllDiamonds);
  fastify.post('/diamond', { preValidation: [fastify.authenticate] }, diamondController.addDiamond);
  fastify.get('/diamond/public/search', diamondController.searchDiamonds);
  fastify.get('/diamond/search',{ preValidation: [fastify.authenticate] }, diamondController.searchDiamonds);
  fastify.get('/diamond/:id', { preValidation: [fastify.authenticate] }, diamondController.getDiamondById);
  fastify.get('/inventory/diamond/:id', { preValidation: [fastify.authenticate] }, diamondController.searchDiamonds);
  fastify.post('/diamond/delete', { preValidation: [fastify.authenticate] }, diamondController.deleteDiamond);
  fastify.patch('/diamond/:id', { preValidation: [fastify.authenticate] }, diamondController.editDiamondDetail);
  fastify.post('/diamond/upload' ,{ preValidation: [fastify.authenticate] }, diamondController.uploadExcel);


  // Add more routes as needed
}

module.exports = routes;