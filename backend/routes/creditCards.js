const express = require('express');
const router = express.Router();
const creditCardController = require('../controllers/creditCardController');

router.get('/', creditCardController.getAll);
router.get('/:id', creditCardController.getOne);
router.post('/', creditCardController.create);
router.put('/:id', creditCardController.update);
router.delete('/:id', creditCardController.delete);

module.exports = router;
