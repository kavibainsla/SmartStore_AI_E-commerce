import OpenAI from 'openai';
import { config } from '../config/env.js';

let openaiClient = null;

export const getActiveProvider = () => {
  if (config.aiProvider === 'gemini' && config.geminiApiKey) return 'gemini';
  if (config.aiProvider === 'openai' && config.openaiApiKey) return 'openai';
  if (config.geminiApiKey) return 'gemini';
  if (config.openaiApiKey) return 'openai';
  return 'mock';
};

const getOpenAI = () => {
  if (!config.openaiApiKey) throw new Error('OPENAI_API_KEY is not configured');
  if (!openaiClient) openaiClient = new OpenAI({ apiKey: config.openaiApiKey });
  return openaiClient;
};

/** Google Gemini via REST API (no extra npm package required) */
const generateWithGemini = async (systemPrompt, userPrompt, maxTokens = 2048, useSearch = false) => {
  if (!config.geminiApiKey) throw new Error('GEMINI_API_KEY is not configured');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel}:generateContent?key=${config.geminiApiKey}`;
  const prompt = `${systemPrompt}\n\n---\n\n${userPrompt}`;

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: useSearch ? 0.2 : 0.7,
    },
  };

  if (useSearch) {
    body.tools = [{ googleSearch: {} }];
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || `Gemini API error (${response.status})`);
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
};

const generateWithOpenAI = async (systemPrompt, userPrompt, maxTokens = 2048) => {
  const client = getOpenAI();
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    max_tokens: maxTokens,
    temperature: 0.7,
  });
  return response.choices[0]?.message?.content?.trim() || '';
};

export const generateText = async (systemPrompt, userPrompt, maxTokens = 2048, useSearch = false) => {
  const provider = getActiveProvider();
  if (provider === 'gemini') return { text: await generateWithGemini(systemPrompt, userPrompt, maxTokens, useSearch), provider };
  if (provider === 'openai') return { text: await generateWithOpenAI(systemPrompt, userPrompt, maxTokens), provider };
  throw new Error('No AI provider configured');
};

const parseJsonFromText = (text) => {
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Failed to parse AI JSON response');
  }
};

// ─── Content generators ───────────────────────────────────────────

export const generateProductDescription = async (data) => {
  const { text } = await generateText(
    'You are an expert e-commerce copywriter. Write detailed, persuasive product descriptions.',
    `Write a comprehensive product description (200-300 words) for:
Name: ${data.name}
Category: ${data.category}
Price: $${data.price}
${data.features ? `Features: ${data.features}` : ''}
${data.description ? `Existing info: ${data.description}` : ''}
Include benefits, use cases, and why customers should buy. Return only the description.`
  );
  return text;
};

export const generateTags = async (data) => {
  const { text } = await generateText(
    'You are an SEO specialist. Return ONLY comma-separated keywords, no numbering or bullets.',
    `Generate 10-15 SEO keywords/tags for:
Name: ${data.name}
Category: ${data.category}
Description: ${data.description || 'N/A'}`
  );
  return text.split(',').map((t) => t.trim()).filter(Boolean);
};

export const generateCaption = async (data) => {
  const { text } = await generateText(
    'You are a marketing copywriter for e-commerce brands.',
    `Write a catchy marketing caption (3-4 sentences) for:
Product: ${data.name}
Category: ${data.category}
Price: $${data.price}`
  );
  return text;
};

export const generateAdCopy = async (data) => {
  const { text } = await generateText(
    'You write short, punchy digital ad copy.',
    `Write short ad copy (max 60 words) for:
Product: ${data.name}
Category: ${data.category}
Price: $${data.price}`
  );
  return text;
};

export const generateSocialPromo = async (data) => {
  const { text } = await generateText(
    'You write engaging social media posts with emojis and hashtags.',
    `Write Instagram/Twitter promotional post for:
