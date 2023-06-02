const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/sauce');

router.get('/', auth, sauceCtrl.findAll);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, multer, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.updateSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;