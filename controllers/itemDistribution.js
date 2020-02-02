const Sequelize = require('sequelize');

const {
  ItemDistribution,
  DistributionPlace,
  PlaceService,
} = require('../models');

const create = async (req, res) => {
  const itemId = req.params.itemId;
  const { placeId, amount, date } = req.body;
  const errors = [];
  // TODO Add better validation
  if (!placeId) {
    errors.push('placeId');
  }

  if (amount < 0) {
    errors.push('amount');
  }

  if (!date) {
    errors.push('date');
  }

  if (errors.length) {
    res.status(400).send({ message: 'Validation error', fields: errors });

    return;
  }
  try {
    const item = await ItemDistribution.create({ itemId, placeId, amount, date });

    res.send(item || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const update = async (req, res) => {
  const itemDistribution = req.itemDistribution;

  try {
    const item = await itemDistribution.update({ placeId, amount, date });

    res.send(item || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const remove = async (req, res) => {
  const itemDistribution = req.itemDistribution;

  try {
    const item = await itemDistribution.destroy();

    res.send(item || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const getList = async (req, res) => {
  const query = {
    attributes: ['id', 'date', 'amount', 'note'],
    include: [
      {
        model: DistributionPlace,
        as: 'place',
        attributes: ['id', 'name'],
      },
      {
        model: Item,
        as: 'item',
        attributes: ['id', 'name'],
      },
    ],
  };

  try {
    const itemDistributions = await ItemDistribution.findAll(query);

    res.send(itemDistributions || []);
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const getInfo = async (req, res) => {
  const id = req.params.id;
  const query = {
    attributes: ['id', 'date', 'amount', 'note'],
    include: [
      {
        model: DistributionPlace,
        as: 'place',
        attributes: ['id', 'name'],
      },
    ],
  };

  try {
    const itemDistribution = await ItemDistribution.findByPk(id, query);

    res.send(itemDistribution || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const getPlaces = async (req, res) => {
  const query = {
    attributes: ['id', 'name'],
    include: {
      model: PlaceService,
      as: 'todos',
      attributes: ['id', 'name', 'completed', 'completedDate', 'createdAt'],
    },
  };

  try {
    const distributionPlaces = await DistributionPlace.findAll(query);

    res.send(distributionPlaces || []);
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const createPlace = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).send({ message: 'Validation error', fields: ['name'] });

    return;
  }

  try {
    const distributionPlace = await DistributionPlace.create({ name });

    res.send(distributionPlace || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const getPlaceServices = async (req, res) => {
  const placeId = req.params.placeId;

  const query = {
    attributes: ['id', 'name'],
    include: [
      {
        model: PlaceService,
        as: 'todos',
        attributes: ['id', 'name', 'completed', 'completedDate', 'addedDate'],
      }
    ],
  };

  try {
    const place = await DistributionPlace.findByPk(placeId, query);

    res.send(place || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const createPlaceService = async (req, res) => {
  const placeId = req.params.placeId;
  const { name, addedDate } = req.body;

  try {
    const placeService = await PlaceService.create({
      placeId,
      name,
      addedDate,
      completed: false,
      completedDate: null,
    });

    res.send(placeService || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const updatePlaceService = async (req, res) => {
  const { id, placeId } = req.params;
  const { name, completedDate, addedDate } = req.body;
  let completed = false;

  try {
    const model = await PlaceService.findByPk(id);

    if (completedDate || model.completedDate) {
      completed = true;
    }

    const placeService = await model.update({
      placeId,
      name,
      completed,
      completedDate,
      addedDate,
    });

    res.send(placeService || {});
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

const removePlaceService = async (req, res) => {
  const { id } = req.params;

  try {
    const model = await PlaceService.findByPk(id);

    await model.destroy();

    res.send();
  } catch (err) {
    console.error(err);
    
    res.status(500).send(err);
  }
};

module.exports = {
  create,
  update,
  remove,
  getList,
  getInfo,

  createPlace,
  getPlaces,

  createPlaceService,
  updatePlaceService,
  removePlaceService,
  getPlaceServices,
};
