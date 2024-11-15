const rapPriceRepository = require('../repositories/rapPriceRepository');

class RapPriceController {
  async getRapPrice(request, reply) {
    try {
      const rapPrices = await rapPriceRepository.findAll();
      return rapPrices;
    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  async createRapPrice(request, reply) {
    try {
      const {
        shape,
        sizeMin,
        sizeMax,
        color,
        clarity,
        pricePerCarat,
        publishDate
      } = request.body

      const rapPrice = await rapPriceRepository.create({ 
        shape,
        sizeMin,
        sizeMax,
        color,
        clarity,
        pricePerCarat,
        publishDate
      });
      return rapPrice;
    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  // Add more controller methods as needed
}

module.exports = new RapPriceController();
