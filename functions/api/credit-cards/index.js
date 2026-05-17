export async function onRequestGet(context) {
  const data = await context.env.DATA_KV.get('data', { type: 'json' }) || { creditCards: [] };
  return new Response(JSON.stringify({ code: 0, message: 'success', data: data.creditCards }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function onRequestPost(context) {
  const newCard = await context.request.json();
  const data = await context.env.DATA_KV.get('data', { type: 'json' }) || { creditCards: [] };
  
  const card = {
    id: Date.now(),
    ...newCard,
    products: [],
  };
  
  data.creditCards.push(card);
  await context.env.DATA_KV.put('data', JSON.stringify(data));
  
  return new Response(JSON.stringify({ code: 0, message: 'success', data: card }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
