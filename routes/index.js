const router = require('express').Router();

const { requireAuth, requireAdmin } = require('../middleware/auth');
const authCtrl = require('../controllers/auth');

const categoryRoute = require('./category');
const itemRoute = require('./item');
const distributionRoute = require('./distribution');
const companyRoute = require('./company');
const purchaseRoute = require('./purchase');

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
);
// router.use('/', waybillRoute);

router.post('/login', authCtrl.login);

module.exports = router;
