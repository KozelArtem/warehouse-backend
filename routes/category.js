const router = require('express').Router();

const  { needAuth } = require('../middleware/auth');

const categoryCtrl = require('../controllers/category');

router.get('/', categoryCtrl.getAll);
router.post('/', needAuth, categoryCtrl.add);
router.get('/:id', categoryCtrl.getItemsByCategory);

module.exports = router;
