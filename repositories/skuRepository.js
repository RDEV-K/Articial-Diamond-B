const BaseRepository = require('./baseRepository');
const { Sku } = require('../models');

class SkuRepository extends BaseRepository {
  constructor() {
    super(Sku);
  }

  async findAll() {
    return await Sku.findAll();
  }

  async updateById(id, data) {
    const record = await this.findById(id);
    if (!record) throw new Error('Record not found');
    return await record.update(data);
  }

  async deleteById(id) {
    const record = await this.findById(id);
    if (!record) throw new Error('Record not found');
    return await record.destroy();
  }

  // Add more user-specific methods if needed
}

module.exports = new SkuRepository();
