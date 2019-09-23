const { category: categorySvc, item: itemSvc } = require('../services');

const getAll = async (req, res, next) => {
  try {
    const categories = await categorySvc.getAll();
    
    res.send(categories || []);
  } catch (err) {
    next(err);

  }
};

const getItemsByCategory = async (req, res, next) => {
  try {
    const items = await itemSvc.getByCategoryId(req.params.id);

    res.send(items || []);
  } catch (err) {
    
    next(err);
  }
}

const add = async (req, res, next) => {
  try {
    const category = await categorySvc.add(req.body.name);

    res.send(category || {});
  } catch (err) {
    
    next(err);
  }
}
module.exports = {
  getItemsByCategory,
  getAll,
  add,
};
