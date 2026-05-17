import sampleData from '../backend/data/sample-data.json' assert { type: 'json' };

export async function onRequest(context) {
  const { request, env, next } = context;
  
  // 初始化数据（如果不存在）
  const existingData = await env.DATA_KV.get('data', { type: 'json' });
  if (!existingData) {
    await env.DATA_KV.put('data', JSON.stringify(sampleData));
  }
  
  // 添加 CORS 头
  const response = await next();
  const newResponse = new Response(response.body, response);
  newResponse.headers.set('Access-Control-Allow-Origin', '*');
  newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return newResponse;
}
