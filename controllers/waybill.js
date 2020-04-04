const waybillService = require('../services/waybill');
const purchaseService = require('../services/purchase');

module.exports = {
  add: async (req, res, next) => {
    const { number, date, imagePath, orders } = req.body;
    
    try {
      const waybill = await waybillService.add({ number, date, imagePath });

      await purchaseService.addToWaybill(waybill, orders);

      res.send(waybill || {});
    } catch (err) {
      next(err);
    }
  },
  
  getList: async (req, res, next) => {
    let method = waybillService.getList;

    if (req.query.byCompany) {
      method = waybillService.getListByCompanies;
    } 

    try {
      const waybills = await method(req.query);
  
      res.send(waybills || []);
    } catch (err) {
      next(err);
    }
  },
  
  getListByCompanies: async (req, res, next) => {
    try {
      const waybills = await waybillService.getListByCompanies(req.query);
  
      res.send(waybills || []);
    } catch (err) {
      next(err);
    }
  },
  
  getInfoById: async (req, res, next) => {
    try {
      const waybill = await waybillService.getById(req.params.id);
  
      res.send(waybill || {});
    } catch (err) {
      next(err);
    }
  },

  removePurchase: async (req, res, next) => {
    try {
      await waybillService.removePurchaseById(req.params.id);

      res.send();
    } catch (err) {
      next(err);
    }
  },

};
