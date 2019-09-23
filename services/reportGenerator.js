const { fn, Op, col } = require('sequelize');

const { Item, Used, Category, Purchase } = require('../models');


module.exports = {
  getInfoByMachine: (machineName, period, categoryId) => {
    const options = {
      attributes: {
        include: [[fn('sum', col('uses.amount')), 'totalAmount']],
      },
      include: [
        {
          model: Used,
          as: 'uses',
          where: {
            name: { [Op.like]: machineName },
            date: { [Op.between]: period },
          },
          attributes: [],
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
        {
          model: Purchase,
          as: 'purchases',
          order: [['id', 'DESC']],
          limit: 1,
        },
      ],
      group: ['id'],
    };

    return Item.findAll(options);
  },
};
