const { Category, Item, sequelize } = require('../models');


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

  try {
    const transaction = await sequelize.transaction();

    const categoryQuery = {
      where: { parentId: categoryId },
      attributes: ['id', 'name', 'parentId'],
      transaction,
    };
    const itemQuery = {
      where: { categoryId },
      attributes: ['id', 'name', 'amount'],
      include: [{
        model: Category,
        as: 'category',
        attributes: ['id', 'name'],
      }],
      transaction,
    };

    const categories = await Category.findAll(categoryQuery);
    const items = await Item.findAll(itemQuery);
    
    await transaction.commit();

    res.send({ items, categories } || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const create = async (req, res) => {
  const { name, parentId } = req.body;
  
  // if (!name) {
  //   res.status(400).send({ message: ''}); // TODO refactor
    
  //   return;
  // }
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
