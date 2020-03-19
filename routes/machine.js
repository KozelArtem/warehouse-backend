const { Router } = require('express');

const { loadMachine, loadMachineService  } = require('../middleware/loader')
const ctrl = require('../controllers/machine');

const router = Router();

router.get('/machines', ctrl.getList);
router.get('/machines/:id', ctrl.show);
router.get('/machines/:id/services', ctrl.getServiceList);

router.post('/machines/:machineId/services', ctrl.createService);
router.put(
    '/machines/:machineId/services/:id',
    loadMachineService,
    ctrl.updateService
);
router.delete(
    '/machines/:machineId/services/:id',
    loadMachineService,
    ctrl.destroyService
);

router.post('/machines', ctrl.create);
router.put('/machines/:id', loadMachine, ctrl.update);
router.delete('/machines/:id', loadMachine, ctrl.destroy);

module.exports = router;
