const { Machine, Item } = require('../models');


module.exports = {
  add: async (data, items) => {
    const machine = await Machine.create(data);

    const transaction = await sequelize.transaction();

    await Promise.each(items, async (item) => {
      machine.addItem(item);
    });

    await transaction.commit();

    return Machine.findByPk(machine.id, waybillOpts);
  },

  getById: id => Waybill.findByPk(id, waybillOpts),

  getList: () => Waybill.findAll(waybillOpts),

  removePurchaseById: async ыid => {
    const model = await Purchase.findByPk(id);

    await model.destroy();
  },
};
