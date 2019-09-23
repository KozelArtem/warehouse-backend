const { itemUse: itemUseSvc } = require('../services');

module.exports = {
  add: async (req, res, next) => {
    const itemId = req.params.id;
    const { name, amount, date } = req.body;
  
    try {
      const use = await itemUseSvc.add({ name, itemId, amount, date });
  
      res.send(use || {});
    } catch (err) {
      next(err);
    }
  },

  remove: async (req, res, next) => {
    try {
      await itemUseSvc.remove(req.params.useId);
  
      res.send();
    } catch (err) {
      next(err);
    }
  },

};
