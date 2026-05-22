import { useState } from 'react';
import { HiOutlineSparkles, HiOutlineChatBubbleLeftRight, HiOutlineCheck } from 'react-icons/hi2';
import { aiService } from '../services/aiService';

export const GeminiAssistantWidget = ({ product }) => {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `👋 Hello! I am your SmartStore Gemini Assistant. I can analyze **${product.name}** and provide live promotional copy, targeted specs, or SEO structures! How can I help you today?`,
    },
  ]);
  const [loading, setLoading] = useState(false);

  const fetchAiInsight = async (type, label) => {
    // Add user question
    setMessages((prev) => [...prev, { sender: 'user', text: label }]);
    setLoading(true);

    try {
      const { data } = await aiService.generateFullInfo({
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
      });

      const info = data?.data?.fullInfo;
      let replyText = '';

      if (type === 'specs') {
        replyText = `📋 **AI Feature & Spec Highlights for ${product.name}**:\n\n` +
          `• **Key Specs**: ${Array.isArray(info?.keyFeatures) ? info.keyFeatures.join(', ') : 'Premium Build Quality'}\n` +
          `• **Ideal Audience**: ${info?.targetAudience || 'Modern Tech Enthusiasts'}\n` +
          `• **Pricing Strategy**: ${info?.pricingStrategy || 'Competitive Retail Market'}`;
      } else if (type === 'promo') {
        replyText = `📣 **AI Promotional Ad & Social Copy**:\n\n` +
          `* "${info?.marketingCaption || 'Revolutionize your lifestyle today!'}" *\n\n` +
          `**Ad Pitch**:\n${info?.adCopy || 'Upgrade your collection with premium craftsmanship. Shop now!'}\n\n` +
          `**Social Tagline**:\n${info?.socialPromo || '#premium #lifestyle #upgrade'}`;
      } else if (type === 'seo') {
        replyText = `💡 **SEO & Meta Engine Preview**:\n\n` +
          `• **Optimized SEO Title**: ${info?.seoTitle || product.name + ' - Purchase Online'}\n` +
          `• **Meta Description**: ${info?.metaDescription || 'Buy the premium ' + product.name + ' with fast shipping and real-time security checking.'}\n` +
          `• **Search Terms**: ${Array.isArray(info?.tags) ? info.tags.map(t => '#' + t).join(' ') : '#ecommerce'}`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: replyText }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `⚠️ Apologies, my database is offline or the Gemini context failed. But here is standard advice: the **${product.name}** is currently priced at **$${product.price}** with stock level of **${product.stock || 50}**. It is a fantastic choice in the **${product.category}** category!`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[380px] rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-900/30">
      {/* Widget Header */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600/10 text-brand-600 dark:bg-brand-500/20">
          <svg className="h-4 w-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21l-.813-5.096L3 15l5.096-.813L9 9l.813 5.096L15 15l-5.187.904z" />
          </svg>
        </div>
        <div>
          <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            Gemini Product Assistant
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[8px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              Live
            </span>
          </h4>
          <p className="text-[9px] text-slate-500">Google Search & Spec Grounded</p>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-1 text-xs">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-brand-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800 rounded-tl-none shadow-sm'
              }`}
            >
              <p className="whitespace-pre-line text-[11px]">{msg.text}</p>
            </div>
          </div>
        ))}

        {/* Loading / Typing Indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl bg-white border border-slate-100 px-4 py-3 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-500" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-500 [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-brand-500 [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* Prompt Helpers */}
      <div className="border-t border-slate-200 pt-3 dark:border-slate-800">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-2">Select a Query Option:</p>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => fetchAiInsight('specs', '📋 Why Buy / Key Specs')}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-700 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-500 disabled:opacity-50"
          >
            📋 Why Buy & Specs
          </button>
          <button
            onClick={() => fetchAiInsight('promo', '📣 Promotional Copy')}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-700 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-500 disabled:opacity-50"
          >
            📣 Social Promo Copy
          </button>
          <button
            onClick={() => fetchAiInsight('seo', '💡 SEO Engine Metadata')}
            disabled={loading}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10px] font-bold text-slate-700 transition hover:border-brand-500 hover:text-brand-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-500 disabled:opacity-50"
          >
            💡 SEO Engine Specs
          </button>
        </div>
      </div>
    </div>
  );
};
