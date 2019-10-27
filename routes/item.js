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

router.post(
  '/item/:itemId/distributions',
  requireAuth,
  requireAdmin,
  ctrl.createItemDistribution
);

router.put(
  '/item/:itemId/distributions/:id',
  requireAuth,
  requireAdmin,
  loadItemDistribution,
  ctrl.updateItemDistribution
);

router.delete(
  '/item/:itemId/distributions/:id',
  requireAuth,
  requireAdmin,
  loadItemDistribution,
  ctrl.removeItemDistribution
);

module.exports = router;
