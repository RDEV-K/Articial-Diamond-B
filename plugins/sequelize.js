const fp = require('fastify-plugin');
const sequelize = require('../config/database');
const models = require('../models');

async function sequelizeConnector(fastify, options) {
  try {
    await sequelize.authenticate();
    fastify.log.info('Connection has been established successfully.');
  } catch (error) {
    fastify.log.error('Unable to connect to the database:', error);
  }

  fastify.decorate('sequelize', sequelize);
  fastify.decorate('models', models);
  await sequelize.sync();
}

module.exports = fp(sequelizeConnector);
