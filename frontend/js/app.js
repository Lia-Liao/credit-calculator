const AppState = {
  creditCards: [],
  currentTab: 'cards',
  calculateResult: null,
  loading: false
};

class App {
  constructor() {
    this.state = { ...AppState };
    this.init();
  }
  
  async init() {
    await this.loadCreditCards();
    this.bindEvents();
    this.render();
  }
  
  async loadCreditCards() {
    try {
      this.state.loading = true;
      this.state.creditCards = await api.getCreditCards();
    } catch (error) {
      console.error('加载信用卡数据失败:', error);
      alert('加载数据失败，请刷新重试');
    } finally {
      this.state.loading = false;
      this.updateStatsDisplay();
      this.renderCardsList();
    }
  }
  
  switchTab(tab) {
    this.state.currentTab = tab;
    this.renderTabs();
  }
  
  async handleCalculate() {
    const amount = parseFloat(document.getElementById('amount-input').value);
    const minTerm = parseInt(document.getElementById('min-term-input').value);
    const maxTerm = parseInt(document.getElementById('max-term-input').value);
    
    if (!amount || amount <= 0) {
      alert('请输入有效的借款金额');
      return;
    }
    
    if (minTerm > maxTerm) {
      alert('最小期数不能大于最大期数');
      return;
    }
    
    try {
      this.state.loading = true;
      const resultContainer = document.getElementById('result-container');
      resultContainer.innerHTML = '<div class="loading">计算中...</div>';
      
      this.state.calculateResult = await api.calculate(amount, minTerm, maxTerm);
      this.renderCalculateResult();
    } catch (error) {
      console.error('计算失败:', error);
      alert('计算失败，请重试');
    } finally {
      this.state.loading = false;
    }
  }
  
  getTotalBillAmount() {
    let total = 0;
    for (const card of this.state.creditCards) {
      if (card.products && card.products.length > 0) {
        const billProduct = card.products.find(p => p.productType === 'bill');
        if (billProduct && billProduct.billAmount) {
          total += Number(billProduct.billAmount);
        }
      }
    }
    return total;
  }
  
  getTotalDebt() {
    return this.getTotalBillAmount();
  }
  
  getTotalCreditCapacity() {
    let total = 0;
    for (const card of this.state.creditCards) {
      if (card.products && card.products.length > 0) {
        const cashProduct = card.products.find(p => p.productType === 'cash');
        if (cashProduct && cashProduct.maxAmount) {
          total += Number(cashProduct.maxAmount);
        }
      }
    }
    return total;
  }
  
  updateStatsDisplay() {
    const totalDebt = this.getTotalDebt();
    const totalCredit = this.getTotalCreditCapacity();
    
    const debtEl = document.getElementById('total-debt');
    const creditEl = document.getElementById('total-credit');
    
    if (debtEl) {
      debtEl.textContent = `¥${totalDebt.toFixed(2)}`;
    }
    if (creditEl) {
      creditEl.textContent = `¥${totalCredit.toFixed(2)}`;
    }
  }
  
