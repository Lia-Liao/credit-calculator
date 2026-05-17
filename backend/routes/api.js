const express = require('express');
const router = express.Router();

const creditCardsRouter = require('./creditCards');
const installmentProductsRouter = require('./installmentProducts');
const calculateRouter = require('./calculate');
const installmentProductController = require('../controllers/installmentProductController');

router.use('/credit-cards', creditCardsRouter);
router.use('/credit-cards/:creditCardId/products', installmentProductsRouter);
router.put('/installment-products/:id', installmentProductController.update);
router.delete('/installment-products/:id', installmentProductController.delete);
router.use('/calculate', calculateRouter);

module.exports = router;
