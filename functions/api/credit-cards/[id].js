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
  const { id } = context.params;
  const data = await getData(context.env);
  
  const card = data.creditCards.find(c => c.id === parseInt(id));
  if (!card) {
    return new Response(JSON.stringify({ code: 1, message: '信用卡不存在', data: null }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  return new Response(JSON.stringify({ code: 0, message: 'success', data: card }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPut(context) {
  const { id } = context.params;
  const newData = await context.request.json();
  const data = await getData(context.env);
  
  const index = data.creditCards.findIndex(c => c.id === parseInt(id));
  if (index === -1) {
    return new Response(JSON.stringify({ code: 1, message: '信用卡不存在', data: null }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  data.creditCards[index] = { ...data.creditCards[index], ...newData };
  await putData(context.env, data);
  
  return new Response(JSON.stringify({ code: 0, message: 'success', data: data.creditCards[index] }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestDelete(context) {
  const { id } = context.params;
  const data = await getData(context.env);
  
  const index = data.creditCards.findIndex(c => c.id === parseInt(id));
  if (index === -1) {
    return new Response(JSON.stringify({ code: 1, message: '信用卡不存在', data: null }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  data.creditCards.splice(index, 1);
  await putData(context.env, data);
  
  return new Response(JSON.stringify({ code: 0, message: 'success', data: null }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
