const diamondRepository = require('../repositories/diamondRepository');
const skuRepository = require('../repositories/skuRepository');
const { Diamond, User, Sequelize: { Op } } = require('../models');
const { Sequelize } = require('sequelize');
const Skus = require('../models/skus');
const Excel = require('exceljs');
const { convertStringToArray, convertNumberToSort } = require('../utils/operations');
const { includes } = require('lodash');

class DiamondController {
  async getAllDiamonds(request, reply) {
    try {
      const diamonds = await diamondRepository.getAllDiamonds();
      return diamonds;
    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  async searchDiamonds(request, reply) {
    try {
      const userId = request.params.id;
      const query = JSON.parse(request.query.filter);
      const where = {};
      let limit = 50;
      let offset = 0;
      const {
        shapes,
        sizes,
        colors,
        clarities,
        cuts,
        polishes,
        symmetries,
        flIntensity,
        milky = [],
        shade = [],
        labs,
        locations = [],
        openInclusionTables,
        openInclusionCrowns,
        whiteInclusionTables,
        whiteInclusionCrowns,
        blackInclusionTables,
        blackInclusionCrowns,
        keyToSymbols,
        eyeClean,
        otherFilters,
        certificateNumber,
        pricePerCarat,
        totalPrice,
        userName,
        sort
      } = query?.where?.data;

      const skuWhere = {};
      const userWhere = {};
      let order = [];

      if (userId) {
        skuWhere.userId = {
          [Op.eq]: userId
        }
      }

      if (query.limit) {
        limit = query.limit
      }
      if (query.skip) {
        offset = query.skip
      }

      if (shapes.length > 0) {
        where.shape = {
          [Op.in]: shapes
        }
      }
      if (sizes.length > 0) {
        where.size = {
            [Op.or]: []
        };

        sizes.forEach((size) => {
            const sizeParts = size.split('-');

            // Check if the size is a range
            if (sizeParts.length === 2) {
                const start = Number(sizeParts[0]);
                const end = Number(sizeParts[1]);

                // Validate that both start and end are numbers
                if (!isNaN(start) && !isNaN(end)) {
                    where.size[Op.or].push({
                        [Op.between]: [start, end]
                    });
                } else {
                    console.error('Invalid size range:', size);
                }
            } else {
                const singleSize = Number(size);

                // Validate that singleSize is a number
                if (!isNaN(singleSize)) {
                    where.size[Op.or].push({
                        [Op.eq]: singleSize
                    });
                } else {
                    console.error('Invalid size:', size);
                }
            }
        });
    }
      if (colors.length > 0) {
        where.color = {
          [Op.in]: colors
        }
      }
      if (clarities.length > 0) {
        where.clarity = {
          [Op.in]: clarities
        }
      }
      if (cuts.length > 0) {
        where.cut = {
          [Op.in]: cuts
        }
      }
      if (polishes.length > 0) {
        where.polish = {
          [Op.in]: polishes
        }
      }
      if (symmetries.length > 0) {
        where.symmetry = {
          [Op.in]: symmetries
        }
      }
      if (flIntensity.length > 0) {
        where.flIntensity = {
          [Op.in]: flIntensity
        }
      }
      if (labs.length > 0) {
        where.lab = {
          [Op.in]: labs
        }
      }
      if (locations.length > 0) {
        skuWhere.country = {
          [Op.in]: locations
        }
      }
      if (certificateNumber) {
        where.certificateNumber = {
          [Op.like]: `%${certificateNumber}%`
        }
      }
      if (pricePerCarat?.from && pricePerCarat?.to) {
        skuWhere.pricePerCarat = {
          [Op.gte]: pricePerCarat.from,
          [Op.lte]: pricePerCarat.to,
        }
      }
      if (totalPrice?.from && totalPrice?.to) {
        skuWhere.totalPrice = {
          [Op.gte]: totalPrice.from,
          [Op.lte]: totalPrice.to,
        }
      }
      if (openInclusionTables !== undefined) {
        where.openInclusionTable = openInclusionTables ? { [Op.ne]: null } : { [Op.eq]: null };
      }
      if (openInclusionCrowns !== undefined) {
        where.openInclusionCrown = openInclusionCrowns ? { [Op.ne]: null } : { [Op.eq]: null };
      }
      if (whiteInclusionTables !== undefined) {
        where.whiteInclusionTable = whiteInclusionTables ? { [Op.ne]: null } : { [Op.eq]: null };
      }
      if (whiteInclusionCrowns !== undefined) {
        where.whiteInclusionCrown = whiteInclusionCrowns ? { [Op.ne]: null } : { [Op.eq]: null };
      }
      if (blackInclusionTables !== undefined) {
        where.blackInclusionTable = blackInclusionTables ? { [Op.ne]: null } : { [Op.eq]: null };
      }
      if (blackInclusionCrowns !== undefined) {
        where.blackInclusionCrown = blackInclusionCrowns ? { [Op.ne]: null } : { [Op.eq]: null };
      }
      if (milky.length > 0) {
        skuWhere.milky = {
          [Op.in]: milky
        }
      }
      if (shade.length > 0) {
        where.shade = {
          [Op.in]: shade
        }
      }
      if (keyToSymbols.length > 0) {
        where[Op.and] = keyToSymbols.map(inclusion => Sequelize.literal(`JSON_CONTAINS(\`Diamond\`.\`key_to_symbols\`, '["${inclusion}"]')`));
      }
      if (eyeClean !== undefined) {
        where.eyeClean = eyeClean ? { [Op.ne]: null } : { [Op.eq]: null };
      }
      if (otherFilters.tablePercentFrom && otherFilters.tablePercentTo) {
        where.tablePercent = {
          [Op.gte]: otherFilters.tablePercentFrom,
          [Op.lte]: otherFilters.tablePercentTo,
        }
      }
      if (otherFilters.depthPercentFrom && otherFilters.depthPercentTo) {
        where.depthPercent = {
          [Op.gte]: otherFilters.depthPercentFrom,
          [Op.lte]: otherFilters.depthPercentTo,
        }
      }
      if (otherFilters.gridlePercentFrom && otherFilters.gridlePercentTo) {
        where.gridlePercent = {
          [Op.gte]: otherFilters.gridlePercentFrom,
          [Op.lte]: otherFilters.gridlePercentTo,
        }
      }
      if (otherFilters.crownHeightFrom && otherFilters.crownHeightTo) {
        where.crownHeight = {
          [Op.gte]: otherFilters.crownHeightFrom,
          [Op.lte]: otherFilters.crownHeightTo,
        }
      }
      if (otherFilters.crownAngleFrom && otherFilters.crownAngleTo) {
        where.crownAngle = {
          [Op.gte]: otherFilters.crownAngleFrom,
          [Op.lte]: otherFilters.crownAngleTo,
        }
      }
      if (otherFilters.pavilionHeightFrom && otherFilters.pavilionHeightTo) {
        where.pavilionHeight = {
          [Op.gte]: otherFilters.pavilionHeightFrom,
          [Op.lte]: otherFilters.pavilionHeightTo,
        }
      }
      if (otherFilters.pavilionAngleFrom && otherFilters.pavilionAngleTo) {
        where.pavilionAngle = {
          [Op.gte]: otherFilters.pavilionAngleFrom,
          [Op.lte]: otherFilters.pavilionAngleTo,
        }
      }
      if (otherFilters.lengthFrom && otherFilters.lengthTo) {
        where.length = {
          [Op.gte]: otherFilters.lengthFrom,
          [Op.lte]: otherFilters.lengthTo,
        }
      }
      if (otherFilters.widthFrom && otherFilters.widthTo) {
        where.width = {
          [Op.gte]: otherFilters.widthFrom,
          [Op.lte]: otherFilters.widthTo,
        }
      }
      if (otherFilters.depthFrom && otherFilters.depthTo) {
        where.depth = {
          [Op.gte]: otherFilters.depthFrom,
          [Op.lte]: otherFilters.depthTo,
        }
      }
      if (userName) {
        userWhere.username = {
          [Op.like]: `%${userName}%`
        }
      }

      if (sort?.username) {
        order.push([{ model: Skus }, { model: User }, 'username', convertNumberToSort(sort.username)]);
      }
      if (sort?.location) {
        order.push([{ model: Skus }, 'country', `${convertNumberToSort(sort.location)}`]);
      }
      if (sort?.shape) {
        order.push(['shape', `${convertNumberToSort(sort.shape)}`]);
      }
      // if (sort?.size) {
        order.push(['size', `${convertNumberToSort(1)}`]);
      // }
      if (sort?.color) {
        order.push(['color', `${convertNumberToSort(sort.color)}`]);
      }
      if (sort?.clarity) {
        order.push(
          Sequelize.literal(`FIELD(clarity, 'FL', 'IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'SI3', 'I1', 'I2', 'I3') ${convertNumberToSort(sort.clarity)}`)
        );
      }
      if (sort?.cut) {
        order.push(
          Sequelize.literal(`FIELD(cut, 'ID', 'EX', 'VG', 'G', 'F', 'P', 'None') ${convertNumberToSort(sort.cut)}`)
        );
      }
      if (sort?.polish) {
        order.push(
          Sequelize.literal(`FIELD(polish, 'ID', 'EX', 'VG', 'G', 'F', 'P', 'None') ${convertNumberToSort(sort.polish)}`)
        );
      }
      if (sort?.symmetry) {
        order.push(
          Sequelize.literal(`FIELD(symmetry, 'ID', 'EX', 'VG', 'G', 'F', 'P', 'None') ${convertNumberToSort(sort.symmetry)}`)
        );
      }
      if (sort?.flIntensity) {
        order.push(
          Sequelize.literal(`FIELD(flIntensity, 'N', 'VSL', 'SL', 'F', 'M', 'ST', 'VST') ${convertNumberToSort(sort.flIntensity)}`)
        );
      }
      if (sort?.lab) {
        order.push(['lab', `${convertNumberToSort(sort.lab)}`]);
      }
      if (sort?.certificateNumber) {
        order.push(['certificateNumber', `${convertNumberToSort(sort.certificateNumber)}`]);
      }
      if (sort?.pricePerCarat) {
        order.push([{ model: Skus }, 'pricePerCarat', `${convertNumberToSort(sort.pricePerCarat)}`]);
      }
      if (sort?.totalPrice) {
        order.push([{ model: Skus }, 'totalPrice', `${convertNumberToSort(sort.totalPrice)}`]);
      }


      const diamonds = await diamondRepository.findAndCountAll({
        where,
        include: [
          {
            model: Skus,
            where: Object.keys(skuWhere).length ? skuWhere : undefined,
            required: true,
            include: [
              {
                model: User,
                where: Object.keys(userWhere).length ? userWhere : undefined,
                required: true
              }
            ]
          },
        ],
        order,
        offset,
        limit
      });
      if (request.user && request.user.id) {
        const response = {
          data: diamonds.rows,
          count: diamonds.count,
        };
        return response;
      } else {
        const diamondList =
          diamonds.rows &&
          diamonds.rows?.map((diamond) => {
            try {
              return {
                Sku: {
                  city: diamond?.Sku?.city,
                  pricePerCarat: diamond?.Sku?.pricePerCarat,
                  totalPrice: diamond?.Sku?.totalPrice,
                },
                shape: diamond.shape,
                size: diamond.size,
                color: diamond.color,
                clarity: diamond.clarity,
                cut: diamond.cut,
                polish: diamond.polish,
                symmetry: diamond.symmetry,
                flIntensity: diamond.flIntensity,
                lab: diamond.lab,
                id: diamond.id
              };
            } catch (e) {
              console.log(e);
            }
          });
        const response = {
          data: diamondList,
          count: diamonds.count,
        };
        return response;
      }

    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  async getDiamondById(request, reply) {
    try {
      const diamonds = await diamondRepository.findOne(request.params.id);
      return diamonds;
    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  async addDiamond(request, reply) {
    try {
      const {
        type,
        shape,
        size,
        color,
        fancyColor,
        clarity,
        cut,
        polish,
        symmetry,
        tablePercent,
        depthPercent,
        certificateNumber,
        lab,
        city,
        country,
        width,
        length,
        depth,
        ratio,
        flColor,
        flIntensity,
        culetCondition,
        culetSize,
        brand,
        girdleMin,
        girdleMax,
        girdlePercent,
        girdleCondition,
        pavilionAngle,
        pavilionDepth,
        crownHeight,
        crownAngle,
        shade,
        eyeClean,
        starLength,
        hna,
        roughOrigin,
        keyToSymbols,
        blackInclusionTable,
        blackInclusionCrown,
        whiteInclusionTable,
        whiteInclusionCrown,
        openInclusionTable,
        openInclusionCrown,
        openInclusionPavilion,
        openInclusionGirdle,
        userStockNumber,
        milky,
        imageUrl,
        certificateUrl,
        videoUrl,
        pricePerCarat,
        totalPrice
      } = request.body
      const diamond = await diamondRepository.create({
        shape,
        type,
        size,
        color,
        fancyColor,
        clarity,
        cut,
        polish,
        symmetry,
        tablePercent,
        depthPercent,
        certificateNumber,
        lab,
        width,
        length,
        depth,
        ratio,
        flColor,
        flIntensity,
        culetCondition,
        culetSize,
        brand,
        girdleMin,
        girdleMax,
        girdlePercent,
        girdleCondition,
        pavilionAngle,
        pavilionDepth,
        crownHeight,
        crownAngle,
        shade,
        eyeClean,
        starLength,
        hna,
        roughOrigin,
        keyToSymbols,
        blackInclusionTable,
        blackInclusionCrown,
        whiteInclusionTable,
        whiteInclusionCrown,
        openInclusionTable,
        openInclusionCrown,
        openInclusionPavilion,
        openInclusionGirdle
      });
      const sku = await skuRepository.create({
        diamondDetailId: diamond.id,
        userStockNumber,
        milky,
        imageUrl,
        certificateUrl,
        videoUrl,
        pricePerCarat,
        totalPrice,
        city,
        country,
        userId: request?.user?.id
      });
      const response = {
        diamond: diamond,
        sku: sku
      }
      return response;
    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  async deleteDiamond(request, reply) {
    try {
      const idsToDelete = request.body.ids || [];
      await Promise.all(idsToDelete.map(async (data) => {
        const diamond = await diamondRepository.findOne(data); 
        if (diamond?.dataValues?.id === data) {
          const sku = await skuRepository.findOne({ where: { diamondDetailId: data } });
          if (sku) {
            await skuRepository.deleteById(sku?.dataValues?.id);
            await diamondRepository.deleteById(data);
          }
        } else {
          reply.code(500).send("You don't have permission to delete this record.");
        }
      }));
      return reply.send({ status: true, message: "Record Deleted successfull." });
    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  async editDiamondDetail(request, reply) {
    try {
      const {
        type,
        shape,
        size,
        color,
        fancyColor,
        clarity,
        cut,
        polish,
        symmetry,
        tablePercent,
        depthPercent,
        certificateNumber,
        lab,
        width,
        length,
        depth,
        ratio,
        flColor,
        flIntensity,
        culetCondition,
        culetSize,
        brand,
        girdleMin,
        girdleMax,
        girdlePercent,
        girdleCondition,
        pavilionAngle,
        pavilionDepth,
        crownHeight,
        crownAngle,
        shade,
        eyeClean,
        starLength,
        hna,
        roughOrigin,
        keyToSymbols,
        inclusious,
        milky,
        country,
        pricePerCarat,
        totalPrice
      } = request?.body

      const diamond = await diamondRepository.updateById(request.params.id, {
        shape,
        type,
        size,
        color,
        fancyColor,
        clarity,
        cut,
        polish,
        symmetry,
        tablePercent,
        depthPercent,
        certificateNumber,
        lab,
        width,
        length,
        depth,
        ratio,
        flColor,
        flIntensity,
        culetCondition,
        culetSize,
        brand,
        girdleMin,
        girdleMax,
        girdlePercent,
        girdleCondition,
        pavilionAngle,
        pavilionDepth,
        crownHeight,
        crownAngle,
        shade,
        eyeClean,
        starLength,
        hna,
        roughOrigin,
        keyToSymbols,
        inclusious
      });

      const sku = await skuRepository.findOne({ where: { diamondDetailId: request.params.id } })
      const skuData = await skuRepository.updateById(sku.id, {
        milky,
        country,
        pricePerCarat,
        totalPrice,
      })
      return diamond;
    } catch (err) {
      reply.code(500).send(err.message);
    }
  }

  async uploadExcel(request, reply) {
    try {
      const transaction = await request.server.sequelize.transaction();

      if (!request.body || !request.body.file) {
        return reply.status(400).json({ error: 'No file uploaded' });
      }

      const file = request.body.file;
      const workbook = new Excel.Workbook();
      await workbook.xlsx.load(file._buf);

      const worksheet = workbook.worksheets[0];

      const headers = [];
      worksheet.getRow(1).eachCell(cell => {
        const header = cell.value.toLowerCase().replace(/ /g, '_');
        headers.push(header);
      });

      const dataRows = [];
      for (let i = 2; i <= worksheet.rowCount; i++) {
        const rowData = {};
        worksheet.getRow(i).eachCell((cell, colNumber) => {
          rowData[headers[colNumber - 1]] = cell.value;
        });
        if (Object.keys(rowData).length > 0) {
          dataRows.push(rowData);
        }
      }
      try {
        for (const row of dataRows) {
          let sku;
          let diamondData;
          if (row.user_stock_number) {
            sku = await Skus.findOne({
              where: { userStockNumber: row.user_stock_number, userId: request?.user?.id }
            });
            if (sku) {
              diamondData = await diamondRepository.findOne(sku.diamondDetailId);

              await diamondData.update({
                certificateNumber: row.certificate_number,
                lab: row.lab,
                shape: row.shape,
                size: row.size,
                color: row.color,
                fancyColor: row.fancy_color,
                clarity: row.clarity,
                cut: row.cut,
                polish: row.polish,
                symmetry: row.symmetry,
                tablePercent: row.table_percent,
                depthPercent: row.depth_percent,
                width: row.width,
                length: row.length,
                depth: row.depth,
                ratio: row.ratio,
                flColor: row.fl_color,
                flIntensity: row.fl_intensity,
                culetCondition: row.culet_condition,
                culetSize: row.culet_size,
                girdleMin: row.girdle_min,
                girdleMax: row.girdle_max,
                girdlePercent: row.girdle_percent,
                girdleCondition: row.girdle_condition,
                pavilionAngle: row.pavilion_angle,
                pavilionDepth: row.pavilion_depth,
                crownHeight: row.crown_height,
                crownAngle: row.crown_angle,
                shade: row.shade,
                eyeClean: row.eye_clean,
                starLength: row.star_length,
                hna: row.hna,
                roughOrigin: row.rough_origin,
                keyToSymbols: convertStringToArray(row.key_to_symbols),
                blackInclusionTable: row.black_inclusion_table,
                blackInclusionCrown: row.black_inclusion_crown,
                whiteInclusionTable: row.white_inclusion_table,
                whiteInclusionCrown: row.white_inclusion_crown,
                openInclusionTable: row.open_inclusion_table,
                openInclusionCrown: row.open_inclusion_crown,
                openInclusionPavilion: row.open_inclusion_pavilion,
                openInclusionGirdle: row.open_inclusion_girdle
              }, { transaction });

              await sku.update({
                userStockNumber: row.user_stock_number,
                userStockNumber2: row.user_stock_number2,
                milky: row.milky,
                comment: row.comment,
                city: row.city,
                state: row.state,
                country: row.country,
                imageUrl: row.image_url,
                certificateUrl: row.certificate_url,
                videoUrl: row.video_url,
                pricePerCarat: row.price_per_carat,
                totalPrice: row.total_price
              }, { transaction });
            }
          } else {
            reply.code(400).send('User Stock Number is not exist.');
          }

          if (!sku) {
            if (row.certificate_number && row.lab) {
              diamondData = await Diamond.findOne({
                where: { certificateNumber: row.certificate_number, lab: row.lab }
              });
              if (diamondData) {
                sku = await Skus.findOne({
                  where: { diamondDetailId: diamondData.id, userId: request?.user?.id },
                  order: [['createdAt', 'DESC']],
                  limit: 1
                });
                if (sku) {
                  await diamondData.update({
                    certificateNumber: row.certificate_number,
                    lab: row.lab,
                    shape: row.shape,
                    size: row.size,
                    color: row.color,
                    fancyColor: row.fancy_color,
                    clarity: row.clarity,
                    cut: row.cut,
                    polish: row.polish,
                    symmetry: row.symmetry,
                    tablePercent: row.table_percent,
                    depthPercent: row.depth_percent,
                    width: row.width,
                    length: row.length,
                    depth: row.depth,
                    ratio: row.ratio,
                    flColor: row.fl_color,
                    flIntensity: row.fl_intensity,
                    culetCondition: row.culet_condition,
                    culetSize: row.culet_size,
                    girdleMin: row.girdle_min,
                    girdleMax: row.girdle_max,
                    girdlePercent: row.girdle_percent,
                    girdleCondition: row.girdle_condition,
                    pavilionAngle: row.pavilion_angle,
                    pavilionDepth: row.pavilion_depth,
                    crownHeight: row.crown_height,
                    crownAngle: row.crown_angle,
                    shade: row.shade,
                    eyeClean: row.eye_clean,
                    starLength: row.star_length,
                    hna: row.hna,
                    roughOrigin: row.rough_origin,
                    keyToSymbols: convertStringToArray(row.key_to_symbols),
                    blackInclusionTable: row.black_inclusion_table,
                    blackInclusionCrown: row.black_inclusion_crown,
                    whiteInclusionTable: row.white_inclusion_table,
                    whiteInclusionCrown: row.white_inclusion_crown,
                    openInclusionTable: row.open_inclusion_table,
                    openInclusionCrown: row.open_inclusion_crown,
                    openInclusionPavilion: row.open_inclusion_pavilion,
                    openInclusionGirdle: row.open_inclusion_girdle
                  }, { transaction });

                  await sku.update({
                    userStockNumber: row.user_stock_number,
                    userStockNumber2: row.user_stock_number2,
                    milky: row.milky,
                    comment: row.comment,
                    city: row.city,
                    state: row.state,
                    country: row.country,
                    imageUrl: row.image_url,
                    certificateUrl: row.certificate_url,
                    videoUrl: row.video_url,
                    pricePerCarat: row.price_per_carat,
                    totalPrice: row.total_price
                  }, { transaction });
                }
                if (!sku) {
                  await Skus.create({
                    diamondDetailId: diamondData.id,
                    userStockNumber: row.user_stock_number,
                    userStockNumber2: row.user_stock_number2,
                    milky: row.milky,
                    comment: row.comment,
                    city: row.city,
                    state: row.state,
                    country: row.country,
                    imageUrl: row.image_url,
                    certificateUrl: row.certificate_url,
                    videoUrl: row.video_url,
                    pricePerCarat: row.price_per_carat,
                    totalPrice: row.total_price,
                    userId: request?.user?.id
                  }, { transaction });
                  // sku = await Skus.findOne({
                  //   where: { diamondDetailId: diamondData.id }
                  // });
                  // await sku.update({
                  //   userStockNumber: row.user_stock_number,
                  //   userStockNumber2: row.user_stock_number2,
                  //   milky: row.milky,
                  //   comment: row.comment,
                  //   city: row.city,
                  //   state: row.state,
                  //   country: row.country,
                  //   imageUrl: row.image_url,
                  //   certificateUrl: row.certificate_url,
                  //   videoUrl: row.video_url,
                  //   pricePerCarat: row.price_per_carat,
                  //   totalPrice: row.total_price
                  // }, { transaction });
                }
              } else {
                diamondData = await Diamond.create({
                  certificateNumber: row.certificate_number,
                  lab: row.lab,
                  shape: row.shape,
                  size: row.size,
                  color: row.color,
                  fancyColor: row.fancy_color,
                  clarity: row.clarity,
                  cut: row.cut,
                  polish: row.polish,
                  symmetry: row.symmetry,
                  tablePercent: row.table_percent,
                  depthPercent: row.depth_percent,
                  width: row.width,
                  length: row.length,
                  depth: row.depth,
                  ratio: row.ratio,
                  flColor: row.fl_color,
                  flIntensity: row.fl_intensity,
                  culetCondition: row.culet_condition,
                  culetSize: row.culet_size,
                  girdleMin: row.girdle_min,
                  girdleMax: row.girdle_max,
                  girdlePercent: row.girdle_percent,
                  girdleCondition: row.girdle_condition,
                  pavilionAngle: row.pavilion_angle,
                  pavilionDepth: row.pavilion_depth,
                  crownHeight: row.crown_height,
                  crownAngle: row.crown_angle,
                  shade: row.shade,
                  eyeClean: row.eye_clean,
                  starLength: row.star_length,
                  hna: row.hna,
                  roughOrigin: row.rough_origin,
                  keyToSymbols: convertStringToArray(row.key_to_symbols),
                  blackInclusionTable: row.black_inclusion_table,
                  blackInclusionCrown: row.black_inclusion_crown,
                  whiteInclusionTable: row.white_inclusion_table,
                  whiteInclusionCrown: row.white_inclusion_crown,
                  openInclusionTable: row.open_inclusion_table,
                  openInclusionCrown: row.open_inclusion_crown,
                  openInclusionPavilion: row.open_inclusion_pavilion,
                  openInclusionGirdle: row.open_inclusion_girdle
                }, { transaction });

                  await Skus.create({
                  diamondDetailId: diamondData.id,
                  userStockNumber: row.user_stock_number,
                  userStockNumber2: row.user_stock_number2,
                  milky: row.milky,
                  comment: row.comment,
                  city: row.city,
                  state: row.state,
                  country: row.country,
                  imageUrl: row.image_url,
                  certificateUrl: row.certificate_url,
                  videoUrl: row.video_url,
                  pricePerCarat: row.price_per_carat,
                  totalPrice: row.total_price,
                  userId: request?.user?.id
                }, { transaction });
              }
            }
          }

          // if (diamondData || sku) {
          //   if (sku) {
          //     diamondData = await diamondRepository.findOne(sku.diamondDetailId);
          //   }
          //   await diamondData.update({
          //     certificateNumber: row.certificate_number,
          //     lab: row.lab,
          //     shape: row.shape,
          //     size: row.size,
          //     color: row.color,
          //     fancyColor: row.fancy_color,
          //     clarity: row.clarity,
          //     cut: row.cut,
          //     polish: row.polish,
          //     symmetry: row.symmetry,
          //     tablePercent: row.table_percent,
          //     depthPercent: row.depth_percent,
          //     width: row.width,
          //     length: row.length,
          //     depth: row.depth,
          //     ratio: row.ratio,
          //     flColor: row.fl_color,
          //     flIntensity: row.fl_intensity,
          //     culetCondition: row.culet_condition,
          //     culetSize: row.culet_size,
          //     girdleMin: row.girdle_min,
          //     girdleMax: row.girdle_max,
          //     girdlePercent: row.girdle_percent,
          //     girdleCondition: row.girdle_condition,
          //     pavilionAngle: row.pavilion_angle,
          //     pavilionDepth: row.pavilion_depth,
          //     crownHeight: row.crown_height,
          //     crownAngle: row.crown_angle,
          //     shade: row.shade,
          //     eyeClean: row.eye_clean,
          //     starLength: row.star_length,
          //     hna: row.hna,
          //     roughOrigin: row.rough_origin,
          //     keyToSymbols: convertStringToArray(row.key_to_symbols),
          //     blackInclusionTable: row.black_inclusion_table,
          //     blackInclusionCrown: row.black_inclusion_crown,
          //     whiteInclusionTable: row.white_inclusion_table,
          //     whiteInclusionCrown: row.white_inclusion_crown,
          //     openInclusionTable: row.open_inclusion_table,
          //     openInclusionCrown: row.open_inclusion_crown,
          //     openInclusionPavilion: row.open_inclusion_pavilion,
          //     openInclusionGirdle: row.open_inclusion_girdle
          //   }, { transaction });
          // } else {
          //   diamondData = await Diamond.create({
          //     certificateNumber: row.certificate_number,
          //     lab: row.lab,
          //     shape: row.shape,
          //     size: row.size,
          //     color: row.color,
          //     fancyColor: row.fancy_color,
          //     clarity: row.clarity,
          //     cut: row.cut,
          //     polish: row.polish,
          //     symmetry: row.symmetry,
          //     tablePercent: row.table_percent,
          //     depthPercent: row.depth_percent,
          //     width: row.width,
          //     length: row.length,
          //     depth: row.depth,
          //     ratio: row.ratio,
          //     flColor: row.fl_color,
          //     flIntensity: row.fl_intensity,
          //     culetCondition: row.culet_condition,
          //     culetSize: row.culet_size,
          //     girdleMin: row.girdle_min,
          //     girdleMax: row.girdle_max,
          //     girdlePercent: row.girdle_percent,
          //     girdleCondition: row.girdle_condition,
          //     pavilionAngle: row.pavilion_angle,
          //     pavilionDepth: row.pavilion_depth,
          //     crownHeight: row.crown_height,
          //     crownAngle: row.crown_angle,
          //     shade: row.shade,
          //     eyeClean: row.eye_clean,
          //     starLength: row.star_length,
          //     hna: row.hna,
          //     roughOrigin: row.rough_origin,
          //     keyToSymbols: convertStringToArray(row.key_to_symbols),
          //     blackInclusionTable: row.black_inclusion_table,
          //     blackInclusionCrown: row.black_inclusion_crown,
          //     whiteInclusionTable: row.white_inclusion_table,
          //     whiteInclusionCrown: row.white_inclusion_crown,
          //     openInclusionTable: row.open_inclusion_table,
          //     openInclusionCrown: row.open_inclusion_crown,
          //     openInclusionPavilion: row.open_inclusion_pavilion,
          //     openInclusionGirdle: row.open_inclusion_girdle,
          //     userId: request?.user?.id
          //   }, { transaction });
          // }

          // if (!sku) {
          //   sku = await Skus.findOne({
          //     where: { diamondDetailId: diamondData.id }
          //   });
          // }

          // if (sku) {
          //   await sku.update({
          //     userStockNumber: row.user_stock_number,
          //     userStockNumber2: row.user_stock_number2,
          //     milky: row.milky,
          //     comment: row.comment,
          //     city: row.city,
          //     state: row.state,
          //     country: row.country,
          //     imageUrl: row.image_url,
          //     certificateUrl: row.certificate_url,
          //     videoUrl: row.video_url,
          //     pricePerCarat: row.price_per_carat,
          //     totalPrice: row.total_price
          //   }, { transaction });
          // } else {
          //   await Skus.create({
          //     diamondDetailId: diamondData.id,
          //     userStockNumber: row.user_stock_number,
          //     userStockNumber2: row.user_stock_number2,
          //     milky: row.milky,
          //     comment: row.comment,
          //     city: row.city,
          //     state: row.state,
          //     country: row.country,
          //     imageUrl: row.image_url,
          //     certificateUrl: row.certificate_url,
          //     videoUrl: row.video_url,
          //     pricePerCarat: row.price_per_carat,
          //     totalPrice: row.total_price,
          //     userId: request?.user?.id
          //   }, { transaction });
          // }
        }

        await transaction.commit();

        return reply.code(200).send({ success: true, message: 'File processed successfully.' });
      } catch (error) {
        await transaction.rollback();
        console.error(error);
        return reply.code(500).send('Error inserting data into database.');
      }

    } catch (err) {
      console.error(err);
      reply.code(500).send('Error processing file.');
    }
  }

}

module.exports = new DiamondController();
