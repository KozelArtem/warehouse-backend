const router = require('express').Router();

const machineCtrl = require('../controllers/machine');

router.get('/machine', machineCtrl.getList);

module.exports = router;
