const { category: categorySvc, item: itemSvc } = require('../services');

const get = async (req, res, next) => {
  try {
    const item = await itemSvc.getInfo(req.params.id);

    res.send(item || {});
  } catch (err) {
    // const data = ErrorHandler(err, ['controllers', 'category', 'getAll']);

    next(err);
  }
};

const add = async (req, res, next) => {
  const { categoryId, name, amount } = req.body;

  try {
    const item = await itemSvc.add({ categoryId, name, amount });

    res.send(item || {});
  } catch (err) {
    next(err);
  }
};

const addPurchase = async (req, res, next) => {
  const { itemId, amount, waybillId } = req.body;

  try {
    const purchase = await itemSvc.addPurchase({ itemId, waybillId, amount });

    res.send(purchase || {});
  } catch (err) {
    next(err);
  }
};

const addUse = async (req, res, next) => {
  const itemId = req.params.id;
  const { name, amount, date } = req.body;

  try {
    const use = await itemSvc.addUse({ name, itemId, amount, date });

    res.send(use || {});
  } catch (err) {
    next(err);
  }
};

const addWaybill = async (req, res, next) => {
  const { number, date, purchases } = req.body;

  try {
    const waybill = await itemSvc.addWaybill(number, date, purchases);

    res.send(waybill || {});
  } catch (err) {
    next(err);
  }
};

const getWaybills = async (req, res, next) => {
  try {
    const waybills = await itemSvc.getWaybills();

    res.send(waybills || []);
  } catch (err) {
    next(err);
  }
};

const getWaybillInfo = async (req, res, next) => {
  try {
    const waybill = await itemSvc.getWaybillById(req.params.id);

    res.send(waybill || {});
  } catch (err) {
    next(err);
  }
};

const getList = async (req, res, next) => {
  try {
    const items = await itemSvc.getAll();

    res.send(items || []);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  get,
  getList,
  getWaybills,
  getWaybillInfo,
  add,
  addUse,
  addPurchase,
  addWaybill,
};
