const router = require('express').Router();

const { loadPurchase } = require('../middleware/loader');

const ctrl = require('../controllers/purchase');

router.get('/purchases', ctrl.getList);
router.get('/purchases/active', ctrl.getActiveList);

router.post('/purchases', ctrl.create);
router.put('/purchases/:purchaseId', loadPurchase, ctrl.update);
router.delete('/purchases/:purchaseId', loadPurchase, ctrl.remove);

module.exports = router;
