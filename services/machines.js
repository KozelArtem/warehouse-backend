const moment = require('moment');
const { Op } = require('sequelize');

const {
  Machine,
  MachineService,
  sequelize,
} = require('../models');

const { toBoolean } = require('../helpers/queryHelper');

const serviceInclude = {
  model: MachineService,
  as: 'services',
  attributes: ['id', 'name', 'machineId', 'addedAt', 'completedAt', 'isTO', 'completed'],
  where: {},
  required: false,
};

const createMachine = input => {
  const {
    name,
  } = input;

  const data = {
    name,
  };

  return Machine.create(data);
};

const updateMachine = (machine, input) => {
  const {
    name,
    lastServiceDate,
    nextServiceDate,
  } = input;

  const data = {
    name,
    lastServiceDate,
    nextServiceDate,
  };

  return machine.update(data);
};

const updateServiceDates = async (machineId, date, transaction) => {
  const machine = await Machine.findByPk(machineId);

  machine.lastServiceDate = date;
  machine.nextServiceDate = moment(date).add(1, 'month');

  return machine.save({ transaction });
};
 
const deleteMachine = machine => machine.destroy();

const getMachineList = input => {
  const {
    limit,
    offset,
    search,
    onlyTO,
  } = input;

  
  const query = {
    attributes: ['id', 'name', 'lastServiceDate', 'nextServiceDate'],
    where: {},
    limit: +limit || 10,
    offset: +offset || 0,
    include: [
      {
        model: MachineService,
        as: 'services',
        attributes: ['id'],
        where: {
          completed: false,
          completedAt: null,
        },
        required: false,
      },
    ],
    order: [['name', 'asc']],
  };
  
  if (onlyTO) {
    const include = [
      {
        ...serviceInclude,
        where: {
          isTO: true,
        },
      },
    ];

    query.include = include;
  }
  if (search) {
    query.where.name = {
      [Op.like]: `%${search}%`,
    };
  }
  
  return Machine.findAndCountAll(query);
};

const getMachineById = async id => {
  const query = {
    attributes: ['id', 'name', 'lastServiceDate', 'nextServiceDate'],
    where: {},
  };

  const countQuery = {
      where: {
        machineId: id,
        completedAt: {
          [Op.gte]: moment().startOf('year'),
        },
    }
  };

  const totalServicesCount = await MachineService.count(countQuery);
  const machine = await Machine.findByPk(id, query);

  return {
    ...machine.toJSON(),
    totalServicesCount,
  };
};

const createMachineService = (machineId, input) => {
  const {
    name,
    addedAt,
    isTO,
  } = input;

  const data = {
    name,
    addedAt,
    machineId,
    isTO,
  };

  return MachineService.create(data);
};

const createNextTO = (machineId, lastTODate, transaction) => {
  const data = {
    name: 'ТО',
    addedAt: lastTODate,
    completed: false,
    machineId,
  };

  return MachineService.create(data, { transaction });
};

const updateMachineService = async (machineId, machineService, input) => {
  const {
    name,
    addedAt,
    completedAt,
    isTO,
  } = input;

  const data = {
    name,
    addedAt,
    completedAt,
    isTO,
    completed: !!completedAt,
  };

  Object.keys(data).filter(key => !!data[key]).forEach(key => {
    machineService[key] = data[key];
  });

  const transaction = await sequelize.transaction();

  await machineService.save({ transaction });

  if (data.completed) {
    await updateServiceDates(machineId, completedAt, transaction);
    await createNextTO(machineId, completedAt, transaction)
  }

  return transaction.commit();
};
 
const deleteMachineService = machineService => machineService.destroy();

const getMachineServiceList = (machineId, input) => {
  const {
    limit,
    offset,
    search,
    onlyTO,
    dateFrom,
    dateTo,
  } = input;

  const query = {
    attributes: ['id', 'name', 'machineId', 'addedAt', 'completedAt', 'isTO', 'completed'],
    where: {
      machineId,
    },
    limit: +limit || 10,
    offset: +offset || 0,
  };

  if (search) {
    query.where.name = {
      [Op.like]: `%${search}%`,
    };
  }
  
  const isCurrentMonth = moment(new Date(dateFrom)).month() === moment().month();

  if (dateFrom && dateTo) {
    query.where = {
      ...query.where,
      [Op.or]: [
        {
          addedAt: {
            [Op.gt]: isCurrentMonth ?  moment().startOf('year') : new Date(dateFrom),  
            [Op.lte]: new Date(dateTo),
          },
          completedAt: null,
        },
        {
          completedAt: {
            [Op.gte]: new Date(dateFrom),
            [Op.lte]: new Date(dateTo),
          },
        },
      ],
    }
  }

  if (typeof onlyTO !== 'undefined') {
    query.where.isTO = toBoolean(onlyTO);
  }

  return MachineService.findAll(query);
};

const getMachineServiceById = async (id, input) => {
  const {
    onlyTO,
    dateFrom,
    dateTo,
  } = input;

  const query = {
    attributes: ['id', 'name', 'machineId', 'addedAt', 'completedAt', 'isTO', 'completed'],
    where: {},
  };

  if (dateFrom && dateTo) {
    query.where = {
      ...query.where,
      [Op.or]: [
        {
          addedAt: {
            [Op.gte]: moment(dateFrom),
            [Op.lte]: moment(dateTo),
          },
        },
        {
          completedAt: {
            [Op.gte]: moment(dateFrom),
            [Op.lte]: moment(dateTo),
          },
        },
      ],
    }
  }
  
  if (typeof onlyTO !== 'undefined') {
    query.where.isTO = toBoolean(onlyTO);
  }

  return MachineService.findByPk(id, query);
};


module.exports = {
  createMachine,
  updateMachine,
  updateServiceDates,
  deleteMachine,
  getMachineList,
  getMachineById,

  createMachineService,
  updateMachineService,
  updateServiceDates,
  deleteMachineService,
  getMachineServiceList,
  getMachineServiceById,
};
