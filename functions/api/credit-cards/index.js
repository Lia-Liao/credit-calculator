import { sampleData, inMemoryData } from '../../_middleware.js';

async function getData(env) {
  if (env.DATA_KV) {
    return await env.DATA_KV.get('data', { type: 'json' }) || sampleData;
  } else {
    return inMemoryData || sampleData;
  }
}

async function putData(env, data) {
  if (env.DATA_KV) {
    await env.DATA_KV.put('data', JSON.stringify(data));
  } else {
    // 更新内存数据
    const { inMemoryData: memData } = await import('../../_middleware.js');
    Object.assign(memData, data);
  }
}

export async function onRequestGet(context) {
  const data = await getData(context.env);
  return new Response(JSON.stringify({ code: 0, message: 'success', data: data.creditCards }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context) {
  const newCard = await context.request.json();
  const data = await getData(context.env);
  
  const card = {
    id: Date.now(),
    ...newCard,
    products: [],
  };
  
  data.creditCards.push(card);
  await putData(context.env, data);
  
  return new Response(JSON.stringify({ code: 0, message: 'success', data: card }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
