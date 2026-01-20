const OPENAI_MODEL = 'gpt-3.5-turbo';

const localRecommend = (preference, products) => {
  const query = preference.toLowerCase();
  const byBudget = products.filter((item) => query.includes('$')
    ? item.price <= parseBudget(query)
    : false);

  const byCategory = products.filter((item) =>
    query.includes(item.category.toLowerCase()),
  );

  const combined = [...new Set([...byBudget, ...byCategory])];
  if (combined.length > 0) {
    return combined.slice(0, 3);
  }

  // Default: take top 3 mid-price items as a safe fallback
  const sorted = [...products].sort((a, b) => a.price - b.price);
  return sorted.slice(0, 3);
};

const parseBudget = (text) => {
  const match = text.match(/(\d{2,5})/);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
};

const extractMatches = (message, products) => {
  const lower = message.toLowerCase();
  const hits = products.filter((p) => lower.includes(p.name.toLowerCase()));
  if (hits.length > 0) return hits.slice(0, 3);
  return localRecommend(message, products);
};

export async function getRecommendations(preference, products) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY; //api import here from the .env file 

  if (!apiKey) {
    return {
      source: 'local',
      items: localRecommend(preference, products),
    };
  }

  try {
    const systemPrompt =
      'You are a helpful shopping assistant. Suggest up to three products from the provided catalog that match the user preference. Only mention product names from the catalog.';

    const userPrompt = `Catalog: ${products
      .map((p) => `${p.name} ($${p.price}, ${p.category}): ${p.description}`)
      .join('; ')}. User preference: ${preference}. Respond with a short list of products.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI error ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message?.content ?? '';

    return {
      source: 'openai',
      items: extractMatches(message, products),
      raw: message,
    };
  } catch (error) {
    console.warn('Falling back to local recommendations', error);
    return {
      source: 'local-fallback',
      items: localRecommend(preference, products),
    };
  }
}
