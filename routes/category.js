const router = require('express').Router();

const { loadCategory } = require('../middleware/loader');

const ctrl = require('../controllers/category');

router.get('/category', ctrl.getBaseCategories);
router.get('/category/list', ctrl.getAllCategories);
router.get('/category/:categoryId', loadCategory, ctrl.getCategoryInfo);

router.post('/category', ctrl.create);
router.put('/category/:categoryId', loadCategory, ctrl.update);
router.delete('/category/:categoryId', loadCategory, ctrl.remove);

module.exports = router;
