'use client';

import React from 'react';
import useStore from '../shared/store';
import ThreeBlochSphere from './ThreeBlochSphere';
import { Target, Sparkles, Orbit, Binary } from 'lucide-react';

export default function BlochSphere() {
  const { numQubits, simulationResults } = useStore();
  const { blochVectors, loading } = simulationResults;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20 text-cyan-400">
            <Orbit size={16} />
          </div>
          <div>
            <h3 className="text-xs font-black tracking-widest text-slate-100 uppercase font-mono">
              3D State Projections
            </h3>
            <span className="text-[10px] text-slate-400">Unit sphere |ψ⟩ expectation vectors</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-[9px] font-bold tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          WebGL 3D
        </div>
      </div>

      {/* List of Qubit Spheres */}
      <div className="flex flex-col gap-6">
        {Array.from({ length: numQubits }).map((_, i) => {
          const vec = blochVectors ? blochVectors[i] : null;
          const theta = vec?.theta ?? 0;
          const phi = vec?.phi ?? 0;
          const x = vec?.x ?? 0;
          const y = vec?.y ?? 0;
          const z = vec?.z ?? 1;

          return (
            <div 
              key={i} 
              className="glass-panel rounded-2xl p-5 border border-white/10 flex flex-col items-center gap-4 hover:border-cyan-500/30 transition-all shadow-xl"
            >
              {/* Qubit Header */}
              <div className="flex items-center justify-between w-full border-b border-white/5 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono font-black text-xs flex items-center justify-center">
                    q{i}
                  </div>
                  <span className="text-xs font-bold text-slate-200 tracking-wide font-mono">
                    | q{i} ⟩ State
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                  <span>θ: <strong className="text-slate-200">{theta.toFixed(1)}°</strong></span>
                  <span>φ: <strong className="text-slate-200">{phi.toFixed(1)}°</strong></span>
                </div>
              </div>

              {/* 3D Three.js Bloch Sphere */}
              <div className="relative my-1">
                <ThreeBlochSphere 
                  theta={theta} 
                  phi={phi} 
                  x={x} 
                  y={y} 
                  z={z} 
                  qubitIndex={i}
                  size={200}
                  interactive={true}
                />
              </div>

              {/* Cartesian Coordinates Readout */}
              <div className="grid grid-cols-3 gap-2 w-full pt-1">
                <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/60 border border-emerald-500/20">
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider font-mono">⟨X⟩</span>
                  <span className="text-xs font-mono font-bold text-slate-100">{x.toFixed(3)}</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/60 border border-amber-500/20">
                  <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider font-mono">⟨Y⟩</span>
                  <span className="text-xs font-mono font-bold text-slate-100">{y.toFixed(3)}</span>
                </div>
                <div className="flex flex-col items-center p-2 rounded-xl bg-slate-900/60 border border-cyan-500/20">
                  <span className="text-[9px] font-black text-cyan-400 uppercase tracking-wider font-mono">⟨Z⟩</span>
                  <span className="text-xs font-mono font-bold text-slate-100">{z.toFixed(3)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
