const fs = require('fs');
const path = require('path');
const router = require('express').Router();

const { requireAuth, requireAdmin } = require('../middleware/auth');
const authCtrl = require('../controllers/auth');

router.post('/login', authCtrl.login);

router.all('*', requireAuth)
router.post('*', requireAdmin);
router.put('*', requireAdmin);
router.delete('*', requireAdmin);

const scanRoutersIn = (dir, skipList = []) => {
  return fs.readdirSync(dir)
    .map(file => path.join(dir, file))
    .filter(file => fs.statSync(file).isFile())
    .filter(file => file !== module.filename)
    .filter(file => !skipList.map(re => re.test(file)).find(x => x))
    .map(file => require(file))
    .filter(x => !!x);
}

router.use('/', scanRoutersIn(__dirname));

module.exports = router;
