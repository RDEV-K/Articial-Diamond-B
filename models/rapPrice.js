const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class RapPrice extends Model {}

RapPrice.init({
  shape: {
    type: DataTypes.STRING
  },
  sizeMin: {
    type: DataTypes.INTEGER
  },
  sizeMax: {
    type: DataTypes.INTEGER
  },
  color: {
    type: DataTypes.STRING
  },
  clarity: {
    type: DataTypes.STRING
  },
  pricePerCarat: {
    type: DataTypes.STRING
  },
  publishDate: {
    type: DataTypes.INTEGER
  }
}, {
  sequelize,
  modelName: 'RapPrice',
  underscored: true,
  scopes: {
    active: {
      where: {
        active: true,
      },
    },
  },
});

module.exports = RapPrice;
