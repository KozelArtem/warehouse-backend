const router = require('express').Router();

const ctrl = require('../controllers/itemDistribution');

const { loadItemDistribution, loadPlace } = require('../middleware/loader');

router.get('/distribution/places', ctrl.getPlaces);
router.post('/distribution/places', ctrl.createPlace);
router.put('/distribution/places/:id', loadPlace, ctrl.updatePlace);
router.delete('/distribution/places/:id', loadPlace, ctrl.removePlace);

router.get('/distribution/:id', ctrl.getInfo);
router.post('/distribution', ctrl.create);
router.put('/distribution/:id', loadItemDistribution, ctrl.update);
router.delete('/distribution/:id', loadItemDistribution, ctrl.remove);

module.exports = router;
