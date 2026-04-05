'use client';

import React, { useState } from 'react';
import { MessageSquareCode, X, Sparkles, Send, BrainCircuit, Coffee, Info } from 'lucide-react';

export default function GlobalAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [mathFree, setMathFree] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your QFlux Quantum Pilot. I can decode complex quantum logic into plain language. How can I help you explore the Hilbert space today?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setMessages([...messages, { role: 'user', content: userMsg }]);
    setInput('');
    setLoading(true);

    const contextPrefix = mathFree 
      ? "[STRICT ANALOGY MODE: No math, no formulas. Explain using real-world analogies like waves, coins, or light.] " 
      : "";

    try {
      const resp = await fetch('http://localhost:8000/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ circuit: contextPrefix + userMsg }),
      });
      const data = await resp.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.explanation || "I have analyzed the quantum state. The probability distribution suggests a highly correlated system." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "I encountered a synchronization error. Please check your local QFlux engine status." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[200]">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-[#2563eb] hover:bg-[#3b82f6] text-white rounded-full shadow-[0_20px_50px_rgba(37,99,235,0.4)] flex items-center justify-center transition-all duration-500 hover:scale-110 active:scale-95 group relative border border-white/10"
        >
           <BrainCircuit size={28} />
           <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-black animate-pulse" />
           <span className="absolute right-full mr-6 bg-[#18181b] border border-[#27272a] text-[#fafafa] text-[11px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none shadow-2xl translate-x-4 group-hover:translate-x-0">
              A.I. Pilot Ready
           </span>
        </button>
      )}

      {/* Global AI Panel */}
      {isOpen && (
        <div className="w-[400px] h-[600px] bg-[#09090b] border border-[#27272a] rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-slide-up border-t border-white/5">
           {/* Header */}
           <div className="p-6 border-b border-[#27272a] bg-[#0d1117] flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                 <div className="flex flex-col">
                    <span className="text-[12px] font-black uppercase text-[#fafafa] tracking-[0.2em]">Quantum Pilot</span>
                    <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Active Intelligence</span>
                 </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2.5 hover:bg-[#18181b] rounded-xl text-[#71717a] transition-all hover:text-[#fafafa]"
              >
                <X size={20} />
              </button>
           </div>

           {/* 🧠 MATH-FREE TOGGLE (Accessibility Feature) */}
           <div className="px-6 py-3 bg-[#18181b]/40 border-b border-[#27272a] flex items-center justify-between group">
              <div className="flex items-center gap-3">
                 <Coffee size={14} className={mathFree ? "text-orange-400" : "text-[#3f3f46]"} />
                 <span className="text-[10px] font-black uppercase tracking-widest text-[#71717a] shrink-0">Analogy Mode (No Math)</span>
              </div>
              <button 
                onClick={() => setMathFree(!mathFree)}
                className={`w-10 h-5 rounded-full transition-all relative ${mathFree ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-[#27272a]'}`}
              >
                 <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${mathFree ? 'left-6' : 'left-1'}`} />
              </button>
           </div>

           {/* Console/Chat Area */}
           <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-[#000000]/30 min-h-0">
              {messages.map((m, i) => (
                <div key={i} className={`flex flex-col gap-3 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                   <div className="flex items-center gap-2 opacity-30 text-[10px] font-black uppercase tracking-widest">
                      {m.role === 'user' ? <span>Observer</span> : <span className="text-blue-500">Q-Pilot System</span>}
                   </div>
                   <div className={`
                      max-w-[90%] p-5 rounded-2xl text-[14px] font-medium leading-relaxed shadow-xl
                      ${m.role === 'user' ? 'bg-blue-600 text-[#fafafa] rounded-tr-none' : 'bg-[#18181b] border border-[#27272a] text-[#a1a1aa] rounded-tl-none italic'}
                   `}>
                      {m.content}
                   </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-4 text-[#71717a] animate-pulse p-4">
                   <Sparkles size={16} className="animate-spin duration-[3000ms] text-blue-500" />
                   <span className="text-[11px] uppercase font-black tracking-[0.2em]">Modulating Wavefunctions...</span>
                </div>
              )}
           </div>

           {/* Input Terminal */}
           <div className="p-6 border-t border-[#27272a] bg-[#0d1117]">
              <div className="flex items-center gap-3 relative">
                 <input 
                   disabled={loading}
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                   className="w-full bg-[#18181b] border border-[#27272a] text-[#fafafa] text-[14px] font-bold px-6 py-4 rounded-2xl focus:outline-none focus:border-blue-500 focus:shadow-[0_0_20px_rgba(37,99,235,0.1)] transition-all placeholder:text-[#3f3f46]"
                   placeholder={mathFree ? "Ask for an analogy..." : "Explain this quantum logic..."}
                 />
                 <button 
                   onClick={sendMessage}
                   disabled={loading || !input.trim()}
                   className="absolute right-2 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-all disabled:opacity-20 shadow-xl active:scale-95"
                 >
                   <Send size={18} />
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
