'use client';

import React from 'react';
import useStore from '../shared/store';
import { Send, Terminal } from 'lucide-react';

export default function AIChatPanel() {
  const { gates } = useStore();

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-2xl border border-slate-800/20 p-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-6">
        <Terminal size={16} className="text-blue-400" />
        <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight uppercase">Quantum AI Explainer</h3>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar">
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800/50 shadow-sm">
           <p className="text-xs text-slate-400 leading-relaxed italic">
             Build a circuit on the canvas and I'll explain the underlying physics and gate interactions in plain English.
           </p>
        </div>
      </div>

      <div className="flex gap-2 p-2 bg-slate-900/50 rounded-xl border border-slate-800 focus-within:border-blue-500/50 transition-all shadow-inner shadow-black/20">
         <input 
           type="text" 
           placeholder="Ask about this circuit..."
           className="flex-1 bg-transparent border-none text-xs text-slate-200 focus:ring-0 placeholder:text-slate-600 px-2"
         />
         <button className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-transform active:scale-95 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/10 active:ring-blue-500/30">
            <Send size={14} />
         </button>
      </div>
    </div>
  );
}
