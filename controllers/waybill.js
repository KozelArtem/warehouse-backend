const { waybill: waybillSvc, purchase: purchaseSvc } = require('../services');


module.exports = {
  add: async (req, res, next) => {
    const { number, date, companyId, imagePath, orders } = req.body;
    
    try {
      const waybill = await waybillSvc.add({ number, date, companyId, imagePath });

      await purchaseSvc.addToWaybill(waybill, orders);

      res.send(waybill || {});
    } catch (err) {
      next(err);
    }
  },
  
  getList: async (req, res, next) => {
    let method = waybillSvc.getList;

    if (req.query.byCompany) {
      method = waybillSvc.getListByCompanies;
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
      const waybills = await waybillSvc.getListByCompanies(req.query);
  
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
