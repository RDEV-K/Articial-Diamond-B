const fs = require('fs');
const path = require('path');

function loadRoutes(fastify, opts, done) {
  const routesPath = path.join(__dirname, 'routes');
  fs.readdirSync(routesPath).forEach(file => {
    const routePath = path.join(routesPath, file);
    if (fs.statSync(routePath).isFile() && file.endsWith('.js')) {
      fastify.register(require(routePath), { prefix: '/api' });
    }
  });
  done();
}

module.exports = loadRoutes;
