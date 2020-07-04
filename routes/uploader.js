const multer = require('multer');
const router = require('express').Router();

const upload = multer();
const ctrl = require('../controllers/uploader');

router.post('/upload-image', upload.single('image'), ctrl.uploadSingle);
router.post('/upload-images', upload.array('images'), ctrl.uploadMultiple);

module.exports = router;
