const router = require('express').Router();

const ctrl = require('../controllers/worker');

router.get('/workers', ctrl.getList);

module.exports = router;
