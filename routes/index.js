const router = require('express').Router();

const authCtrl = require('../controllers/auth');

const category = require('./category');
const itemRoute = require('./item');
const companyRoute = require('./company');
const purchaseRoute = require('./purchase');

router.use('/category', category);
router.use('/', itemRoute, companyRoute, purchaseRoute);
// router.use('/', waybillRoute);

router.post('/login', authCtrl.login);

module.exports = router;
