const { Router } = require('express');

const { loadRepairItem  } = require('../middleware/loader')
const ctrl = require('../controllers/repairItem');

const router = Router();

router.get('/repairItems', ctrl.getList);
router.get('/repairItems/:id', ctrl.show);

router.post('/repairItems', ctrl.create);
router.put('/repairItems/:id', loadRepairItem, ctrl.update);
router.delete('/repairItems/:id', loadRepairItem, ctrl.destroy);

module.exports = router;
