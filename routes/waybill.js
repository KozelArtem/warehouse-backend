const router = require('express').Router();

const  { needAuth } = require('../middleware/auth');

const waybillCtrl = require('../controllers/waybill');

router.post('/waybill', needAuth, waybillCtrl.add);
router.get('/waybill', waybillCtrl.getList);

router.get('/waybill/:id', waybillCtrl.getInfoById);

router.delete('/purchase/:id', needAuth, waybillCtrl.removePurchase);

module.exports = router;
