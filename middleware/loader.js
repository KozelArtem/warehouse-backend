const {
  Item,
  Category,
  ItemDistribution,
  Purchase,
  Company,
  PhoneNumber,
  Machine,
  MachineService,
} = require('../models');

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
  const itemDistribution = await ItemDistribution.findByPk(id, {
    where: { itemId },
  });

  if (!itemDistribution) {
    res
      .status(400)
      .send({ message: `Can't find item distribution with id ${id}` });

    return;
  }

  req.itemDistribution = itemDistribution;

  next();
};

const loadCategory = async (req, res, next) => {
  const categoryId = req.params.categoryId;
  const category = await Category.findByPk(categoryId);

  if (!category) {
    res
      .status(400)
      .send({ message: `Can't find category with id ${categoryId}` });

    return;
  }

  req.category = category;

  next();
};
// TODO  AssertionError [ERR_ASSERTION]: Missing where attribute in the options parameter
const loadCompany = async (req, res, next) => {
  const companyId = req.params.companyId;
  const company = await Company.findByPk(companyId);

  if (!company) {
    res
      .status(400)
      .send({ message: `Can't find company with id ${companyId}` });

    return;
  }

  req.company = company;

  next();
};

const loadCompanyPhones = async (req, res, next) => {
  const companyId = req.params.companyId;

  const phones = await PhoneNumber.findAll({ where: { companyId } });

  req.phones = phones || [];

  next();
};

const loadPurchase = async (req, res, next) => {
  const purchaseId = req.params.purchaseId;
  const purchase = await Purchase.findByPk(purchaseId);

  req.purchase = purchase || {};

  next();
};

const loadMachine = async (req, res, next) => {
  const machineId = req.params.machineId || req.params.id;
  const machine = await Machine.findByPk(machineId);

  req.machine = machine || {};

  next();
};

const loadMachineService = async (req, res, next) => {
  const serviceId = req.params.id;
  const machineService = await MachineService.findByPk(serviceId);

  req.machineService = machineService || {};

  next();
};

module.exports = {
  loadItem,
  loadItemDistribution,
  loadCategory,

  loadCompany,
  loadCompanyPhones,

  loadPurchase,

  loadMachine,
  loadMachineService,
};
