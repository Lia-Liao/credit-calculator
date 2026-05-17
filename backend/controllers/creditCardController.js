const { CreditCard, InstallmentProduct } = require('../config/database');

const creditCardController = {
  async getAll(req, res) {
    try {
      const cards = await CreditCard.findAll({
        include: [{ model: InstallmentProduct, as: 'products' }]
      });
      res.json({ code: 0, message: 'success', data: cards });
    } catch (error) {
      res.json({ code: 1, message: error.message, data: null });
    }
  },
  
  async getOne(req, res) {
    try {
      const card = await CreditCard.findByPk(req.params.id, {
        include: [{ model: InstallmentProduct, as: 'products' }]
      });
      if (!card) {
        return res.json({ code: 1, message: '信用卡不存在', data: null });
      }
      res.json({ code: 0, message: 'success', data: card });
    } catch (error) {
      res.json({ code: 1, message: error.message, data: null });
    }
  },
  
  async create(req, res) {
    try {
      const card = await CreditCard.create(req.body);
      res.json({ code: 0, message: 'success', data: card });
    } catch (error) {
      res.json({ code: 1, message: error.message, data: null });
    }
  },
  
  async update(req, res) {
    try {
      const card = await CreditCard.findByPk(req.params.id);
      if (!card) {
        return res.json({ code: 1, message: '信用卡不存在', data: null });
      }
      await card.update(req.body);
      res.json({ code: 0, message: 'success', data: card });
    } catch (error) {
      res.json({ code: 1, message: error.message, data: null });
    }
  },
  
  async delete(req, res) {
    try {
      const card = await CreditCard.findByPk(req.params.id);
      if (!card) {
        return res.json({ code: 1, message: '信用卡不存在', data: null });
      }
      await card.destroy();
      res.json({ code: 0, message: 'success', data: null });
    } catch (error) {
      res.json({ code: 1, message: error.message, data: null });
    }
  }
};

module.exports = creditCardController;
