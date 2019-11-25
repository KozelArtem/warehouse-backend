const router = require('express').Router();

const { loadPurchase } = require('../middleware/loader');

const ctrl = require('../controllers/purchase');

router.get('/order', ctrl.getList);

router.post('/order', ctrl.create);
router.put('/order/:purchaseId', loadPurchase, ctrl.update);
router.delete('/order/:purchaseId', loadPurchase, ctrl.remove);

module.exports = router;
