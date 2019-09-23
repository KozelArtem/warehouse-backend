const { Item, Purchase, Used, Category, Waybill } = require('../models');

const getInfo = id => {
  const options = {
    include: [
      { model: Category, as: 'category' },
      {
        model: Purchase,
        as: 'purchases',
        include: { model: Waybill, as: 'waybill' },
      },
      { model: Used, as: 'uses' },
    ],
  };

  return Item.findByPk(id, options);
};

module.exports = {
  getInfo,

  add: async (data, options) => {
    const item = await Item.create(data, options);

    return getInfo(item.id);
  },

  edit: async (id, data) => {
    await Item.update(data, { where: { id } });

    return getInfo(id);
  },

  remove: async id => {
    const model = await Item.findByPk(id);

    await model.destroy();
  },

  getByCategoryId: categoryId => {
    const options = {
      include: [{ model: Category, as: 'category' }],
      where: { categoryId },
    };

    return Item.findAll(options);
  },

  getList: () => {
    const options = {
      include: { model: Category, as: 'category' },
    };

    return Item.findAll(options);
  },
};
