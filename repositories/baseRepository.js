class BaseRepository {
    constructor(model) {
      this.model = model;
    }
  
    async findAll() {
      return await this.model.findAll();
    }
  
    async findById(id) {
      return await this.model.findByPk(id);
    }
  
    async create(data) {
      return await this.model.create(data);
    }
  
    async update(id, data) {
      const record = await this.findById(id);
      if (!record) throw new Error('Record not found');
      return await record.update(data);
    }
  
    async delete(id) {
      const record = await this.findById(id);
      if (!record) throw new Error('Record not found');
      return await record.destroy();
    }

    async findOne(options = {}) {
      return await this.model.findOne(options);
    }
    
  }
  
  module.exports = BaseRepository;
  