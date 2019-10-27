const { Item, Category, ItemDistibution } = require('../models');

const loadItem = async (req, res, next) => {
  const itemId = req.params.itemId;
  const item = await Item.findByPk(itemId);

  if (!item) {
    res.status(400).send({ message: `Can't find item with id ${itemId}` });

    return;
  }

  req.item = item;

  next();
};

const loadItemDistribution = async (req, res, next) => {
  const itemId = req.params.itemId;
  const id = req.params.id;
  const itemDistibution = await ItemDistibution.findByPk(id, { where: { itemId }});

  if (!itemDistibution) {
    res.status(400).send({ message: `Can't find item distibution with id ${id}` });

    return;
  }

  req.itemDistibution = itemDistibution;

  next();
};

const loadCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const category = await Category.findByPk(categoryId);

  if (!category) {
    res.status(400).send({ message: `Can't find category with id ${categoryId}` });

    return;
  }

  req.category = category;

  next();
};

module.exports = {
  loadItem,
  loadItemDistribution,
  loadCategory,
};
