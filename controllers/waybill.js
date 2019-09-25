const { waybill: waybillSvc, purchase: purchaseSvc } = require('../services');


module.exports = {
  add: async (req, res, next) => {
    const { number, date, imagePath, purchases } = req.body;
    
    try {
      const waybill = await waybillSvc.add({ number, date, imagePath });

      await purchaseSvc.addToWaybill(waybill, purchases);

      res.send(waybill || {});
    } catch (err) {
      next(err);
    }
  },
  
  getList: async (req, res, next) => {
    try {
      const waybills = await waybillSvc.getList();
  
      res.send(waybills || []);
    } catch (err) {
      next(err);
    }
  },
  
  getInfoById: async (req, res, next) => {
    try {
      const waybill = await waybillSvc.getById(req.params.id);
  
      res.send(waybill || {});
    } catch (err) {
      next(err);
    }
  },

  removePurchase: async (req, res, next) => {
    try {
      await waybillSvc.removePurchaseById(req.params.id);

      res.send();
    } catch (err) {
      next(err);
    }
  },

};