Product: ${data.name}
Category: ${data.category}
Price: $${data.price}
Include hashtags at the end.`
  );
  return text;
};

export const generateSalesInsights = async (businessData) => {
  const { text } = await generateText(
    'You are a senior e-commerce analyst. Provide detailed, actionable business insights in markdown.',
    `Analyze this store data thoroughly and give comprehensive recommendations:

${JSON.stringify(businessData, null, 2)}

Use these markdown sections with detailed bullet points under each:
## Executive Summary
## Pricing Recommendations
## Trending Product Suggestions
## Low-Performing Product Analysis
## Inventory Restock Suggestions
## Marketing & Growth Recommendations
## Sales Optimization Strategies
## Risk Alerts

Be specific with numbers from the data where possible.`
  , 4096);
  return text;
};

/** Full product intelligence pack — description, SEO, marketing, audience, features */
export const generateFullProductInfo = async (data) => {
  const { text } = await generateText(
    'You are an e-commerce AI expert. Return ONLY valid JSON, no markdown fences.',
    `Generate complete product intelligence for an online store.

Product:
- Name: ${data.name}
- Category: ${data.category}
- Price: $${data.price}
- Stock: ${data.stock ?? 'unknown'}
- Existing description: ${data.description || 'none'}

Return JSON with exactly these keys:
{
  "description": "200-300 word product description",
  "tags": ["seo", "keywords", "array"],
  "marketingCaption": "3-4 sentence marketing caption",
  "adCopy": "short ad copy under 60 words",
  "socialPromo": "social post with emojis and hashtags",
  "seoTitle": "SEO page title under 60 chars",
  "metaDescription": "meta description 150-160 chars",
  "keyFeatures": ["feature 1", "feature 2", "at least 5 features"],
  "targetAudience": "who should buy this product",
  "pricingStrategy": "pricing recommendation and positioning",
  "competitorTips": "how to compete in this category",
  "imageSuggestions": "what product image should show",
  "seasonalPromotion": "best promotion ideas"
}`
  , 4096);

  return parseJsonFromText(text);
};

// ─── Mock fallbacks ───────────────────────────────────────────────

export const fetchRealProductData = async (query) => {
  const { text } = await generateText(
    'You are an expert e-commerce product crawler and researcher. Your job is to search the web for actual, real-world product information based on a search query. Retrieve real specifications, standard manufacturer descriptions, actual retail prices, and standard categorization. You MUST return ONLY valid JSON, no markdown fences.',
    `Search the web for real-world details about: "${query}"

