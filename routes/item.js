const router = require('express').Router();

const ctrl = require('../controllers/item');

const { loadItem, loadItemDistribution } = require('../middleware/loader');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// router.get('/124', ctrl.getInfoByMachine);

router.get(
  '/item',
  requireAuth,
  ctrl.getList
);
router.get(
  '/item/list',
  requireAuth,
  ctrl.getList
);

router.get(
  '/item/search',
  requireAuth,
  ctrl.search
);

router.post(
  '/item',
  requireAuth,
  requireAdmin,
  ctrl.create
);

router.put(
  '/item/:itemId',
  requireAuth,
  requireAdmin,
  loadItem,
  ctrl.update
);

router.delete(
  '/item/:itemId',
  requireAuth,
  requireAdmin,
  loadItem,
  ctrl.remove
);

router.get(
  '/item/:itemId',
  ctrl.getById
);

router.get(
  '/item/:itemId/distribution/:id',
  requireAuth,
  requireAdmin,
  ctrl.getItemDistributionInfo,
);

router.post(
  '/item/:itemId/distribution',
  requireAuth,
  requireAdmin,
  ctrl.createItemDistribution
);

router.put(
  '/item/:itemId/distribution/:id',
  requireAuth,
  requireAdmin,
  loadItemDistribution,
  ctrl.updateItemDistribution
);

router.delete(
  '/item/:itemId/distribution/:id',
  requireAuth,
  requireAdmin,
  loadItemDistribution,
  ctrl.removeItemDistribution
);

router.get(
  '/distribution/places',
  requireAuth,
  ctrl.getDistributionPlaces
);

router.post(
  '/distribution/places',
  requireAuth,
  requireAdmin,
  ctrl.createDistributionPlace
);

module.exports = router;
