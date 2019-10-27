const router = require('express').Router();

const { loadCategory } = require('../middleware/loader');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const ctrl = require('../controllers/category');

router.get(
  '/',
  requireAuth,
  ctrl.getBaseCategories,
);

router.get(
  '/list',
  requireAuth,
  ctrl.getAllCategories,
);

router.get(
  '/:categoryId',
  requireAuth,
  ctrl.getCategoryInfo,
);

router.post(
  '/',
  requireAuth,
  requireAdmin,
  ctrl.create,
);

router.put(
  '/:categoryId',
  requireAuth,
  requireAdmin,
  loadCategory,
  ctrl.update,
);

router.delete(
  '/:categoryId',
  requireAuth,
  requireAdmin,
  loadCategory,
  ctrl.remove,
);

module.exports = router;
