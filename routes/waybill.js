const router = require('express').Router();

const ctrl = require('../controllers/waybill');

router.post('/waybill', ctrl.add);
router.get('/waybill', ctrl.getList);

router.get('/waybill/:id', ctrl.getInfoById);

router.delete('/purchase/:id', ctrl.removePurchase);

module.exports = router;
