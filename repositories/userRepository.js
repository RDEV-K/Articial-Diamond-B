const BaseRepository = require('./baseRepository');
const { User } = require('../models');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findAllActive() {
    return await User.scope('active').findAll();
  }

  async findAllSellers() {
    return await User.scope('seller').findAll();
  }

  async findAllBuyers() {
    return await User.scope('buyer').findAll();
  }

  async findAllActiveSellers() {
    return await User.scope(['activeSeller']).findAll();
  }

  async findAllActiveBuyers() {
    return await User.scope(['activeBuyer']).findAll();
  }

  async findUser(options = {}) {
    return this.findOne({
      where: { email: options.email },
      raw: true,
    })
  }

}

module.exports = new UserRepository();
