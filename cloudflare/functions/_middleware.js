// 直接内联数据（避免 JSON 导入问题）
const sampleData = {
  "creditCards": [
    {
      "id": 1775461018725,
      "bankName": "招商银行",
      "products": [
        {
          "id": 7,
          "productType": "bill",
          "enabled": true,
          "term": 3,
          "rate": 0,
          "minAmount": 0,
          "maxAmount": 0,
          "billAmount": 0
        },
        {
          "id": 8,
          "productType": "cash",
          "enabled": true,
          "term": 3,
          "rate": 0.1702,
          "minAmount": 1000,
          "maxAmount": 50000
        },
        {
          "id": 9,
          "productType": "cash",
          "enabled": true,
          "term": 6,
          "rate": 0.1627,
          "minAmount": 1000,
          "maxAmount": 50000
        },
        {
          "id": 10,
          "productType": "cash",
          "enabled": true,
          "term": 10,
          "rate": 0.1604,
          "minAmount": 1000,
          "maxAmount": 50000
        },
        {
          "id": 11,
          "productType": "cash",
          "enabled": true,
          "term": 12,
          "rate": 0.0308,
          "minAmount": 1000,
          "maxAmount": 50000
        },
        {
          "id": 12,
          "productType": "cash",
          "enabled": true,
          "term": 18,
          "rate": 0.0312,
          "minAmount": 1000,
          "maxAmount": 50000
        },
        {
          "id": 13,
          "productType": "cash",
          "enabled": true,
          "term": 24,
          "rate": 0.0312,
          "minAmount": 1000,
          "maxAmount": 50000
        }
      ]
    },
    {
      "id": 1775461625860,
      "bankName": "兴业银行",
      "products": [
        {
          "id": 19,
          "productType": "cash",
          "enabled": true,
          "term": 3,
          "rate": 0.1613,
          "minAmount": 1000,
          "maxAmount": 1993
        },
        {
          "id": 20,
          "productType": "cash",
          "enabled": true,
          "term": 6,
          "rate": 0.1627,
          "minAmount": 1000,
          "maxAmount": 1993
        },
        {
          "id": 21,
          "productType": "cash",
          "enabled": true,
          "term": 12,
          "rate": 0.0345,
          "minAmount": 1000,
          "maxAmount": 1993
        },
        {
          "id": 22,
          "productType": "cash",
          "enabled": true,
          "term": 18,
          "rate": 0.0349,
          "minAmount": 1000,
          "maxAmount": 1993
        },
        {
          "id": 23,
          "productType": "cash",
          "enabled": true,
          "term": 24,
          "rate": 0.0349,
          "minAmount": 1000,
          "maxAmount": 1993
        },
        {
          "id": 24,
          "productType": "bill",
          "enabled": true,
          "term": 3,
          "rate": 0.1524,
          "billAmount": 587.34,
          "minAmount": 587.34,
          "maxAmount": 587.34
        },
        {
          "id": 25,
          "productType": "bill",
          "enabled": true,
          "term": 6,
          "rate": 0.1527,
          "billAmount": 587.34,
          "minAmount": 587.34,
          "maxAmount": 587.34
        },
        {
          "id": 26,
          "productType": "bill",
          "enabled": true,
          "term": 12,
          "rate": 0.1622,
          "billAmount": 587.34,
          "minAmount": 587.34,
          "maxAmount": 587.34
        },
        {
          "id": 27,
          "productType": "bill",
          "enabled": true,
          "term": 18,
          "rate": 0.1642,
          "billAmount": 587.34,
          "minAmount": 587.34,
          "maxAmount": 587.34
        },
        {
          "id": 28,
          "productType": "bill",
          "enabled": true,
          "term": 24,
          "rate": 0.1642,
          "billAmount": 587.34,
          "minAmount": 587.34,
          "maxAmount": 587.34
        },
        {
          "id": 29,
          "productType": "bill",
          "enabled": true,
          "term": 36,
          "rate": 0.1564,
          "billAmount": 587.34,
          "minAmount": 587.34,
          "maxAmount": 587.34
        }
      ]
    },
    {
      "id": 1775476358880,
      "bankName": "广发银行",
      "products": [
        {
          "id": 15,
          "productType": "bill",
          "enabled": true,
          "term": 3,
          "rate": 0.157,
          "billAmount": 2547.7,
          "minAmount": 2547.7,
          "maxAmount": 2547.7
        },
        {
          "id": 16,
          "productType": "bill",
          "enabled": true,
          "term": 6,
          "rate": 0.1424,
          "billAmount": 2547.7,
          "minAmount": 2547.7,
          "maxAmount": 2547.7
        },
        {
          "id": 17,
          "productType": "bill",
          "enabled": true,
          "term": 12,
          "rate": 0.115,
          "billAmount": 2547.7,
          "minAmount": 2547.7,
          "maxAmount": 2547.7
        },
        {
          "id": 18,
          "productType": "bill",
          "enabled": true,
          "term": 24,
          "rate": 0.073,
          "billAmount": 2547.7,
          "minAmount": 2547.7,
          "maxAmount": 2547.7
        },
        {
          "id": 19,
          "productType": "bill",
          "enabled": true,
          "term": 36,
          "rate": 0.073,
          "billAmount": 2547.7,
          "minAmount": 2547.7,
          "maxAmount": 2547.7
        },
        {
          "id": 20,
          "productType": "bill",
          "enabled": true,
          "term": 48,
          "rate": 0.073,
          "billAmount": 2547.7,
          "minAmount": 2547.7,
          "maxAmount": 2547.7
        },
        {
          "id": 21,
          "productType": "cash",
          "enabled": true,
          "term": 6,
          "rate": 0.1528,
          "minAmount": 1000,
          "maxAmount": 50000
        },
        {
          "id": 22,
          "productType": "cash",
          "enabled": true,
          "term": 12,
          "rate": 0.1473,
          "minAmount": 1000,
          "maxAmount": 50000
        },
        {
          "id": 23,
          "productType": "cash",
          "enabled": true,
          "term": 18,
          "rate": 0.1542,
          "minAmount": 1000,
          "maxAmount": 50000
        },
        {
          "id": 24,
          "productType": "cash",
          "enabled": true,
          "term": 24,
          "rate": 0.0524,
          "minAmount": 1000,
          "maxAmount": 50000
        }
      ]
    }
  ]
};

// 存储数据在内存中（用于没有 KV 的情况）
let inMemoryData = null;

export async function onRequest(context) {
  const { request, env, next } = context;
  
  // 如果没有 KV，使用内存存储
  if (env.DATA_KV) {
    // 初始化数据（如果不存在）
    const existingData = await env.DATA_KV.get('data', { type: 'json' });
    if (!existingData) {
      await env.DATA_KV.put('data', JSON.stringify(sampleData));
    }
  } else {
    // 使用内存存储（每次部署会重置）
    if (!inMemoryData) {
      inMemoryData = JSON.parse(JSON.stringify(sampleData));
    }
  }
  
  // 添加 CORS 头
  const response = await next();
  const newResponse = new Response(response.body, response);
  newResponse.headers.set('Access-Control-Allow-Origin', '*');
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return newResponse;
}

export { sampleData, inMemoryData };
