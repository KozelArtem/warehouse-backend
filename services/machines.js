const moment = require('moment');
const { Op, fn, literal } = require('sequelize');

const {
  Machine,
  MachineService,
  Worker,
  Image,
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
    dateFrom,
    dateTo,
    limit,
    offset,
    search,
    onlyTO,
  } = input;

  
  const query = {
    distinct:true,
    attributes: ['id', 'name', 'lastServiceDate', 'nextServiceDate'],
    where: {},
    limit: +limit || undefined,
    offset: +offset || 0,
    include: [
      {
        model: MachineService,
        as: 'services',
        attributes: ['id'],
        where: {
          completed: false,
          completedAt: null,
          isTO: false,
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
        required: true,
      },
    ];

    if (dateFrom && dateTo) {
      include[0].where = {
        ...include[0].where,
        [Op.or]: {
          addedAt: {
            [Op.gte]: dateFrom,
            [Op.lte]: dateTo,
          },
          completedAt: {
            [Op.gte]: dateFrom,
            [Op.lte]: dateTo,
          },
        },
      };
    }

    query.include = include;
  }
  if (search) {
    query.where.name = {
      [Op.like]: `%${search}%`,
    };
  }
  
  return Machine.findAndCountAll(query);
};

const getMachineById = id => {
  const query = {
    attributes: [
      'id',
      'name',
      'lastServiceDate',
      'nextServiceDate',
      [literal(`(SELECT COUNT(DISTINCT(id)) FROM MachineServices WHERE machineId = ${id} AND isTO = false)`), 'totalServicesCount']
    ],
    where: {},
  };

  return Machine.findByPk(id, query);
};

const createMachineService = async (machineId, input) => {
  const {
    name,
    description,
    addedAt,
    completedAt,
    isTO,
    elimination,
    diagnostic,
    doneWorkerId,
    images = [],
  } = input;

  const data = {
    name,
    description,
    addedAt,
    completedAt: completedAt || null,
    machineId,
    isTO: isTO || false,
    elimination,
    diagnostic,
    doneWorkerId,
  };
  const service = await MachineService.create(data);
  const imagesData = images.map(i => ({
    machineServiceId: service.id,
    url: i,
  }));

  const newImages = await Image.bulkCreate(imagesData);

  return {
    ...service.toJSON(),
    images: newImages,
  };
};

const createNextTO = (machineId, lastTODate, transaction) => {
  const data = {
    name: 'ТО',
    addedAt: moment(lastTODate).add(1, 'month'),
    completed: false,
    isTO: true,
    machineId,
  };

  return MachineService.create(data, { transaction });
};

const updateMachineService = async (machineId, machineService, input) => {
  const {
    name,
    description,
    addedAt,
    completedAt,
    isTO,
    elimination,
    diagnostic,
    doneWorkerId,
    images = [],
  } = input;

  const data = {
    name,
    description,
    addedAt,
    completedAt: completedAt || null,
    isTO: isTO || false,
    completed: !!completedAt,
    elimination,
    diagnostic,
    doneWorkerId,
  };

  Object.keys(data)
    .filter(key => !!data[key])
    .forEach(key => machineService[key] = data[key]);

  const transaction = await sequelize.transaction();

  await machineService.save({ transaction });

  if (data.completed) {
    await updateServiceDates(machineId, completedAt, transaction);
    await createNextTO(machineId, completedAt, transaction)
  }

  const imagesData = images.map(i => ({
    machineServiceId: machineService.id,
    url: i.url || i,
  }));

  await Image.destroy({ where: { machineServiceId: machineService.id }, transaction })
  await Image.bulkCreate(imagesData, { transaction });

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
    distinct: true,
    attributes: [
      'id',
      'name',
      'description',
      'machineId',
      'addedAt',
      'completedAt',
      'isTO',
      'completed',
      'elimination',
      'diagnostic',
      'doneWorkerId',
    ],
    include: [
      {
        model: Worker,
        as: 'doneWorker',
        attributes: ['id', 'name', 'surname', 'position'],
      },
      {
        model: Image,
        as: 'images',
        attributes: ['url'],
      },
    ],
    where: {
      machineId,
    },
    limit: +limit || undefined,
    offset: +offset || undefined,
    order: [['completed', 'ASC'], ['completedAt', 'DESC'], ['addedAt', 'ASC']],
  };

  if (search) {
    query.where.name = {
      [Op.like]: `%${search}%`,
    };
  }
  
  if (dateFrom && dateTo) {
    query.where = {
      ...query.where,
      [Op.or]: [
        {
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

  return MachineService.findAndCountAll(query);
};

const getMachineServiceById = async (id, input) => {
  const {
    onlyTO,
    dateFrom,
    dateTo,
  } = input;

  const query = {
    attributes: [
      'id',
      'name',
      'description',
      'machineId',
      'addedAt',
      'completedAt',
      'isTO',
      'completed',
      'elimination',
      'diagnostic',
      'doneWorkerId',
    ],
    include: [
      {
        model: Worker,
        as: 'doneWorker',
        attributes: ['id', 'name', 'surname', 'position'],
      },
      {
        model: Image,
        as: 'images',
        attributes: ['url'],
      },
    ],
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

const getActiveMachineServicesForTelegram = (startDate, endDate) => {
  const query = {
    attributes: ['id', 'name', 'lastServiceDate', 'nextServiceDate'],
    where: {},
    include: [
      {
        ...serviceInclude,
        required: true,
        where: {
          // isTO: true,
          completed: false,
          addedAt: {
            // [Op.gte]: startDate,
            [Op.lte]: endDate,
          },
        },
      },
    ],
  };

  return Machine.findAll(query);
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

  getActiveMachineServicesForTelegram,
};
