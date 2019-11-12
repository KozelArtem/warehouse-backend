const router = require('express').Router();

const { loadCompany, loadCompanyPhones } = require('../middleware/loader');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const ctrl = require('../controllers/company');

router.get(
  '/company/list',
  requireAuth,
  ctrl.getShortCompanyList,
);

router.get(
  '/company/list/items',
  requireAuth,
  ctrl.getCompaniesWithItems,
);

router.get(
  '/company/:companyId',
  requireAuth,
  ctrl.getCompanyInfo,
);

router.post(
  '/company/',
  requireAuth,
  requireAdmin,
  ctrl.create,
);

router.put(
  '/company/:companyId',
  requireAuth,
  requireAdmin,
  loadCompany,
  loadCompanyPhones,
  ctrl.update,
);

router.delete(
  '/company/:companyId',
  requireAuth,
  requireAdmin,
  loadCompany,
  ctrl.remove,
);

module.exports = router;
