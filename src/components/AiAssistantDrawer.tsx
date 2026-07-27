import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Send, X, Bot, User, CornerDownLeft, Loader2 } from 'lucide-react';

interface ChatMsg {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const AiAssistantDrawer: React.FC = () => {
  const { aiDrawerOpen, setAiDrawerOpen, currentUser, activePg } = useApp();
  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello ${currentUser.name}! I am your AI Hostel Copilot. How can I assist you with ${activePg.name} today? You can ask about rent status, mess menus, gate timings, or file a complaint.`,
      time: 'Just now'
    }
  ]);
  const [loading, setLoading] = useState(false);

  if (!aiDrawerOpen) return null;

  const handleSend = async (customText?: string) => {
    const textToSend = customText || inputPrompt;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!customText) setInputPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSend,
          role: currentUser.role,
          pgContext: { name: activePg.name, city: activePg.city, upiId: activePg.upiId }
        })
      });
      const data = await res.json();
      const aiReply: ChatMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || "I am processing your request. Please check your dashboard for updates.",
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiReply]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "What are mess timings and today's menu?",
    "How do I upload my rent UPI payment screenshot?",
    "Rules for weekend night-out gate passes?",
    "Generate complaint copy for room AC repair"
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-indigo-900 to-purple-900 px-5 py-4 text-white dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 backdrop-blur border border-white/20">
            <Sparkles className="h-5 w-5 text-amber-300 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight">AI Hostel Copilot</h3>
            <p className="text-[10px] text-indigo-200">Powered by Gemini 3.6 Flash</p>
          </div>
        </div>
        <button
          onClick={() => setAiDrawerOpen(false)}
          className="rounded-full bg-white/10 p-1.5 text-white/80 hover:bg-white/20"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-purple-100 text-purple-700 dark:bg-purple-900/60 dark:text-purple-300'
              }`}
            >
              {m.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed shadow-sm ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>
              <span className={`mt-1 block text-[9px] text-right ${m.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                {m.time}
              </span>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
            <span>AI is thinking...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="border-t border-slate-100 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Quick Prompts</div>
        <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 p-3 dark:border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask AI anything about your hostel..."
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-900 focus:border-purple-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-800 dark:text-white"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md hover:bg-purple-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
