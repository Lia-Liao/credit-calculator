const express = require('express');
const router = express.Router({ mergeParams: true });
const installmentProductController = require('../controllers/installmentProductController');

router.get('/', installmentProductController.getAll);
router.post('/', installmentProductController.create);

module.exports = router;
