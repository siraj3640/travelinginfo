import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, OpenAISettings } from '../types';
import { Bot, Send, Sparkles, User as UserIcon, RefreshCw, Key, Compass, Luggage, MapPin, Bus, ShieldCheck } from 'lucide-react';

interface AIAssistantProps {
  openAISettings: OpenAISettings;
  onOpenSettings: () => void;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ openAISettings, onOpenSettings }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: "Hello! I am **TravelBot**, your AI travel planner on **travelinginfo**.\n\nAsk me anything about bus schedules, company amenities, packing checklists, seat recommendations, or 3-day travel itineraries!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      provider: openAISettings.hasKey ? 'OpenAI (gpt-4o-mini)' : 'Smart Travel Engine'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const promptText = (textToSend || input).trim();
    if (!promptText || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          userApiKey: openAISettings.apiKey || undefined,
          history: historyPayload
        })
      });

      const data = await res.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || "I encountered an issue generating travel recommendations. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        provider: data.provider || "OpenAI API"
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("AI Assistant Request Error:", error);
      setMessages(prev => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          text: "I was unable to connect to the server endpoint. Please verify your internet connection or check your OpenAI API key in settings.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const SUGGESTION_PILLS = [
    { label: "Best route from NYC to Boston?", icon: <Bus className="w-3.5 h-3.5 text-teal-400" /> },
    { label: "What should I pack for a 6h bus ride?", icon: <Luggage className="w-3.5 h-3.5 text-emerald-400" /> },
    { label: "Which bus seats offer the best legroom?", icon: <Compass className="w-3.5 h-3.5 text-cyan-400" /> },
    { label: "3-day weekend itinerary in Washington DC", icon: <MapPin className="w-3.5 h-3.5 text-amber-400" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
            <Bot className="w-7 h-7 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">AI Travel Assistant</h2>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                openAISettings.hasKey ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {openAISettings.hasKey ? 'OpenAI GPT-4 Active' : 'Smart Engine Mode'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Ask about destination guides, luggage limits, top carrier amenities, and route recommendations.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all flex items-center gap-2 shrink-0"
        >
          <Key className="w-4 h-4 text-amber-400" />
          {openAISettings.hasKey ? 'Manage OpenAI Key' : 'Configure OpenAI Key'}
        </button>
      </div>

      {/* Suggestion Quick Pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        {SUGGESTION_PILLS.map((pill, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(pill.label)}
            disabled={isLoading}
            className="px-3.5 py-2 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/40 text-slate-300 hover:text-white text-xs font-medium transition-all flex items-center gap-2"
          >
            {pill.icon}
            {pill.label}
          </button>
        ))}
      </div>

      {/* Chat Thread Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col h-[520px]">
        
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shrink-0 font-bold mt-1 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[82%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-medium rounded-tr-none shadow-md'
                  : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}>
                <div className="whitespace-pre-line font-sans">
                  {msg.text}
                </div>

                <div className={`mt-2 text-[10px] flex items-center justify-between gap-2 border-t pt-1.5 ${
                  msg.sender === 'user' ? 'border-slate-950/20 text-slate-800' : 'border-slate-800/80 text-slate-500'
                }`}>
                  <span>{msg.timestamp}</span>
                  {msg.provider && (
                    <span className="font-mono text-[9px] opacity-80">{msg.provider}</span>
                  )}
                </div>
              </div>

              {msg.sender === 'user' && (
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-teal-400 flex items-center justify-center shrink-0 font-bold mt-1">
                  <UserIcon className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-teal-400 font-medium flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-400" />
                TravelBot is searching routes & planning answer...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-2xl p-2 focus-within:border-teal-500 transition-colors">
            <textarea
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask TravelBot about bus routes, destination guides, or packing tips..."
              className="flex-1 bg-transparent border-none text-white text-xs sm:text-sm px-3 py-1 outline-none resize-none placeholder:text-slate-500"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold hover:opacity-95 transition-opacity disabled:opacity-40 shrink-0"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] text-slate-500 px-2">
            <span>Press Enter to send</span>
            <span>Powered by OpenAI & travelinginfo API</span>
          </div>
        </div>

      </div>

    </div>
  );
};
