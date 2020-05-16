const router = require('express').Router();

const { loadCompany, loadCompanyPhones } = require('../middleware/loader');

const ctrl = require('../controllers/company');

router.get('/companies', ctrl.getCompanyList);

router.get('/companies/:companyId', ctrl.getCompanyInfo);
router.post('/companies/', ctrl.create);
router.put('/companies/:companyId', loadCompany, loadCompanyPhones, ctrl.update);
router.delete('/companies/:companyId', loadCompany, ctrl.remove);

module.exports = router;
