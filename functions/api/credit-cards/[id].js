export async function onRequestGet(context) {
  const { id } = context.params;
  const data = await context.env.DATA_KV.get('data', { type: 'json' }) || { creditCards: [] };
  
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
  const data = await context.env.DATA_KV.get('data', { type: 'json' }) || { creditCards: [] };
  
  const index = data.creditCards.findIndex(c => c.id === parseInt(id));
  if (index === -1) {
    return new Response(JSON.stringify({ code: 1, message: '信用卡不存在', data: null }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  data.creditCards[index] = { ...data.creditCards[index], ...newData };
  await context.env.DATA_KV.put('data', JSON.stringify(data));
  
  return new Response(JSON.stringify({ code: 0, message: 'success', data: data.creditCards[index] }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestDelete(context) {
  const { id } = context.params;
  const data = await context.env.DATA_KV.get('data', { type: 'json' }) || { creditCards: [] };
  
  const index = data.creditCards.findIndex(c => c.id === parseInt(id));
  if (index === -1) {
    return new Response(JSON.stringify({ code: 1, message: '信用卡不存在', data: null }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  data.creditCards.splice(index, 1);
  await context.env.DATA_KV.put('data', JSON.stringify(data));
  
  return new Response(JSON.stringify({ code: 0, message: 'success', data: null }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
