const serviceRepairItems = require('../services/repairItems');

const {
  createRepairItem,
  updateRepairItem,
  destroyRepairItem,
  getRepairItemList,
  getRepairItemById,
} = serviceRepairItems;

const create = async (req, res, next) => {
  try {
    await createRepairItem(req.body);

    res.status(201).send();
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    await updateRepairItem(req.repairItem, req.body);

    res.status(201).send();
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    await destroyRepairItem(req.repairItem);

    res.status(201).send();
  } catch (err) {
    next(err);
  }
};

const getList = async (req, res, next) => {
  try {
    const result = await getRepairItemList(req.query);

    res.set('X-TOTAL-COUNT', result.count)
    res.send(result.rows || []);
  } catch (err) {
    next(err);
  }
};

const show = async (req, res, next) => {
  try {
    const result = await getRepairItemById(req.params.id, req.query);

    res.send(result || {});
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
};
