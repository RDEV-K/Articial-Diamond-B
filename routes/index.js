// routes/index.js
const contants = require('../constants');
async function routes(fastify, options) {
    fastify.get('/', async (request, reply) => {
      return { hello: 'human','message_from':'saturn' };
    });

    fastify.get('/masters', async (request, reply) => {
      reply.send(contants);
    });
  }
  
  module.exports = routes;
  