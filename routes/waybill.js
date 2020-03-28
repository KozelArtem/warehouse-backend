const router = require('express').Router();

const ctrl = require('../controllers/waybill');

router.post('/waybills', ctrl.add);
router.get('/waybills', ctrl.getList);

router.get('/waybills/:id', ctrl.getInfoById);

router.delete('/purchase/:id', ctrl.removePurchase);

module.exports = router;
