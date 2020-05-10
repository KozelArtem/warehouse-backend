const router = require('express').Router();

const ctrl = require('../controllers/itemDistribution');

const { loadItemDistribution } = require('../middleware/loader');

router.get('/distribution/places', ctrl.getPlaces);
router.post('/distribution/places', ctrl.createPlace);

router.get('/distribution/:id', ctrl.getInfo);
router.post('/distribution', ctrl.create);
router.put('/distribution/:id', loadItemDistribution, ctrl.update);
router.delete('/distribution/:id', loadItemDistribution, ctrl.remove);

module.exports = router;