Return a JSON object with exactly these keys and real data:
{
  "name": "Correct, clean real-world brand name and model (e.g. Sony WH-1000XM5 Wireless Headphones)",
  "category": "The standard e-commerce category (e.g. Electronics, Home & Kitchen, Sports & Outdoors)",
  "price": 299.99 (the actual average retail price in USD as a float number),
  "description": "A professional, accurate, and appealing product description (150-250 words) based on actual manufacturer data and key selling points",
  "tags": ["array", "of", "10", "standard", "seo", "tags", "matching", "this", "product"],
  "stock": 50,
  "keyFeatures": ["Actual specifications and real features of this product (at least 5 items)"],
  "imageSuggestions": "Detailed description of what the official product photo looks like (e.g. Studio shot of black headphones at a 45-degree angle)"
}`,
    4096,
    true // enable Google Search Grounding!
  );

  return parseJsonFromText(text);
};

// ─── Mock fallbacks ───────────────────────────────────────────────

export const mockAIResponse = (type, data) => {
  const mocks = {
    description: `Introducing ${data.name} — a premium ${data.category} product crafted for quality and value. Ideal for customers who want reliability at $${data.price}. Features excellent build quality, great customer reviews potential, and strong market fit in the ${data.category} segment.`,
    tags: [data.category, data.name?.split(' ')[0], 'premium', 'bestseller', 'new arrival', 'trending', 'quality', 'shop now', 'ecommerce', 'deal'].filter(Boolean),
    caption: `Discover ${data.name}! Premium ${data.category} at just $${data.price}. Elevate your lifestyle today — limited stock available!`,
    adCopy: `${data.name} — ${data.category} excellence. Only $${data.price}. Shop SmartStore AI now!`,
    socialPromo: `✨ New arrival: ${data.name}! Premium ${data.category} for $${data.price}. Tap the link in bio! #${(data.category || 'shop').replace(/\s/g, '')} #SmartStore #Deals`,
    insights: `## Executive Summary\nStore has ${data.totalProducts || 'multiple'} products with revenue opportunities.\n\n## Pricing Recommendations\nReview margin on top sellers; test bundle pricing.\n\n## Trending Products\nFocus marketing on ${data.category || 'top'} category.\n\n## Low-Performing Products\nImprove descriptions and images for inactive SKUs.\n\n## Inventory Restock\nRestock low inventory items (${data.lowStockCount || 0} alerts).\n\n## Growth\nRun email campaigns and social ads for best sellers.`,
    realProduct: {
      name: `${data.name} (Premium Edition)`,
      category: data.category || 'Electronics',
      price: data.price || 149.99,
      description: `This is a premium, grounded real-world product description for "${data.name}". Exceptionally built with advanced capabilities and designed to blend performance and style. It is the perfect choice for anyone looking for standard-setting reliability in the ${data.category} space.`,
      tags: [data.category || 'Electronics', 'premium', 'high-tech', 'reliable', 'top-rated', 'featured'],
      stock: 50,
      keyFeatures: [
        'Built with premium industry-grade materials',
        'State-of-the-art intelligent processing technology',
        'Enhanced energy efficiency and battery life',
        'Sleek modern aesthetics and ergonomic footprint',
        'Fully covered by 2-year manufacturer warranty'
      ],
      imageSuggestions: 'Official product press shot on an elegant light-grey studio background.'
    },
    fullInfo: {
      description: `Introducing ${data.name} — premium ${data.category} at $${data.price}.`,
      tags: [data.category, 'premium', 'bestseller', 'trending'],
      marketingCaption: `Discover ${data.name} today!`,
      adCopy: `${data.name} — only $${data.price}!`,
      socialPromo: `✨ ${data.name} now available! #SmartStore`,
      seoTitle: `${data.name} | ${data.category} | SmartStore AI`,
      metaDescription: `Buy ${data.name} online. Premium ${data.category} at $${data.price}. Fast delivery.`,
      keyFeatures: ['High quality', 'Great value', 'Popular category', 'Customer favorite', 'Easy to use'],
      targetAudience: `Shoppers interested in ${data.category} products`,
      pricingStrategy: `Position at $${data.price} as mid-premium in ${data.category}`,
      competitorTips: 'Highlight unique value and fast shipping',
      imageSuggestions: 'Clean white background with product hero shot',
      seasonalPromotion: 'Flash sale weekends and holiday bundles',
    },
  };
  return mocks[type] || mocks.insights;
};

export const safeAI = async (fn, fallbackType, data) => {
  const provider = getActiveProvider();

  if (provider === 'mock') {
    const content = mockAIResponse(fallbackType, data);
    return { content, mock: true, provider: 'mock' };
  }

  try {
    const content = await fn();
    return { content, mock: false, provider };
  } catch (err) {
    console.error(`AI error (${provider}):`, err.message);
    return {
      content: mockAIResponse(fallbackType, data),
      mock: true,
      provider,
      error: err.message,
    };
  }
};

export const getAIStatus = () => ({
  provider: getActiveProvider(),
  geminiConfigured: !!config.geminiApiKey,
  openaiConfigured: !!config.openaiApiKey,
  model: getActiveProvider() === 'gemini' ? config.geminiModel : 'gpt-4o-mini',
});
