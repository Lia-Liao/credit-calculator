function calculateEqualPayment(principal, annualRate, term) {
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
    totalCost: Math.round(totalInterest * 100) / 100,
  };
}

export async function onRequestPost(context) {
  const { amount, minTerm, maxTerm } = await context.request.json();
  
  if (!amount || !minTerm || !maxTerm) {
    return new Response(JSON.stringify({ code: 1, message: '请填写完整的计算参数', data: null }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  const data = await context.env.DATA_KV.get('data', { type: 'json' }) || { creditCards: [] };
  
  // 筛选符合条件的产品
  const validProducts = [];
  for (const card of data.creditCards) {
    for (const product of card.products) {
      if (!product.enabled) continue;
      if (product.term < minTerm || product.term > maxTerm) continue;
      
      validProducts.push({
        ...product,
        creditCardId: card.id,
        bankName: card.bankName,
      });
    }
  }
  
  // 按利率排序
  validProducts.sort((a, b) => a.rate - b.rate);
  
  // 组合方案
  let remainingAmount = amount;
  const selectedOptions = [];
  
  for (const product of validProducts) {
    if (remainingAmount <= 0) break;
    
    let borrowAmount = 0;
    if (product.productType === 'bill') {
      borrowAmount = Math.min(Number(product.billAmount), remainingAmount);
    } else {
      borrowAmount = Math.min(Number(product.maxAmount), remainingAmount);
      if (borrowAmount < Number(product.minAmount)) {
        continue;
      }
    }
    
    if (borrowAmount <= 0) continue;
    
    const costResult = calculateEqualPayment(borrowAmount, Number(product.rate), product.term);
    selectedOptions.push({
      creditCardId: product.creditCardId,
      bankName: product.bankName,
      productType: product.productType,
      productTypeName: product.productType === 'bill' ? '账单分期' : '现金分期',
      term: product.term,
      rate: Number(product.rate),
      borrowAmount: borrowAmount,
      ...costResult,
    });
    
    remainingAmount -= borrowAmount;
  }
  
  // 计算汇总
  let totalBorrowAmount = 0;
  let totalInterest = 0;
  let totalMonthlyPayment = 0;
  let weightedRateSum = 0;
  
  for (const option of selectedOptions) {
    totalBorrowAmount += option.borrowAmount;
    totalInterest += option.totalInterest;
    totalMonthlyPayment += option.monthlyPayment;
    weightedRateSum += option.rate * option.borrowAmount;
  }
  
  const weightedRate = totalBorrowAmount > 0 ? weightedRateSum / totalBorrowAmount : 0;
  
  return new Response(JSON.stringify({
    code: 0,
    message: 'success',
    data: {
      options: selectedOptions,
      total: {
        borrowAmount: totalBorrowAmount,
        weightedRate: weightedRate,
        totalInterest: totalInterest,
        totalMonthlyPayment: totalMonthlyPayment,
      },
    },
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
