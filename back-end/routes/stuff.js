const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require ('../middleware/multer-config');

const stuffCtrl = require('../controllers/stuff');

router.post('/', auth, stuffCtrl.createThing);
router.get('/:id', auth, multer, stuffCtrl.getOneThing);
router.get('/', auth, stuffCtrl.getAllThings);
router.put('/:id', auth, multer, stuffCtrl.modifyThing);
router.delete('/:id', auth, stuffCtrl.deleteThing);


module.exports = router;
