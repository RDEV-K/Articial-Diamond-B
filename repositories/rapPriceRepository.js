const BaseRepository = require('./baseRepository');
const { RapPrice } = require('../models');

class RapPriceRepository extends BaseRepository {
  constructor() {
    super(RapPrice);
  }

  async findAll() {
    return await RapPrice.findAll();
  }

  // Add more user-specific methods if needed
}

module.exports = new RapPriceRepository();
