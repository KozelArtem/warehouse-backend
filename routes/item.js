const router = require('express').Router();

const ctrl = require('../controllers/item');

const { loadItem } = require('../middleware/loader');

router.get('/items', ctrl.getList);
router.get('/items/list', ctrl.getList);
router.get('/items/search', ctrl.search);
router.get('/items/check', ctrl.checkName);
router.post('/items', ctrl.create);
router.put('/items/:itemId', loadItem, ctrl.update)
router.delete('/items/:itemId', loadItem, ctrl.remove);

router.get('/items/:itemId', ctrl.getById);
router.get('/items/:itemId/short', ctrl.getShortInfoById);

module.exports = router;
