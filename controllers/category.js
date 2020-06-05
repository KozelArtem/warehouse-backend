const { Op } = require('sequelize');

const { Category, Item } = require('../models');

const getBaseCategories = async (req, res) => {
  try {
    const query = {
      attributes: ['id', 'name'],
      where: { parentId: null },
    };
    const categories = await Category.findAll(query);
    
    res.send(categories || []);
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const getAllCategories = async (req, res) => {
  try {
    const query = {
      attributes: ['id', 'name', 'parentId'],
    };
    const categories = await Category.findAll(query);
    
    res.send(categories || []);
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const getCategoryInfo = async (req, res) => {
  const categoryId = req.params.categoryId;
  const categoryObj = req.category.toJSON();

  try {
    const categoryQuery = {
      where: { 
        parentId: categoryId,
      },
      attributes: ['id', 'name', 'parentId'],
    };

    const baseItemQuery = {
      attributes: ['id', 'name', 'imagePath', 'amount'],
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
      }],
      order: [['name', 'asc']],
    }

    const itemQuery = {
      ...baseItemQuery,
      where: { 
        categoryId, 
        amount: {
          [Op.gt]: 0,
        },
      },
    };

    const emptyItemQuery = {
      ...baseItemQuery,
      where: { 
        categoryId,
        amount: 0,
      },
    }

    const categories = await Category.findAll(categoryQuery);
    const items = await Item.findAll(itemQuery);
    const emptyItems = await Item.findAll(emptyItemQuery);

    items.push(...emptyItems);

    res.send({ ...categoryObj, items, categories } || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const create = async (req, res) => {
  const { name, parentId } = req.body;

  // TODO add validation

  try {
    const category = await Category.create({ name, parentId });

    res.send(category || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const update = async (req, res) => {
  const { name } = req.body;
  const category = req.category;

  try {
    const result = await category.update({ name });

    res.send(result || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const remove = async (req, res) => {
  const category = req.category;

  try {
    await category.destroy();

    res.send(true);
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

module.exports = {
  getBaseCategories,
  getAllCategories,
  getCategoryInfo,

  create,
  update,
  remove,
};
