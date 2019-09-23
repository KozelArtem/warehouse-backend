const { machine: machineSvc } = require('../services');

module.exports = {
  add: async (req, res, next) => {
    const { name, items, imagePath } = req.body;

    try {
      const machine = await machineSvc.add({ name, imagePath }, items);

      res.send(machine || {});
    } catch (err) {
      next(err);
    }
  },

  getById: async (req, res, next) => {
    try {
      const machine = await machineSvc.getInfo(req.params.id);

      res.send(machine || {});
    } catch (err) {
      next(err);
    }
  },

  getList: async (req, res, next) => {
    try {
      const machines = await machineSvc.getAll();

      res.send(machines || []);
    } catch (err) {
      next(err);
    }
  },

  addItems: async (req, res, next) => {
    const items = req.body.items;

    try {
      const machine = await machineSvc.addItems(req.body.id, items);

      res.send(machine || {});
    } catch (err) {
      next(err);

    }
  },

  removeItems: async (req, res, next) => {
    const items = req.body.items;

    try {
      const machine = await machineSvc.removeItems(req.body.id, items);

      res.send(machine || {});
    } catch (err) {
      next(err);

    }
  }
};
