const router = require('express').Router();

const authCtrl = require('../controllers/auth');

const category = require('./category');
const itemRoute = require('./item');
const waybillRoute = require('./waybill');
const purchaseRoute = require('./purchase');

router.use('/category', category);
router.use('/', itemRoute);
router.use('/', purchaseRoute);
router.use('/', waybillRoute);

router.post('/signIn', authCtrl.signIn);

module.exports = router;
