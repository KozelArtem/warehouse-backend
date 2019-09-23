const router = require('express').Router();
const  { needAuth } = require('../middleware/auth');


const itemCtrl = require('../controllers/item');
const itemUseCtrl = require('../controllers/itemUse');

router.get('/124', itemCtrl.getInfoByMachine);
router.get('/item', itemCtrl.getList);
router.post('/item', needAuth, itemCtrl.add);
router.put('/item', needAuth, itemCtrl.edit);

router.delete('/item/:id', needAuth, itemCtrl.remove);
router.get('/item/:id', itemCtrl.getById);

router.post('/item/:id/use', needAuth, itemUseCtrl.add);
router.delete('/item/:id/use/:useId', needAuth, itemUseCtrl.remove);

module.exports = router;
