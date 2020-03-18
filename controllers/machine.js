const serviceMachines = require('../services/machines');

const {
  createMachine,
  updateMachine,
  deleteMachine,
  getMachineList,
  getMachineById,

  createMachineService,
  updateMachineService,
  deleteMachineService,
  getMachineServiceList,
  getMachineServiceById,
} = serviceMachines;

const create = async (req, res, next) => {
  try {
    await createMachine(req.body);

    res.status(201).send();
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    await updateMachine(req.machine, req.body);

    res.status(201).send();
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    await deleteMachine(req.machine);

    res.status(201).send();
  } catch (err) {
    next(err);
  }
};

const getList = async (req, res, next) => {
  try {
    const result = await getMachineList(req.query);

    res.set('X-TOTAL-COUNT', result.count)
    res.send(result.rows || []);
  } catch (err) {
    next(err);
  }
};

const show = async (req, res, next) => {
  try {
    const machine = await getMachineById(req.params.id, req.query);

    res.send(machine || {});
  } catch (err) {
    next(err);
  }
};

const createService = async (req, res, next) => {
  try {
    await createMachineService(req.params.machineId, req.body);

    res.status(201).send();
  } catch (err) {
    next(err);
  }
};

const updateService = async (req, res, next) => {
  try {
    await updateMachineService(req.params.machineId, req.machineService, req.body);

    res.status(201).send();
  } catch (err) {
    next(err);
  }
};

const destroyService = async (req, res, next) => {
  try {
    await deleteMachineService(req.machineService);

    res.status(201).send();
  } catch (err) {
    next(err);
  }
};

const getServiceList = async (req, res, next) => {
  try {
    const result = await getMachineServiceList(req.params.id, req.query);

    res.send(result || []);
  } catch (err) {
    next(err);
  }
};

const showService = async (req, res, next) => {
  try {
    const machine = await getMachineServiceById(req.params.id, req.query);

    res.send(machine || {});
  } catch (err) {
    next(err);
  }
};

module.exports = {
  create,
  update,
  destroy,
  getList,
  show,

  createService,
  updateService,
  destroyService,
  getServiceList,
  showService,
};
