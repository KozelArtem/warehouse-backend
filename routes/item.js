const router = require('express').Router();

const ctrl = require('../controllers/item');

const { loadItem } = require('../middleware/loader');

router.get('/item', ctrl.getList);
router.get('/item/list', ctrl.getList);
router.get('/item/search', ctrl.search);
router.post('/item', ctrl.create);
router.put('/item/:itemId', loadItem, ctrl.update)
router.delete('/item/:itemId', loadItem, ctrl.remove);

router.get('/item/:itemId', ctrl.getById);
router.get('/item/:itemId/short', ctrl.getShortInfoById);

module.exports = router;
