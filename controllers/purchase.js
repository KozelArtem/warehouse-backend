const { purchase: purchaseSvc } = require('../services');

module.exports = {
  add: async (req, res, next) => {
    try {
      const orders = await purchaseSvc.add(req.body.orders);

      res.send(orders || []);
    } catch (err) {
      next(err);
    }
  },

  addToWaybill: async (req, res, next) => {
    const { number, date, imagePath, purchases } = req.body;
    try {
      const waybill = await waybillSvc.add({ number, date, imagePath });

      await purchaseSvc.addToWaybill(waybill, purchases);

      res.send();
    } catch (err) {
      next(err);
    }
  },

  getList: async (req, res, next) => {
    try {
      const orders = await purchaseSvc.getList();

      res.send(orders || []);
    } catch (err) {
      next(err);
    }
  },

  getOrdered: async (req, res, next) => {
    try {
      const data = await purchaseSvc.getList();

      const orders = await data.filter(value => !value.waybillId  && !value.amount);

      res.send(orders || []);
    } catch (err) {
      next(err);
    }
  },
};
