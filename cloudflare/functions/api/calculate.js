import { sampleData, inMemoryData } from '../_middleware.js';

async function getData(env) {
  if (env.DATA_KV) {
    return await env.DATA_KV.get('data', { type: 'json' }) || sampleData;
  } else {
    return inMemoryData || sampleData;
  }
}

function calculateEqualPayment(principal, annualRate, term) {
  let monthlyPayment, totalPayment, totalInterest;
  
  if (annualRate === 0) {
    monthlyPayment = principal / term;
    totalPayment = principal;
    totalInterest = 0;
  } else {
    const monthlyRate = annualRate / 12;
    monthlyPayment = principal * monthlyRate * Math.pow(1 + monthlyRate, term) / 
                   (Math.pow(1 + monthlyRate, term) - 1);
    totalPayment = monthlyPayment * term;
    totalInterest = totalPayment - principal;
  }
  
  return {
    principal,
    annualRate,
    term,
    monthlyRate: annualRate / 12,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalCost: Math.round(totalInterest * 100) / 100,
  };
}

export async function onRequestPost(context) {
  const { amount, term } = await context.request.json();
  
  if (!amount || !term) {
    return new Response(JSON.stringify({ code: 1, message: '请填写完整的计算参数', data: null }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  const data = await getData(context.env);
  
  // 筛选符合条件的产品
  const validProducts = [];
  for (const card of data.creditCards) {
    for (const product of card.products) {
      if (!product.enabled) continue;
      if (product.term !== term) continue;
      
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
