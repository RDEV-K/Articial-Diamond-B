const skuRepository = require('../repositories/skuRepository');

class SkuController {
  async getAllSkus(request, reply) {
    try {
      const skus = await skuRepository.findAll();
      return skus;
    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  async createSku(request, reply) {
    try {
      const {
        websiteStockId,
        siteId,
        vendorStockNumber,
        vendorStockNumber2,
        extraDetails,
        diamondDetailId,
        milky,
        memberComment,
        comment,
        city,
        state,
        country,
        imageUrl,
        certificateUrl,
        videoUrl
      } = request.body

      const sku = await skuRepository.create({
        websiteStockId,
        siteId,
        vendorId: request.user.id,
        vendorStockNumber,
        vendorStockNumber2,
        extraDetails,
        diamondDetailId,
        milky,
        memberComment,
        comment,
        city,
        state,
        country,
        imageUrl,
        certificateUrl,
        videoUrl
      });
      return sku;
    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  // Add more controller methods as needed
}

module.exports = new SkuController();
