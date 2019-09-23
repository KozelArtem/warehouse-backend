const { item: itemSvc, reportGenerator: reportSvc } = require('../services');

const reportHelper = require('../helpers/report');

module.exports = {
  add: async (req, res, next) => {
    const { categoryId, name, amount, imagePath } = req.body;

    try {
      const item = await itemSvc.add({ categoryId, name, amount, imagePath });

      res.send(item || {});
    } catch (err) {
      next(err);
    }
  },

  edit: async (req, res, next) => {
    const { name, amount, id, imagePath } = req.body;

    try {
      const item = await itemSvc.edit(id, { name, amount, imagePath });

      res.send(item || {});
    } catch (err) {
      next(err);
    }
  },

  remove: async (req, res, next) => {
    const id = req.params.id;

    try {
      await itemSvc.removeById(id);

      res.send();
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const item = await itemSvc.getInfo(req.params.id);

      res.send(item || {});
    } catch (err) {
      next(err);
    }
  },

  getList: async (req, res, next) => {
    try {
      const items = await itemSvc.getList();

      res.send(items || []);
    } catch (err) {
      next(err);
    }
  },

  getInfoByMachine: async (req, res, next) => {
    const { name, start, finish, categoryId } = req.query;

    console.log(req.query);
    
    const formatedPeriod = [
      Date.parse(start),
      Date.parse(finish),
    ];

    try {
      const result = await reportSvc.getInfoByMachine(name, formatedPeriod);

      res.send(result || []);
    } catch (err) {
      next(err);
    }
  },
};
