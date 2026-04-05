'use client';

import React from 'react';
import useStore from '../shared/store';

export default function BlochSphere() {
  const { numQubits, simulationResults } = useStore();
  const { blochVectors } = simulationResults;

  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-sm font-bold text-slate-200">Qubit States</h3>
      <div className="grid grid-cols-1 gap-6">
        {Array.from({ length: numQubits }).map((_, i) => (
          <div key={i} className="flex flex-col items-center justify-center p-8 bg-slate-800/10 rounded-2xl border border-slate-700/30 group">
            <h4 className="text-xs font-bold text-slate-500 mb-4 group-hover:text-blue-400 capitalize underline-offset-4 decoration-blue-500/30">|q{i}⟩ State Vector</h4>
            <div className="relative w-32 h-32 flex items-center justify-center border-2 border-slate-700/50 rounded-full shadow-2xl shadow-black/10 overflow-hidden bg-slate-900 group-hover:border-blue-500/20 transition-all active:scale-105">
                 {/* CSS Bloch Sphere representation */}
                 <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-blue-500/20 via-transparent to-purple-500/20" />
                 <div className="w-px h-full bg-slate-800 absolute left-1/2" />
                 <div className="w-full h-px bg-slate-800 absolute top-1/2" />
                 
                 {/* Vector Arrow (Placeholder for actual calculations) */}
                 <div className="h-16 w-1 bg-gradient-to-t from-blue-600 to-indigo-400 absolute left-1/2 bottom-1/2 origin-bottom shadow-lg transition-transform" 
                   style={{ transform: `rotate(${blochVectors ? (blochVectors[i]?.theta || 0) : 0}deg)` }}
                 />
            </div>
            <div className="flex gap-4 mt-6 text-[10px] items-center">
                 <span className="text-slate-600 font-mono tracking-tighter uppercase px-2 py-1 bg-slate-800 rounded">X: 0.0</span>
                 <span className="text-slate-600 font-mono tracking-tighter uppercase px-2 py-1 bg-slate-800 rounded">Y: 0.0</span>
                 <span className="text-slate-600 font-mono tracking-tighter uppercase px-2 py-1 bg-slate-800 rounded">Z: 1.0</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
