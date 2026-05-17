const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/admin', express.static(path.join(__dirname, '../admin')));

const DATA_FILE = path.join(__dirname, './data/data.json');
const SAMPLE_DATA_FILE = path.join(__dirname, './data/sample-data.json');

let data = null;

function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    const rawData = fs.readFileSync(DATA_FILE, 'utf8');
    data = JSON.parse(rawData);
  } else {
    const rawData = fs.readFileSync(SAMPLE_DATA_FILE, 'utf8');
    data = JSON.parse(rawData);
    saveData();
  }
}

function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

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
    totalCost: Math.round(totalInterest * 100) / 100
  };
}

app.get('/api/credit-cards', (req, res) => {
  res.json({ code: 0, message: 'success', data: data.creditCards });
});

app.get('/api/credit-cards/:id', (req, res) => {
  const card = data.creditCards.find(c => c.id === parseInt(req.params.id));
  if (!card) {
    return res.json({ code: 1, message: '信用卡不存在', data: null });
  }
  res.json({ code: 0, message: 'success', data: card });
});

app.post('/api/credit-cards', (req, res) => {
  const newCard = {
    id: Date.now(),
    ...req.body,
    products: []
  };
  data.creditCards.push(newCard);
  saveData();
  res.json({ code: 0, message: 'success', data: newCard });
});

app.put('/api/credit-cards/:id', (req, res) => {
  const index = data.creditCards.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.json({ code: 1, message: '信用卡不存在', data: null });
  }
  // 直接替换整个对象，不是合并
  data.creditCards[index] = {
    ...data.creditCards[index],
    ...req.body
  };
  saveData();
  res.json({ code: 0, message: 'success', data: data.creditCards[index] });
});

app.delete('/api/credit-cards/:id', (req, res) => {
  const index = data.creditCards.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return res.json({ code: 1, message: '信用卡不存在', data: null });
  }
  data.creditCards.splice(index, 1);
  saveData();
  res.json({ code: 0, message: 'success', data: null });
});

app.post('/api/calculate', (req, res) => {
  const { amount, minTerm, maxTerm } = req.body;
  
  if (!amount || !minTerm || !maxTerm) {
    return res.json({ code: 1, message: '请填写完整的计算参数', data: null });
  }
  
  // 1. 筛选符合期数条件的所有产品
  const validProducts = [];
  for (const card of data.creditCards) {
    for (const product of card.products) {
      if (!product.enabled) continue;
      
      // 检查期数范围
      if (product.term < minTerm || product.term > maxTerm) continue;
      
      validProducts.push({
        ...product,
        creditCardId: card.id,
        bankName: card.bankName
      });
    }
  }
  
  // 2. 按年化利率从低到高排序
  validProducts.sort((a, b) => a.rate - b.rate);
  
  // 3. 依次匹配，凑够总借款金额
  let remainingAmount = amount;
  const selectedOptions = [];
  
  for (const product of validProducts) {
    if (remainingAmount <= 0) break;
    
    // 确定该产品可借的金额
    let borrowAmount = 0;
    if (product.productType === 'bill') {
      // 账单分期：只能借固定的账单金额
      borrowAmount = Math.min(Number(product.billAmount), remainingAmount);
    } else {
      // 现金分期：可以在 minAmount ~ maxAmount 范围内借
      borrowAmount = Math.min(Number(product.maxAmount), remainingAmount);
      // 不低于最低借款金额
      if (borrowAmount < Number(product.minAmount)) {
        continue;
      }
    }
    
    if (borrowAmount <= 0) continue;
    
    // 计算该产品的成本
    const costResult = calculateEqualPayment(borrowAmount, Number(product.rate), product.term);
    
    selectedOptions.push({
      creditCardId: product.creditCardId,
      bankName: product.bankName,
      productType: product.productType,
      productTypeName: product.productType === 'bill' ? '账单分期' : '现金分期',
      term: product.term,
      rate: Number(product.rate),
      borrowAmount: borrowAmount,
      ...costResult
    });
    
    remainingAmount -= borrowAmount;
  }
  
  // 4. 计算汇总信息
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
  
  res.json({
    code: 0,
    message: 'success',
    data: {
      options: selectedOptions,
      total: {
        borrowAmount: totalBorrowAmount,
        weightedRate: weightedRate,
        totalInterest: totalInterest,
        totalMonthlyPayment: totalMonthlyPayment
      }
    }
  });
});

loadData();

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});
