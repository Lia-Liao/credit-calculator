const API_BASE = '/api';

class ApiClient {
  constructor(baseUrl = API_BASE) {
    this.baseUrl = baseUrl;
  }
  
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (data.code !== 0) {
        throw new Error(data.message || '请求失败');
      }
      
      return data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
  
  async getCreditCards() {
    return this.request('/credit-cards');
  }
  
  async getCreditCard(id) {
    return this.request(`/credit-cards/${id}`);
  }
  
  async createCreditCard(data) {
    return this.request('/credit-cards', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  async updateCreditCard(id, data) {
    return this.request(`/credit-cards/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  
  async deleteCreditCard(id) {
    return this.request(`/credit-cards/${id}`, {
      method: 'DELETE'
    });
  }
  
  async calculate(amount, term) {
    return this.request('/calculate', {
      method: 'POST',
      body: JSON.stringify({ amount, term })
    });
  }
}

const api = new ApiClient();
