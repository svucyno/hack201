'use client';

import React, { useState } from 'react';
import { 
  MessageSquareCode, 
  X, 
  Sparkles, 
  Send, 
  BrainCircuit, 
  Coffee, 
  Info,
  Trash2,
  HelpCircle,
  Zap,
  Lightbulb
} from 'lucide-react';
import useStore from '../shared/store';
import { API_BASE_URL } from '../shared/api';

const QUICK_PROMPTS = [
  "Explain this quantum circuit's physics",
  "Is there entanglement between qubits?",
  "What algorithm does this match?",
  "Explain using simple wave analogies"
];

export default function GlobalAIAssistant() {
  const { numQubits, gates } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [mathFree, setMathFree] = useState(false);
  const [messages, setMessages] = useState([
    { 
      role: 'assistant', 
      content: "Greetings, Physicist. I am your QFlux Quantum Pilot. I can analyze the unitary matrix operations, detect multi-qubit entanglement, and translate complex Hilbert space physics into intuitive language. How can I assist your experiment?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (customPrompt = null) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || loading) return;

    setMessages(prev => [...prev, { role: 'user', content: textToSend }]);
    setInput('');
    setLoading(true);

    const contextPrefix = mathFree 
      ? "[STRICT ANALOGY MODE: No math, no formulas. Explain using intuitive real-world analogies like coins, spinning tops, ripples, or polarized light.] " 
      : "";

    try {
      const resp = await fetch(`${API_BASE_URL}/ai/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numQubits, gates, question: contextPrefix + textToSend }),
      });
      const data = await resp.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.explanation || data.error || "Statevector analyzed." }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Backend synchronization error. Please verify the QFlux FastAPI engine is running." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      { role: 'assistant', content: "Chat history cleared. What quantum question shall we investigate next?" }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 select-none">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 group relative border border-white/20 glow-cyan"
          title="Open AI Quantum Pilot"
        >
          <BrainCircuit size={26} className="animate-pulse" />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-ping" />
          <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-950" />
          
          <span className="absolute right-full mr-4 bg-slate-900 border border-white/10 text-white text-xs font-mono font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap pointer-events-none shadow-2xl translate-x-2 group-hover:translate-x-0">
            AI Quantum Pilot
          </span>
        </button>
      )}

      {/* Glassmorphic AI Chat Window */}
      {isOpen && (
        <div className="w-[380px] sm:w-[440px] h-[600px] glass-panel border border-white/15 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="p-4 px-5 border-b border-white/10 bg-slate-950/90 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md glow-cyan">
                <BrainCircuit size={18} />
              </div>
              <div>
                <span className="text-xs font-mono font-black uppercase text-white tracking-wider flex items-center gap-1.5">
                  Quantum Pilot <span className="text-[9px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.2 rounded font-bold">AI</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono block">Physics & Entanglement Explainer</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button 
                onClick={handleClearChat}
                className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
                title="Clear Chat"
              >
                <Trash2 size={16} />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Analogy Mode (No Math) Toggle */}
          <div className="px-5 py-2.5 bg-slate-950/60 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coffee size={14} className={mathFree ? "text-amber-400" : "text-slate-500"} />
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-300">
                Analogy Mode (No Math)
              </span>
            </div>
            <button 
              onClick={() => setMathFree(!mathFree)}
              className={`w-9 h-5 rounded-full transition-all relative ${mathFree ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 'bg-slate-800'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${mathFree ? 'left-4.5' : 'left-0.5'}`} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-slate-950/30">
            {messages.map((m, i) => (
              <div key={i} className={`flex flex-col gap-1.5 ${m.role === 'user' ? 'items-end' : 'items-start'} animate-fade-in`}>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-slate-400 px-1">
                  {m.role === 'user' ? 'Physicist' : 'Quantum AI Engine'}
                </span>
                <div className={`
                  max-w-[90%] p-4 rounded-2xl text-xs leading-relaxed font-normal shadow-lg select-text
                  ${m.role === 'user' 
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-none font-medium' 
                    : 'bg-slate-900/90 border border-white/10 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                  }
                `}>
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-3 text-cyan-400 p-3 bg-cyan-500/5 rounded-2xl border border-cyan-500/10 animate-pulse">
                <Sparkles size={16} className="animate-spin duration-3000" />
                <span className="text-xs font-mono font-bold">Transpiling DAG & Analyzing Physics...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="px-4 py-2 border-t border-white/5 bg-slate-950/80 flex gap-2 overflow-x-auto custom-scrollbar">
            {QUICK_PROMPTS.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(promptText)}
                disabled={loading}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-cyan-500/30 text-[10px] font-mono text-slate-300 hover:text-cyan-300 whitespace-nowrap transition-all shrink-0"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Chat Input Box */}
          <div className="p-4 border-t border-white/10 bg-slate-950">
            <div className="flex items-center gap-2 relative">
              <input 
                disabled={loading}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="w-full bg-slate-900 border border-white/10 text-white text-xs font-mono font-normal pl-4 pr-12 py-3 rounded-2xl focus:outline-none focus:border-cyan-500 transition-all placeholder:text-slate-400"
                placeholder={mathFree ? "Ask for a simple physical analogy..." : "Ask about gates, statevectors, entanglement..."}
              />
              <button 
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="absolute right-2 p-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl transition-all disabled:opacity-20 shadow-lg active:scale-95"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
