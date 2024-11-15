const rapPriceController = require('../controllers/rapPriceController');

async function routes(fastify, options) {
  fastify.get('/rap-price', rapPriceController.getRapPrice);
  fastify.post('/rap-price', rapPriceController.createRapPrice);

  // Add more routes as needed
}

module.exports = routes;