const { Item, Category, ItemDistibution, Purchase, Company } = require('../models');

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

const loadCompany = async (req, res, next) => {
  const companyId = req.params.companyId;
  const company = await Company.findByPk(companyId);

  if (!company) {
    res.status(400).send({ message: `Can't find company with id ${companyId}` });

    return;
  }

  req.company = company;

  next();
};

const loadCompanyPhones = async (req, res, next) => {
  const companyId = req.params.companyId;
  const phones = await PhoneNumber.findByPk(companyId);

  req.phones = phones || [];

  next();
};

const loadPurchase = async (req, res, next) => {
  const purchaseId = req.params.purchaseId;
  const purchase = await Purchase.findByPk(purchaseId);

  req.purchase = purchase || {};

  next();
};

module.exports = {
  loadItem,
  loadItemDistribution,
  loadCategory,

  loadCompany,
  loadCompanyPhones,

  loadPurchase,
};
