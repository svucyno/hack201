'use client';

import React, { useState } from 'react';
import useStore from '../shared/store';
import { BarChart3, Binary, Zap, ShieldCheck, Activity, Layers, HelpCircle, ArrowRightCircle } from 'lucide-react';

export default function LivePreview() {
  const { simulationResults } = useStore();
  const { probabilities, loading, metrics, correlations, statevector } = simulationResults;
  const [showInsights, setShowInsights] = useState(false);

  // 🧠 MATH-TO-HUMAN TRANSLATOR LOGIC
  const getStateInsight = () => {
    if (!probabilities) return "Design a circuit to see the logic.";
    
    const states = Object.keys(probabilities);
    const maxProbState = states.reduce((a, b) => probabilities[a] > probabilities[b] ? a : b);
    const maxProb = (probabilities[maxProbState] * 100).toFixed(0);

    if (states.length === 1) {
        return `The system is in a 'Definite State'. Measuring will return |${maxProbState}⟩ with ${maxProb}% certainty. No quantum randomness detected.`;
    }
    if (states.length > 1 && maxProb > 45 && maxProb < 55 && states.length === 2) {
        return "You have created a 'Perfect Superposition'. The qubits are in two states at once. This is the heart of quantum parallelism!";
    }
    if (metrics?.systemEntropy > 0.5) {
        return "Strong 'Entanglement' detected. The qubits are linked; their identities are shared across the system. This is what Einstein called 'spooky action'.";
    }
    return `The system is weighted towards |${maxProbState}⟩ (${maxProb}%), but other possibilities exist simultaneously.`;
  };

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      {/* 🚀 WOW FACTOR: RESEARCH DASHBOARD TIER */}
      {metrics && !loading && (
        <div className="flex flex-col gap-6 bg-[#09090b] p-6 rounded-2xl border border-[#27272a] shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full" />
           
           <div className="flex items-center justify-between border-b border-[#27272a] pb-4">
              <div className="flex items-center gap-3">
                 <Zap size={16} className="text-yellow-500" />
                 <h3 className="text-[12px] font-black tracking-[0.3em] uppercase text-[#fafafa]">Quantum Telemetry</h3>
              </div>
              <button 
                onClick={() => setShowInsights(!showInsights)}
                className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[10px] font-black text-blue-500 hover:bg-blue-500/20 transition-all"
              >
                <HelpCircle size={12} />
                DECODE MATH
              </button>
           </div>
           
           {/* 🧠 MATH SIMPLIFIER OVERLAY */}
           {showInsights && (
             <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl animate-slide-up mb-2">
                <div className="flex items-start gap-4">
                   <ArrowRightCircle size={18} className="text-blue-500 shrink-0 mt-1" />
                   <p className="text-[13px] text-[#fafafa] font-bold leading-relaxed italic">
                      "{getStateInsight()}"
                   </p>
                </div>
                <div className="mt-4 flex items-center gap-4 text-[10px] text-[#3f3f46] font-black uppercase tracking-widest">
                   <span>Auto-Decoder Active</span>
                   <div className="w-1 h-1 bg-[#27272a] rounded-full" />
                   <span>V2.1 Engine</span>
                </div>
             </div>
           )}

           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                 <span className="text-[10px] font-black text-[#71717a] uppercase tracking-widest">Optimized Depth</span>
                 <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#fafafa] font-mono tracking-tighter">{metrics.optimizedDepth}</span>
                    <span className="text-[10px] text-emerald-500 font-bold uppercase">↓ {((1 - metrics.optimizedDepth / Math.max(1, metrics.originalDepth)) * 100).toFixed(0)}%</span>
                 </div>
              </div>

              <div className="space-y-2">
                 <span className="text-[10px] font-black text-[#71717a] uppercase tracking-widest">System Entropy</span>
                 <div className="flex items-baseline gap-2 text-blue-500">
                    <span className="text-3xl font-black font-mono tracking-tighter">{metrics.systemEntropy?.toFixed(4)}</span>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 📦 COMPLEX PHASE WHEELS - Visualizing Complex Numbers */}
      {statevector && !loading && (
        <div className="flex flex-col gap-4">
           <div className="flex items-center gap-3">
              <Activity size={14} className="text-blue-500" />
              <h3 className="text-[12px] font-black tracking-[0.3em] text-[#71717a] uppercase">Complex Phase Mapping</h3>
           </div>
           <div className="flex flex-wrap gap-4">
              {statevector.map((val, i) => {
                 const complex = val.length === 2 ? {re: val[0], im: val[1]} : {re: val.real || val, im: val.imag || 0};
                 const mag = Math.sqrt(complex.re**2 + complex.im**2);
                 const phase = Math.atan2(complex.im, complex.re) * (180 / Math.PI);
                 if (mag < 0.01) return null;

                 return (
                    <div key={i} className="p-4 bg-[#09090b] border border-[#27272a] rounded-xl flex flex-col items-center gap-3 group relative hover:border-blue-500/30 transition-all">
                       <div className="w-10 h-10 border border-[#18181b] rounded-full relative shadow-inner flex items-center justify-center">
                          <div 
                             className="h-4 w-0.5 bg-blue-500 absolute bottom-1/2 origin-bottom transition-transform duration-700 shadow-[0_0_10px_rgba(37,99,235,0.8)]"
                             style={{ transform: `rotate(${phase}deg)` }}
                          />
                          <div className="w-full h-full rounded-full bg-blue-500/5 absolute animate-pulse" />
                       </div>
                       <span className="text-[10px] font-mono font-black text-[#52525b] group-hover:text-[#fafafa]">|{i.toString(2).padStart(Math.log2(statevector.length), '0')}⟩</span>
                    </div>
                 );
              })}
           </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h3 className="text-[12px] font-black tracking-[0.3em] text-[#71717a] uppercase italic">Probability Amplitude</h3>
      </div>

      {!probabilities && !loading ? (
        <div className="flex flex-col items-center justify-center p-14 bg-[#09090b] rounded-2xl border-2 border-dashed border-[#27272a] opacity-30">
          <Binary size={48} className="text-[#3f3f46] mb-6" />
          <p className="text-[12px] text-[#71717a] text-center font-black uppercase tracking-widest leading-relaxed">
             No simulation and <br /> hardware analytics found.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex items-end justify-between h-48 gap-3 border-b border-[#27272a] pb-4 px-2">
            {Object.entries(probabilities || {}).map(([state, prob]) => (
              <div key={state} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                <div 
                  className="w-full bg-blue-600/40 rounded-t-lg shadow-xl group-hover:bg-blue-500 transition-all duration-700 h-full max-h-full" 
                  style={{ height: `${prob * 100}%` }}
                />
                <span className="text-[13px] text-[#71717a] font-mono font-black mt-3 group-hover:text-[#fafafa] italic tracking-tighter transition-colors">
                  |{state}⟩
                </span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3">
             {Object.entries(probabilities || {}).map(([state, prob]) => (
                <div key={state} className="flex items-center justify-between p-4 bg-[#09090b] rounded-xl border border-[#27272a] group transition-all hover:bg-[#18181b]">
                   <span className="text-[14px] text-[#71717a] font-mono font-black group-hover:text-[#fafafa] italic tracking-tighter">|{state}⟩</span>
                   <span className="text-[16px] text-[#fafafa] font-black font-mono tracking-tighter">{(prob * 100).toFixed(1)}%</span>
                </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}
