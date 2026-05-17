const CalculatorService = require('../services/calculatorService');

const calculatorController = {
  async calculate(req, res) {
    try {
      const { amount, minTerm, maxTerm } = req.body;
      
      if (!amount || !minTerm || !maxTerm) {
        return res.json({ code: 1, message: '请填写完整的计算参数', data: null });
      }
      
      const result = await CalculatorService.findBestOption(
        Number(amount),
        Number(minTerm),
        Number(maxTerm)
      );
      
      res.json({ code: 0, message: 'success', data: result });
    } catch (error) {
      res.json({ code: 1, message: error.message, data: null });
    }
  }
};

module.exports = calculatorController;
