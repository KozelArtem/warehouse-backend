const router = require('express').Router();

const itemCtrl = require('../controllers/item');

router.get('/waybill', itemCtrl.getWaybills);
router.get('/waybill/:id', itemCtrl.getWaybillInfo);
router.post('/waybill', itemCtrl.addWaybill);

router.get('/item', itemCtrl.getList);
router.post('/item', itemCtrl.add);
router.get('/item/:id', itemCtrl.get);
router.post('/item/:id/use', itemCtrl.addUse);
router.post('/item/purchase', itemCtrl.addPurchase);


// router.get('/:id', categoryCtrl.getById);

module.exports = router;
