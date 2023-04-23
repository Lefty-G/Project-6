const express = require('express');
const router = express.Router();

const stuffCtrl = require('../controllers/stuff');

router.post('/', stuffCtrl.createThing);
router.get('/:id', stuffCtrl.getOneThing);
router.get('/', stuffCtrl.getAllThings);
router.put('/:id', stuffCtrl.modifyThing);
router.delete('/:id', stuffCtrl.deleteThing);

module.exports = router;
