const router = require('express').Router();

const { requireAuth, requireAdmin } = require('../middleware/auth');
const authCtrl = require('../controllers/auth');

const categoryRoute = require('./category');
const itemRoute = require('./item');
const distributionRoute = require('./distribution');
const companyRoute = require('./company');
const purchaseRoute = require('./purchase');
const waybillRoute = require('./waybill');
const machineRoute = require('./machine');

router.post('/login', authCtrl.login);

router.all('*', requireAuth)
router.post('*', requireAdmin);
router.put('*', requireAdmin);
router.delete('*', requireAdmin);

router.use('/',
  categoryRoute,
  itemRoute,
  distributionRoute,
  companyRoute,
  purchaseRoute,
  waybillRoute,
  machineRoute,
);

module.exports = router;
