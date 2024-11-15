const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {
  /**
   * Helper method for defining associations.
   * This method is not a part of Sequelize lifecycle.
   * The `models/index` file will call this method automatically.
   */
  static associate(models) {
    // define association here
    // User.hasOne(models.Sku, { foreignKey: 'id' });
    User.hasMany(models.Sku, { foreignKey: 'user_id' });
  }
}

User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'REGULAR',
  },
  level: {
    type: DataTypes.STRING,
  },
  isSeller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isBuyer: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  siteId: {
    type: DataTypes.STRING
  },
  accountID: {
    type: DataTypes.STRING
  },
  companyName: {
    type: DataTypes.STRING
  },
  companyCode: {
    type: DataTypes.STRING
  },
  companyWebsite: {
    type: DataTypes.STRING
  },
  companyLogo: {
    type: DataTypes.STRING
  },
  founded: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.STRING
  },
  telephone: {
    type: DataTypes.STRING
  },
  fax: {
    type: DataTypes.STRING
  },
  contactPrimaryName: {
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
  address1: {
    type: DataTypes.STRING
  },
  address2: {
    type: DataTypes.STRING
  },
  skypeName: {
    type: DataTypes.STRING
  },
  whatsapp: {
    type: DataTypes.STRING
  },
  wechat: {
    type: DataTypes.STRING
  },
  primarySupplierBadge: {
    type: DataTypes.STRING
  },
  ratingPercent: {
    type: DataTypes.STRING
  },
  totalRating: {
    type: DataTypes.STRING
  },
  contactMethod: {
    type: DataTypes.STRING
  },
  relatedAccounts: {
    type: DataTypes.STRING
  },
  profileImage: {
    type: DataTypes.STRING
  }
}, {
  sequelize,
  modelName: 'User',
  underscored: true,
  scopes: {
    active: {
      where: {
        active: true,
      },
    },
    regular: {
      where: {
        type: 'REGULAR',
      },
    },
    admin: {
      where: {
        type: 'ADMIN',
      },
    },
    seller: {
      where: {
        isSeller: true,
      },
    },
    activeSeller: {
      where: {
        isSeller: true,
        active: true,
      },
    },
    buyer: {
      where: {
        isBuyer: true,
      },
    },
    activeBuyer: {
      where: {
        isBuyer: true,
        active: true,
      },
    },
  },
});

module.exports = User;
