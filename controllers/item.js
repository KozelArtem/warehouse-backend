const Promise = require('bluebird');

const {
  Item,
  Category,
  ItemDistribution,
  DistributionPlace,
  Purchase,
  Waybill,
  Url,
  Sequelize,
  sequelize,
} = require('../models');

const create = async (req, res) => {
  const errors = [];
  const {
    categoryId,
    name,
    amount,
    note,
    imagePath,
    companyId,
    urls,
  } = req.body;
  // TODO Add better validation
  if (!categoryId) {
    errors.push('categoryId');
  }

  if (!name) {
    errors.push('name');
  }

  if (amount < 0) {
    errors.push('amount');
  }

  if (errors.length) {
    res.status(400).send({ message: 'Validation error', fields: errors });

    return;
  }

  try {
    const transaction = await sequelize.transaction();
    const item = await Item.create({
      categoryId,
      name,
      amount,
      note,
      imagePath,
      companyId,
    }, { transaction });

    if ((urls || []).length) {
      const itemId = item.id;
      const dbUrls = await Promise.mapSeries(urls, async url => {
        const { name, data } = url;

        if (!(name || data)) {
          return null;
        }
        
        return await Url.create({ name, data, itemId }, { transaction });
      });

      item.urls = dbUrls.filter(url => !url);
    }

    await transaction.commit();

    res.send(item || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const update = async (req, res) => {
  const {
    categoryId,
    name,
    amount,
    note,
    imagePath,
    companyId,
    urls,
  } = req.body;

  try {
    const transaction = await sequelize.transaction();

    const item = req.item;

    const result = await item.update({
      categoryId,
      name,
      amount,
      note,
      imagePath,
      companyId,
    }, { transaction });

    if ((urls || []).length) {
      const itemId = item.id;
      const dbUrls = await Promise.mapSeries(urls, async url => {
        const { id, name, data } = url;
        
        if (!(name || data)) {
          return null;
        }

        if (id) {
          const model = await Url.findByPk(id, { transaction });

          return await model.update({ name, data }, { transaction })
        }
        
        return await Url.create({ name, data, itemId }, { transaction });
      });

      item.urls = dbUrls.filter(url => !url);

    }

    await transaction.commit();

    res.send(result || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const remove = async (req, res) => {
  const item = req.item;

  try {
    await item.destroy();

    res.send();
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const getShortInfoById = async (req, res) => {
  const itemId = req.params.itemId;

  const query = {
    attributes: ['id', 'name', 'companyId', [Sequelize.col('category.name'), 'categoryName']],
    include: [
      {
        model: Category,
        as: 'category',
        attributes: [],
      },
    ],
  };

  try {
    const item = await Item.findByPk(itemId, query);

    res.send(item || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const getById = async (req, res) => {
  const itemId = req.params.itemId;

  const query = {
    attributes: [
      'id',
      'name',
      'amount',
      'note',
      'imagePath',
      'categoryId',
      'companyId',
    ],
    include: [
      {
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
      },
      {
        model: ItemDistribution,
        as: 'distributions',
        attributes: ['id', 'amount', 'date'],
        include: [
          {
            model: DistributionPlace,
            as: 'place',
            attributes: ['id', 'name'],
          },
            {
              model: Waybill,
              as: 'waybill',
              attributes: ['id', 'number'],
            },
        ],
      },
      {
        model: Purchase,
        as: 'purchases',
        attributes: ['id', 'orderAmount', 'amount', 'date', 'price'],
        include: [
          {
            model: Waybill,
            as: 'waybill',
            attributes: ['id', 'number', 'date'],
          },
        ],
      },
      {
        model: Url,
        as: 'urls',
        attributes: ['id', 'name', 'data'],
      },
    ],
  };

  try {
    const item = await Item.findByPk(itemId, query);

    res.send(item || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const getList = async (req, res) => {
  const query = {
    attributes: ['id', 'name', 'companyId', [Sequelize.col('category.name'), 'categoryName']],
    include: [
      {
        model: Category,
        as: 'category',
        attributes: [],
      },
    ],
  };

  try {
    const items = await Item.findAll(query);

    res.send(items || []);
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const search = async (req, res) => {
  const search = req.query.search;
  const query = {
    attributes: ['id', 'name', [Sequelize.col('category.name'), 'categoryName']],
    where: {
      name: {
        [Sequelize.Op.substring]: search,
      },
    },
    include: [
      {
        model: Category,
        as: 'category',
        attributes: [],
      },
    ],
    limit: 20,
  };

  try {
    const items = await Item.findAll(query);

    res.send(items || []);
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const checkName = async (req, res) => {
  const search = req.query.search;
  const query = {
    attributes: ['name'],
    where: {
      name: {
        [Sequelize.Op.substring]: search,
      },
    },
  };

  try {
    const count = await Item.count(query);

    res.status(200).send({ count });
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

module.exports = {
  create,
  update,
  remove,
  getShortInfoById,
  getById,
  getList,

  search,
  checkName,
};
