const { Used } = require('../models');

module.exports = {
  add: data => Used.create(data),

  remove: async id => {
    const model = await Used.findByPk(id);

    await model.destroy();
  },
};
