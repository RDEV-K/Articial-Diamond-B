const Sequelize = require('sequelize');
const sequelize = require('../config/database');
const UserModel = require('./user');
const DiamondModel = require('./diamond');
const SkuModel = require('./skus');
const RapPriceModel = require('./rapPrice');

const models = {
  User: UserModel,
  Diamond: DiamondModel,
  Sku: SkuModel,
  RapPrice: RapPriceModel
};

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {...models, sequelize, Sequelize};
