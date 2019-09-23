const router = require('express').Router();

const  { needAuth } = require('../middleware/auth');

const purchaseCtrl = require('../controllers/purchase');

router.get('/orders', purchaseCtrl.getList);
router.get('/orders/active', purchaseCtrl.getOrdered);
router.post('/orders', needAuth, purchaseCtrl.add);

module.exports = router;
