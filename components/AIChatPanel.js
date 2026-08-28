'use client';

import React, { useState } from 'react';
import useStore from '../shared/store';
import { Send, Terminal, Bot, User, Sparkles, Loader2 } from 'lucide-react';

import { API_BASE_URL } from '../shared/api';

export default function AIChatPanel() {
  const { gates, numQubits } = useStore();
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Build a circuit on the canvas and I'll explain the underlying physics and gate interactions in plain English." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const resp = await fetch(`${API_BASE_URL}/ai/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numQubits, gates, question: input }),
      });
      const data = await resp.json();
      
      if (data.error) {
        setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${data.error}` }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.explanation }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Service Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-3xl border border-white/5 p-6 overflow-hidden shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 shadow-sm shadow-blue-500/10">
            <Bot size={18} className="text-blue-400" />
          </div>
          <h3 className="text-sm font-black text-slate-100 font-mono tracking-tighter uppercase">Quantum AI Lab Explainer</h3>
        </div>
        <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
           <span className="text-[10px] text-emerald-500/70 font-black tracking-widest uppercase">Live Engine</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mb-8 pr-2 custom-scrollbar space-y-6">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
             <div className={`flex items-center gap-2 mb-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`p-1 rounded-md ${msg.role === 'user' ? 'bg-indigo-500/20' : 'bg-blue-500/20'}`}>
                   {msg.role === 'user' ? <User size={10} className="text-indigo-400" /> : <Sparkles size={10} className="text-blue-400" />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                   {msg.role === 'user' ? 'Scientist' : 'QFlux Intelligence'}
                </span>
             </div>
             <div className={`max-w-[90%] p-4 rounded-2xl border text-xs leading-relaxed ${
               msg.role === 'user' 
               ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-100' 
               : 'bg-slate-900 border-white/5 text-slate-300 shadow-xl shadow-black/20 font-medium'
             }`}>
                {msg.content}
             </div>
          </div>
        ))}
        {loading && (
           <div className="flex items-center gap-3 animate-pulse">
              <Loader2 size={14} className="animate-spin text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Generating Explanation...</span>
           </div>
        )}
      </div>

      <div className="flex gap-3 p-2 bg-slate-900/50 rounded-2xl border border-white/5 focus-within:border-blue-500/30 focus-within:ring-4 focus-within:ring-blue-500/5 transition-all shadow-inner shadow-black/40">
         <input 
           type="text" 
           value={input}
           onChange={(e) => setInput(e.target.value)}
           onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
           placeholder="What does an H gate do here?"
           className="flex-1 bg-transparent border-none text-xs text-slate-200 focus:ring-0 placeholder:text-slate-700 px-4"
         />
         <button 
           onClick={sendMessage}
           disabled={loading || !input.trim()}
           className="p-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded-xl transition-all active:scale-90 shadow-xl shadow-blue-500/10 ring-4 ring-blue-500/10 active:ring-blue-500/30 group"
         >
            <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
         </button>
      </div>
    </div>
  );
}
