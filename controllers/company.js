const {
  Company,
  Category,
  Item,
  PhoneNumber,
  sequelize,
} = require('../models');

const companyAttributes = [
  'id',
  'name',
  'person',
  'website',
  'email',
  'location',
  'color',
];

const includePhones = {
  model: PhoneNumber,
  attributes: ['data'],
  as: 'phones',
};

const getShortCompanyList = async (req, res) => {
  try {
    const query = {
      attributes: ['id', 'name'],
    };
    const companies = await Company.findAll(query);

    res.send(companies || []);
  } catch (err) {
    console.error(err);

    res.status(500).send(err);
  }
};

const getCompaniesWithItems = async (req, res) => {
  try {
    const query = {
      attributes: companyAttributes,
      include: [
        {
          model: Item,
          as: 'items',
          attributes: ['id', 'name'],
          include: {
            model: Category,
            as: 'category',
            attributes: ['name'],
          },
        },
        includePhones,
      ],
    };
    const companies = await Company.findAll(query);

    res.send(companies || []);
  } catch (err) {
    console.error(err);

    res.status(500).send(err);
  }
};

const getCompanyInfo = async (req, res) => {
  const companyId = req.params.companyId;

  try {
    const query = {
      attributes: companyAttributes,
      include: [includePhones],
    };

    const company = await Company.findByPk(companyId, query);

    res.send(company || {});
  } catch (err) {
    console.error(err);

    res.status(500).send(err);
  }
};

const create = async (req, res) => {
  const { name, person, email, website, location, phones, color } = req.body;
  // TODO add validation
  try {
    const transaction = await sequelize.transaction();

    const companyData = { name, person, email, website, location, color };

    const company = await Company.create(companyData, { transaction });

    const mappedPhones = phones.map((phone) => {
      return {
        companyId: company.id,
        data: phone,
      };
    });

    const dbPhones = await PhoneNumber.bulkCreate(mappedPhones, {
      transaction,
    });

    await transaction.commit();

    company.phones = dbPhones;
    res.send(company || {});
  } catch (err) {
    console.error(err);

    res.status(500).send(err);
  }
};

const update = async (req, res) => {
  const { name, person, email, website, location, color } = req.body;
  const company = req.company;
  const phones = req.phones || [];

  try {
    const result = await company.update({
      name,
      person,
      email,
      website,
      location,
      color,
    });

    const mappedPhones = phones.map((phone) => {
      return {
        companyId: company.id,
        data: phone,
      };
    });

    const dbPhones = await PhoneNumber.update(mappedPhones, {
      where: { companyId: company.id },
    });

    result.phones = dbPhones;

    res.send(result || {});
  } catch (err) {
    console.error(err);

    res.status(500).send(err);
  }
};

const remove = async (req, res) => {
  const company = req.company;

  try {
    await company.destroy();

    res.send(true);
  } catch (err) {
    console.error(err);

    res.status(500).send(err);
  }
};

module.exports = {
  getShortCompanyList,
  getCompanyInfo,
  getCompaniesWithItems,

  create,
  update,
  remove,
};
