const router = require('express').Router();

const { loadCompany, loadCompanyPhones } = require('../middleware/loader');

const ctrl = require('../controllers/company');

router.get('/company/list', ctrl.getShortCompanyList);
router.get('/company/list/items', ctrl.getCompaniesWithItems);

router.get('/company/:companyId', ctrl.getCompanyInfo);
router.post('/company/', ctrl.create);
router.put('/company/:companyId', loadCompany, loadCompanyPhones, ctrl.update);
router.delete('/company/:companyId', loadCompany, ctrl.remove);

module.exports = router;