  bindEvents() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchTab(btn.dataset.tab);
      });
    });
    
    document.getElementById('refresh-btn')?.addEventListener('click', () => {
      this.loadCreditCards();
    });
    
    document.getElementById('calculate-btn')?.addEventListener('click', () => {
      this.handleCalculate();
    });
    
    document.getElementById('fill-bill-btn')?.addEventListener('click', () => {
      const total = this.getTotalDebt();
      document.getElementById('amount-input').value = total;
    });
  }
  
  render() {
    this.renderTabs();
    this.renderCardsList();
    this.renderCalculateResult();
  }
  
  renderTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === this.state.currentTab);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.toggle('active', content.id === `${this.state.currentTab}-tab`);
    });
  }
  
  renderCardsList() {
    const container = document.getElementById('cards-container');
    if (!container) return;
    
    if (this.state.loading) {
      container.innerHTML = '<div class="loading">加载中...</div>';
      return;
    }
    
    if (this.state.creditCards.length === 0) {
      container.innerHTML = '<div class="no-result">暂无信用卡数据</div>';
      return;
    }
    
    container.innerHTML = this.state.creditCards.map(card => {
      let billAmount = null;
      let creditLimit = null;
      
      if (card.products && card.products.length > 0) {
        const billProduct = card.products.find(p => p.productType === 'bill');
        const cashProduct = card.products.find(p => p.productType === 'cash');
        
        if (billProduct) {
          billAmount = billProduct.billAmount;
        }
        if (cashProduct) {
          creditLimit = cashProduct.maxAmount;
        }
      }
      
      return `
      <div class="credit-card">
        <div class="card-header">
          <span class="bank-name">${card.bankName}</span>
        </div>
        <div class="card-body">
          ${billAmount !== null ? `
          <div class="info-item">
            <span class="label">账单出账金额</span>
            <span class="value bill-amount">¥${Number(billAmount).toFixed(2)}</span>
          </div>
          ` : ''}
          ${creditLimit !== null ? `
          <div class="info-item">
            <span class="label">现金授信额度</span>
            <span class="value credit-limit">¥${Number(creditLimit).toFixed(2)}</span>
          </div>
          ` : ''}
        </div>
      </div>
    `;
    }).join('');
  }
  
  renderCalculateResult() {
    const container = document.getElementById('result-container');
    if (!container) return;
    
    if (!this.state.calculateResult) {
      container.innerHTML = '';
      return;
    }
    
    const { options, total } = this.state.calculateResult;
    
    if (!options || options.length === 0) {
      container.innerHTML = '<div class="no-result">暂无符合条件的方案</div>';
      return;
    }
    
    // 渲染方案列表
    let optionsHtml = options.map((option, index) => `
      <div class="option-card ${index === 0 ? 'best' : ''}">
        <div class="option-header">
          <span class="option-number">${index + 1}.</span>
          <span class="option-bank">${option.bankName}</span>
          <span class="option-type">${option.productTypeName}</span>
          ${index === 0 ? '<span class="best-badge">[最优]</span>' : ''}
        </div>
        <div class="option-body">
          <div class="option-detail">
            <span class="detail-label">借款金额</span>
            <span class="detail-value">¥${Number(option.borrowAmount).toFixed(2)}</span>
          </div>
          <div class="option-detail">
            <span class="detail-label">期数</span>
            <span class="detail-value">${option.term}期</span>
          </div>
          <div class="option-detail">
            <span class="detail-label">年化利率</span>
            <span class="detail-value rate">${(option.rate * 100).toFixed(2)}%</span>
          </div>
          <div class="option-detail">
            <span class="detail-label">利息</span>
            <span class="detail-value">¥${Number(option.totalInterest).toFixed(2)}</span>
          </div>
        </div>
      </div>
    `).join('');
    
    // 渲染汇总信息
    container.innerHTML = `
      <div class="result-section">
        <h3 class="result-title">📊 最优融资方案组合</h3>
        
        <div class="options-container">
          ${optionsHtml}
        </div>
        
        <div class="total-section">
          <h4 class="total-title">📈 方案汇总</h4>
          <div class="total-details">
            <div class="total-detail">
              <span class="total-label">总借款金额</span>
              <span class="total-value">¥${Number(total.borrowAmount).toFixed(2)}</span>
            </div>
            <div class="total-detail">
              <span class="total-label">综合年化利率</span>
              <span class="total-value rate">${(total.weightedRate * 100).toFixed(2)}%</span>
            </div>
            <div class="total-detail">
              <span class="total-label">总利息</span>
              <span class="total-value">¥${Number(total.totalInterest).toFixed(2)}</span>
            </div>
            <div class="total-detail">
              <span class="total-label">总月供</span>
              <span class="total-value">¥${Number(total.totalMonthlyPayment).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
