const router = require('express').Router();

const { loadCategory } = require('../middleware/loader');

const ctrl = require('../controllers/category');

router.get('/categories', ctrl.getAllCategories);
router.get('/categories/:categoryId', loadCategory, ctrl.getCategoryInfo);

router.post('/categories', ctrl.create);
router.put('/categories/:categoryId', loadCategory, ctrl.update);
router.delete('/categories/:categoryId', loadCategory, ctrl.remove);

module.exports = router;
