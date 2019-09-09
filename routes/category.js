const router = require('express').Router();

const categoryCtrl = require('../controllers/category');

router.get('/', categoryCtrl.getAll);
router.post('/', categoryCtrl.add);
router.get('/:id', categoryCtrl.getItemsByCategory);



// router.get('/:id', categoryCtrl.getById);

module.exports = router;
