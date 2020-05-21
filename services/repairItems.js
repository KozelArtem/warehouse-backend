const { Op } = require('sequelize');

const {
  sequelize,
  Machine,
  RepairItem,
  Item,
  Company,
} = require('../models');

const createRepairItem = input => {
  const {
    itemId,
    machineId,
    orderNumber,
    departureDate,
    arrivalDate,
    amount,
    companyId,
  } = input;

  const data = {
    itemId,
    machineId,
    orderNumber,
    departureDate,
    arrivalDate,
    amount,
    companyId,
  };

  return RepairItem.create(data);
};

const updateRepairItem = async (repairItem, input) => {
  const {
    itemId,
    machineId,
    orderNumber,
    departureDate,
    arrivalDate,
    amount,
    companyId,
    toWarehouse,
  } = input;

  const data = {
    itemId,
    machineId,
    orderNumber,
    departureDate,
    arrivalDate,
    amount,
    companyId,
    toWarehouse,
  };

  const transaction = await sequelize.transaction();

  const result = await repairItem.update(data, { transaction })
  
  if (toWarehouse) {
    const item = await Item.findByPk(itemId, { transaction });
    const totalAmount = +item.amount + +amount;
  
    item.amount = totalAmount;

    await item.save({ transaction });
  }

  await transaction.commit();

  return result;
};

const destroyRepairItem = repairItem => repairItem.destroy();

const getRepairItemList = input => {
  const {
    dateFrom,
    dateTo,
    limit,
    offset,
    search,
  } = input;

  
  const query = {
    distinct:true,
    attributes: [
      'id',
      'itemId',
      'machineId',
      'orderNumber',
      'departureDate',
      'arrivalDate',
      'amount',
      'companyId',
      'toWarehouse',
    ],
    where: {},
    limit: +limit || 10,
    offset: +offset || 0,
    include: [
      {
        model: Machine,
        as: 'machine',
        attributes: ['id', 'name'],
        required: false,
      },
      {
        model: Company,
        as: 'company',
        attributes: ['id', 'name'],
        required: false,
      },
      {
        model: Item,
        as: 'item',
        attributes: ['id', 'name', 'categoryId'],
        required: true,
      },
    ],
  };

  if (search) {
    const searchValue = `%${search}%`;

    query.where = {
      ...query.where,
      [Op.or]: [
        {
          orderNumber: { [Op.like]: searchValue },
        },
        {
          '$item.name$': { [Op.like]: searchValue },
        },
        {
          '$machine.name$': { [Op.like]: searchValue },
        },
      ],
    };
  }

  if (dateFrom && dateTo) {
    query.where = {
      ...query.where,
      [Op.or]: {
        departureDate: {
          [Op.gte]: dateFrom,
          [Op.lte]: dateTo,
        },
        arrivalDate: {
          [Op.gte]: dateFrom,
          [Op.lte]: dateTo,
        },
      },
    };
  }
  
  return RepairItem.findAndCountAll(query);
};

const getRepairItemById = id => {
  const query = {
    attributes: [
      'id',
      'itemId',
      'machineId',
      'orderNumber',
      'departureDate',
      'arrivalDate',
      'amount',
      'companyId',
      'toWarehouse',
    ],
    include: [
      {
        model: Machine,
        as: 'machine',
        attributes: ['id', 'name'],
        required: false,
      },
      {
        model: Item,
        as: 'item',
        attributes: ['id', 'name', 'categoryId'],
        required: false,
      },
    ],
  };

  return RepairItem.findByPk(id, query);

};

module.exports = {
  createRepairItem,
  updateRepairItem,
  destroyRepairItem,
  getRepairItemList,
  getRepairItemById,
};
