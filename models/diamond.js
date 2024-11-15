const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
// const { Sku } = require('.');

class Diamond extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    Diamond.hasOne(models.Sku, { foreignKey: 'diamond_detail_id' });
    Diamond.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

Diamond.init({
  shape: {
    type: DataTypes.STRING
  },
  size: {
    type: DataTypes.DECIMAL(10,2),
  },
  color: {
    type: DataTypes.STRING
  },
  fancyColor: {
    type: DataTypes.STRING
  },
  clarity: {
    type: DataTypes.STRING
  },
  cut: {
    type: DataTypes.STRING
  },
  polish: {
    type: DataTypes.STRING
  },
  symmetry: {
    type: DataTypes.STRING
  },
  tablePercent: {
    type: DataTypes.DECIMAL(6,2),
  },
  depthPercent: {
    type: DataTypes.DECIMAL(6,2),
  },
  certificateNumber: {
    type: DataTypes.STRING,
  },
  lab: {
    type: DataTypes.STRING
  },
  width: {
    type: DataTypes.DECIMAL(10,2),
  },
  length: {
    type: DataTypes.DECIMAL(10,2),
  },
  depth: {
    type: DataTypes.DECIMAL(10,2),
  },
  ratio: {
    type: DataTypes.DECIMAL(5,2),
  },
  flColor: {
    type: DataTypes.STRING
  },
  flIntensity: {
    type: DataTypes.STRING
  },
  culetCondition: {
    type: DataTypes.STRING
  },
  culetSize: {
    type: DataTypes.STRING
  },
  brand: {
    type: DataTypes.STRING
  },
  girdleMin: {
    type: DataTypes.STRING
  },
  girdleMax: {
    type: DataTypes.STRING
  },
  girdlePercent: {
    type: DataTypes.DECIMAL(6,2),
  },
  girdleCondition: {
    type: DataTypes.STRING
  },
  pavilionAngle: {
    type: DataTypes.DECIMAL(6,2)
  },
  pavilionDepth: {
    type: DataTypes.DECIMAL(6,2)
  },
  crownHeight: {
    type: DataTypes.DECIMAL(6,2)
  },
  crownAngle: {
    type: DataTypes.STRING
  },
  shade: {
    type: DataTypes.STRING
  },
  eyeClean: {
    type: DataTypes.STRING
  },
  starLength: {
    type: DataTypes.STRING
  },
  hna: {
    type: DataTypes.STRING
  },
  roughOrigin: {
    type: DataTypes.STRING
  },
  keyToSymbols: {
    type: DataTypes.JSON
  },
  blackInclusionTable: {
    type: DataTypes.STRING
  },
  blackInclusionCrown: {
    type: DataTypes.STRING
  },
  whiteInclusionTable: {
    type: DataTypes.STRING
  },
  whiteInclusionCrown: {
    type: DataTypes.STRING
  },
  openInclusionTable: {
    type: DataTypes.STRING
  },
  openInclusionCrown: {
    type: DataTypes.STRING
  },
  openInclusionPavilion: {
    type: DataTypes.STRING
  },
  openInclusionGirdle: {
    type: DataTypes.STRING
  },
  userId: {
    type: DataTypes.INTEGER
  },
}, {
  sequelize,
  modelName: 'Diamond',
  underscored: true
});

module.exports = Diamond;
