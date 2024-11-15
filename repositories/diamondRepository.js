const BaseRepository = require('./baseRepository');
const { Diamond, Sku, User, Sequelize: { Op } } = require('../models');

class DiamondRepository extends BaseRepository {
  constructor() {
    super(Diamond);
  }

  async findAll(options = {}) {
    //specific condition to manage options
    const { where } = options;
    if (!where?.shape) {
      where.shape = {
        [Op.ne]: null
      }
    }
    if (!where?.size) {
      where.size = {
        [Op.ne]: null
      }
    }
    if (!where?.color) {
      where.color = {
        [Op.ne]: null
      }
    }
    if (!where?.clarity) {
      where.clarity = {
        [Op.ne]: null
      }
    }
    
    const data =  await Diamond.findAll(options);
    const count = await Diamond.count();
    const response = {
      count: count,
      data: data,
    }
    console.log("count",count);
    return response
  }

  async getAllDiamonds() {
    const options = {
        offset: 0,
        limit: 50
    }
    return await Diamond.findAll(options);
  }

  async findOne(id) {
    const options = {
      include: [{
        model: Sku,
        required: true,  // Ensures only diamonds with matching diamond_detail entries are included
        include: [{
          model: User,
          // required: true,  // Ensures Skus with matching User entries are included
        }]
      }]
    }
    return await Diamond.findByPk(id, options);
  }

  async findAndCountAll(options = {}, isDistinct = false) {
    const countQuery = {
      where: options.where
    }
      
    if(options.include?.length > 0){
      countQuery.include = options.include.filter(item => item.where || item.required)
    }
    const [count, rows] = await Promise.all([
      isDistinct ? this.model.count({ distinct: true, col: 'id', ...countQuery }) : this.model.count(countQuery),
      this.model.findAll(options)
    ]);
    return { count, rows };
  }

  async deleteById(id) {
    const record = await this.findById(id);
    if (!record) throw new Error('Record not found');
    try{
      return await record.destroy();
    } catch (error) {
        console.error("Error deleting record:", error);
        throw new Error('Could not delete the record');
    }
  }

  async updateById(id, data) {
    const record = await this.findById(id);
    if (!record) throw new Error('Record not found');
    return await record.update(data);
  }

    // async getAllDiamonds() {
  //   let offset = 0;
  //   let limit = 50
  //   const options = {
  //     include: [{
  //       model: Sku,
  //       required: true,  // Ensures only diamonds with matching diamond_detail entries are included
  //       attributes: [
  //         "id",
  //         "city",
  //         "milky",
  //         "pricePerCarat",
  //         "totalPrice",
  //         "userId"
  //       ],
  //       include: [{
  //         model: User,
  //         // required: true,  // Ensures Skus with matching User entries are included
  //       }]
  //     }],
  //     attributes: [
  //       "id",
  //       "shape",
  //       "size",
  //       "color",
  //       "clarity",
  //       "cut",
  //       "polish",
  //       "symmetry",
  //       "flIntensity",
  //       "lab",
  //       "certificateNumber",
  //       "ratio",
  //       "depthPercent",
  //       "tablePercent",
  //       "length",
  //       "width",
  //       "depth",
  //       "keyToSymbols",
  //       "inclusious"
  //     ],
  //       offset,
  //       limit
  //   }
  //   return await Diamond.findAll(options);
  // }

  // Add more user-specific methods if needed
}

module.exports = new DiamondRepository();
