'use client';

import React, { useState } from 'react';
import useStore from '../shared/store';
import { BarChart3, Binary, Zap, ShieldCheck, Activity, Layers, HelpCircle, ArrowRightCircle, Sparkles, AlertTriangle } from 'lucide-react';

export default function LivePreview() {
  const { simulationResults } = useStore();
  const { probabilities, counts, loading, metrics, correlations, statevector, error } = simulationResults;
  const [showInsights, setShowInsights] = useState(true);

  // Math-to-Human translator logic
  const getStateInsight = () => {
    if (!probabilities) return "Run the circuit simulation to calculate probability amplitudes and entanglement telemetry.";
    
    const states = Object.keys(probabilities);
    if (states.length === 0) return "No state outcomes detected.";

    const maxProbState = states.reduce((a, b) => probabilities[a] > probabilities[b] ? a : b);
    const maxProb = (probabilities[maxProbState] * 100).toFixed(1);

    if (states.length === 1) {
      return `Deterministic State: Measuring this circuit yields |${maxProbState}⟩ with 100% certainty. Zero quantum phase dispersion.`;
    }
    if (states.length === 2 && maxProb >= 45 && maxProb <= 55) {
      return `Maximally Entangled / Equal Superposition: The qubits exist in an equal superposition of |${states[0]}⟩ and |${states[1]}⟩. Classic quantum parallelism in action!`;
    }
    if (metrics?.systemEntropy > 0.4) {
      return `Non-zero Von Neumann Entropy (${metrics.systemEntropy.toFixed(3)}): System demonstrates non-local entanglement across multiple registers.`;
    }
    return `Dominant Basis State: State |${maxProbState}⟩ leads with ${maxProb}% probability amplitude. Remaining probability distributed over ${states.length - 1} other basis states.`;
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in select-none">
      {/* Simulation Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3 text-xs font-mono">
          <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block uppercase">Simulation Error</span>
            <p className="text-rose-200/80 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="glass-panel p-8 rounded-3xl border border-cyan-500/30 flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-10 h-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
          <div className="space-y-1">
            <span className="text-xs font-mono font-black text-cyan-400 uppercase tracking-widest block">
              Executing AerSimulator...
            </span>
            <p className="text-[10px] text-slate-400 font-mono">Transpiling DAG, computing Statevector & Noise Model</p>
          </div>
        </div>
      )}

      {/* Quantum Telemetry Dashboard */}
      {metrics && !loading && (
        <div className="glass-panel p-5 rounded-3xl border border-white/10 flex flex-col gap-4 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-2xl rounded-full pointer-events-none" />

          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20 text-cyan-400">
                <Zap size={14} />
              </div>
              <h3 className="text-xs font-mono font-black tracking-wider uppercase text-white">
                Quantum Telemetry
              </h3>
            </div>
            
            <button 
              onClick={() => setShowInsights(!showInsights)}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-[10px] font-mono font-bold text-cyan-400 hover:bg-cyan-500/20 transition-all"
            >
              <HelpCircle size={12} />
              <span>{showInsights ? 'HIDE AI DECODER' : 'SHOW AI DECODER'}</span>
            </button>
          </div>

          {/* AI Auto-Decoder Card */}
          {showInsights && (
            <div className="p-3.5 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-transparent border border-cyan-500/20 rounded-2xl animate-slide-up">
              <div className="flex items-start gap-3">
                <Sparkles size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-200 leading-relaxed italic font-medium">
                  "{getStateInsight()}"
                </p>
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Transpiled Depth
              </span>
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-2xl font-black text-white">{metrics.optimizedDepth}</span>
                {metrics.originalDepth > 0 && (
                  <span className="text-[10px] text-emerald-400 font-bold">
                    ({metrics.originalDepth} initial)
                  </span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/60 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Von Neumann Entropy
              </span>
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-2xl font-black text-cyan-400">
                  {metrics.systemEntropy !== undefined ? metrics.systemEntropy.toFixed(3) : '0.000'}
                </span>
                <span className="text-[10px] text-slate-400">nats</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Measurement Probability Amplitude Histogram */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 size={14} className="text-cyan-400" />
            <h3 className="text-xs font-mono font-black uppercase tracking-wider text-slate-200">
              Basis State Distribution
            </h3>
          </div>
          {counts && (
            <span className="text-[10px] font-mono text-slate-400">
              Shots: {Object.values(counts).reduce((a, b) => a + b, 0)}
            </span>
          )}
        </div>

        {!probabilities && !loading ? (
          <div className="glass-panel p-10 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center gap-3 text-slate-500">
            <Binary size={36} className="text-slate-600 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
              No Simulation Executed
            </span>
            <p className="text-[10px] text-slate-500 max-w-xs font-mono leading-relaxed">
              Click <strong className="text-cyan-400">RUN SIMULATION</strong> in the top toolbar to calculate the quantum state probability distribution.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Visual Histogram Bars */}
            <div className="glass-panel p-5 rounded-3xl border border-white/10 flex items-end justify-between h-44 gap-2 pb-2">
              {Object.entries(probabilities || {}).map(([state, prob]) => {
                const heightPercent = Math.max(8, prob * 100);
                return (
                  <div key={state} className="flex-1 flex flex-col items-center justify-end h-full group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-white/10 text-[10px] font-mono text-white px-2 py-0.5 rounded shadow-lg pointer-events-none whitespace-nowrap z-20">
                      {(prob * 100).toFixed(2)}% ({counts ? counts[state] || 0 : 0} shots)
                    </div>

                    <div 
                      className="w-full bg-gradient-to-t from-blue-600 via-cyan-500 to-cyan-400 rounded-t-xl transition-all duration-500 group-hover:glow-cyan shadow-lg"
                      style={{ height: `${heightPercent}%` }}
                    />
                    <span className="text-[11px] font-mono font-bold text-slate-400 group-hover:text-cyan-300 mt-2 transition-colors">
                      |{state}⟩
                    </span>
                  </div>
                );
              })}
            </div>

            {/* List breakdown with percent progress */}
            <div className="flex flex-col gap-2">
              {Object.entries(probabilities || {}).map(([state, prob]) => (
                <div 
                  key={state}
                  className="p-3 bg-slate-950/60 border border-white/5 rounded-2xl flex items-center justify-between hover:border-cyan-500/20 transition-all font-mono"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-cyan-300">|{state}⟩</span>
                    <span className="text-[10px] text-slate-500">
                      {counts ? `${counts[state] || 0} counts` : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full" 
                        style={{ width: `${prob * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-white min-w-[48px] text-right">
                      {(prob * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
