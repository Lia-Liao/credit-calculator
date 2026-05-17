const { InstallmentProduct } = require('../config/database');

const installmentProductController = {
  async getAll(req, res) {
    try {
      const products = await InstallmentProduct.findAll({
        where: { creditCardId: req.params.creditCardId }
      });
      res.json({ code: 0, message: 'success', data: products });
    } catch (error) {
      res.json({ code: 1, message: error.message, data: null });
    }
  },
  
  async create(req, res) {
    try {
      const product = await InstallmentProduct.create({
        creditCardId: req.params.creditCardId,
        ...req.body
      });
      res.json({ code: 0, message: 'success', data: product });
    } catch (error) {
      res.json({ code: 1, message: error.message, data: null });
    }
  },
  
  async update(req, res) {
    try {
      const product = await InstallmentProduct.findByPk(req.params.id);
      if (!product) {
        return res.json({ code: 1, message: '分期产品不存在', data: null });
      }
      await product.update(req.body);
      res.json({ code: 0, message: 'success', data: product });
    } catch (error) {
      res.json({ code: 1, message: error.message, data: null });
    }
  },
  
  async delete(req, res) {
    try {
      const product = await InstallmentProduct.findByPk(req.params.id);
      if (!product) {
        return res.json({ code: 1, message: '分期产品不存在', data: null });
      }
      await product.destroy();
      res.json({ code: 0, message: 'success', data: null });
    } catch (error) {
      res.json({ code: 1, message: error.message, data: null });
    }
  }
};

module.exports = installmentProductController;
