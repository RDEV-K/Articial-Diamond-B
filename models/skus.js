const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class Skus extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    // Skus.hasMany(models.Diamond, { foreignKey: 'diamond_detail_id' });
    Skus.belongsTo(models.Diamond, { foreignKey: 'diamond_detail_id' });
    Skus.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

Skus.init({
  websiteStockId: {
    type: DataTypes.STRING
  },
  siteId: {
    type: DataTypes.INTEGER
  },
  userId: {
    type: DataTypes.INTEGER
  },
  userStockNumber: {
    type: DataTypes.STRING
  },
  userStockNumber2: {
    type: DataTypes.STRING
  },
  extraDetails: {
    type: DataTypes.STRING
  },
  diamondDetailId: {
    type: DataTypes.INTEGER
  },
  milky: {
    type: DataTypes.STRING
  },
  memberComment: {
    type: DataTypes.STRING
  },
  comment: {
    type: DataTypes.STRING
  },
  city: {
    type: DataTypes.STRING
  },
  state: {
    type: DataTypes.STRING
  },
  country: {
    type: DataTypes.STRING
  },
  pricePerCarat: {
    type: DataTypes.INTEGER
  },
  totalPrice: {
    type: DataTypes.INTEGER
  },
  imageUrl: {
    type: DataTypes.STRING,
    field: 'image_url',
  },
  certificateUrl: {
    type: DataTypes.STRING,
    field: 'certificate_url',
  },
  videoUrl: {
    type: DataTypes.STRING,
    field: 'video_url',
  }
}, {
  sequelize,
  modelName: 'Skus',
  underscored: true
});

module.exports = Skus;



// select length,width,depth, CONCAT(length,'-',width,'x', depth) from diamonds
// request_detail_id, user_id, diamond_id, pricePerCarat, totalPrice, created_at, updated_at


// CREATE TABLE search_diamond (
//   id INT PRIMARY KEY,
//   request_detail_id INTEGER,
//   user_id INTEGER,
//   diamond_id INTEGER,
//   pricePerCarat INTEGER,
//   totalPrice INTEGER,
//   created_at DATE,
//   updated_at DATE
// );
