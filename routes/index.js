const router = require('express').Router();

const category = require('./category');
const item = require('./item');

router.use('/category', category);
router.use('/', item);

module.exports = router;
