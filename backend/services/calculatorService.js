const { CreditCard, InstallmentProduct } = require('../config/database');

class CalculatorService {
  static calculateEqualPayment(principal, annualRate, term) {
    const monthlyRate = annualRate / 12;
    const monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, term) / 
                           (Math.pow(1 + monthlyRate, term) - 1);
    const totalPayment = monthlyPayment * term;
    const totalInterest = totalPayment - principal;
    
    return {
      principal,
      annualRate,
      term,
      monthlyRate,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalCost: Math.round(totalInterest * 100) / 100
    };
  }
  
  static async findBestOption(needAmount, minTerm, maxTerm) {
    const creditCards = await CreditCard.findAll({
      include: [{
        model: InstallmentProduct,
        as: 'products'
      }]
    });
    
    const candidates = [];
    
    for (const card of creditCards) {
      for (const product of card.products) {
        if (!product.enabled) continue;
        
        let isAmountValid = false;
        if (product.productType === 'cash') {
          isAmountValid = Number(card.creditLimit) >= needAmount;
        } else if (product.productType === 'bill') {
          isAmountValid = Number(card.billAmount) >= needAmount;
        }
        
        if (!isAmountValid) continue;
        
        if (product.term < minTerm || product.term > maxTerm) continue;
        
        if (needAmount < Number(product.minAmount) || needAmount > Number(product.maxAmount)) continue;
        
        const costResult = this.calculateEqualPayment(needAmount, Number(product.rate), product.term);
        
        candidates.push({
          creditCardId: card.id,
          bankName: card.bankName,
          productType: product.productType,
          productTypeName: product.productType === 'bill' ? '账单分期' : '现金分期',
          term: product.term,
          rate: Number(product.rate),
          ...costResult
        });
      }
    }
    
    candidates.sort((a, b) => a.rate - b.rate);
    
    return {
      bestOption: candidates.length > 0 ? candidates[0] : null,
      allOptions: candidates
    };
  }
}

module.exports = CalculatorService;
