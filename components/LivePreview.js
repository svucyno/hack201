'use client';

import React from 'react';
import useStore from '../shared/store';

export default function LivePreview() {
  const { simulationResults } = useStore();

  const { probabilities, loading, error } = simulationResults;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-200">Simulation Output</h3>
        {loading && <span className="text-[10px] text-blue-400 animate-pulse font-mono tracking-tighter uppercase">Computing...</span>}
      </div>

      {!probabilities && !loading ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-800/10 rounded-2xl border-2 border-dashed border-slate-800/50">
          <p className="text-xs text-slate-600 text-center leading-relaxed">
            Run a simulation to view the quantum probability distribution.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-end justify-between h-40 gap-1 border-b border-slate-700/50 pb-2">
            {Object.entries(probabilities || {}).map(([state, prob]) => (
              <div key={state} className="flex-1 flex flex-col items-center group">
                <div 
                  className="w-full bg-blue-500/80 rounded-t shadow-lg shadow-blue-500/20 group-hover:bg-blue-400/90 transition-all duration-300" 
                  style={{ height: `${prob * 100}%` }}
                />
                <span className="text-[10px] text-slate-500 font-mono mt-1 group-hover:text-slate-300">
                  |{state}⟩
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
             {Object.entries(probabilities || {}).map(([state, prob]) => (
                <div key={state} className="flex items-center justify-between text-xs p-2 bg-slate-800/30 rounded border border-slate-700/30">
                   <span className="text-slate-400 font-mono">|{state}⟩</span>
                   <span className="text-slate-200 font-bold">{(prob * 100).toFixed(1)}%</span>
                </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
}
