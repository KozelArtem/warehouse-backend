const router = require('express').Router();

const ctrl = require('../controllers/itemDistribution');

const { loadItemDistribution } = require('../middleware/loader');

router.get('/item/:itemId/distribution/:id', ctrl.getInfo);
router.post('/item/:itemId/distribution', ctrl.create);
router.put('/item/:itemId/distribution/:id', loadItemDistribution, ctrl.update);

router.delete('/item/:itemId/distribution/:id', loadItemDistribution, ctrl.remove);

router.get('/distribution/places', ctrl.getPlaces);
router.post('/distribution/places', ctrl.createPlace);

router.get('/distribution/places/:placeId/service', ctrl.getPlaceServices);
router.post('/distribution/places/:placeId/service', ctrl.createPlaceService);
router.put('/distribution/places/:placeId/service/:id', ctrl.updatePlaceService);
router.delete('/distribution/places/:placeId/service/:id', ctrl.removePlaceService);

module.exports = router;
