'use client';

import React from 'react';
import useStore from '../../shared/store';
import Toolbar from '../../components/Toolbar';
import ThreeBlochSphere from '../../components/ThreeBlochSphere';
import { Sparkles, Orbit, Binary, Activity, Layers, ShieldCheck, Zap } from 'lucide-react';
import Link from 'next/link';

export default function BlochStatePage() {
  const { numQubits, simulationResults } = useStore();
  const { blochVectors, metrics, correlations, loading } = simulationResults;

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 flex flex-col overflow-hidden quantum-grid-bg">
      <Toolbar />
      
      <div className="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
        <div className="max-w-7xl mx-auto flex flex-col gap-10">
          
          {/* Header Banner */}
          <header className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />
            
            <div className="space-y-3 z-10">
              <div className="flex items-center gap-2.5 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-xs font-bold font-mono tracking-widest w-fit">
                <Sparkles size={12} className="animate-spin duration-3000 text-cyan-400" />
                QUANTUM HILBERT SPACE • 3D TELEMETRY
              </div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white font-mono">
                Bloch Sphere <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Observation Lab</span>
              </h1>
              <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
                {"Interactive real-time unit sphere projections of each qubit's pure state vector and reduced density matrix expectation values: |ψ⟩ = cos(θ/2)|0⟩ + e^(iφ)sin(θ/2)|1⟩."}
              </p>
            </div>
            
            {/* System Status Dashboard */}
            <div className="flex items-center gap-6 bg-slate-950/80 px-6 py-4 rounded-2xl border border-white/10 shrink-0 z-10">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">Active Wires</span>
                <span className="text-3xl font-black text-white font-mono">{numQubits}</span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">System Entropy</span>
                <span className="text-3xl font-black text-cyan-400 font-mono">
                  {metrics?.systemEntropy !== undefined ? metrics.systemEntropy.toFixed(3) : '0.000'}
                </span>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest font-mono">Engine</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                  <span className="text-xs font-bold text-slate-200 uppercase font-mono">
                    {loading ? 'SIMULATING' : 'AER SIMULATOR'}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* 3D Bloch Spheres Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {Array.from({ length: numQubits }).map((_, i) => {
              const vec = blochVectors ? blochVectors[i] : null;
              const theta = vec?.theta ?? 0;
              const phi = vec?.phi ?? 0;
              const x = vec?.x ?? 0;
              const y = vec?.y ?? 0;
              const z = vec?.z ?? 1;

              const correlation = correlations ? correlations.find(c => c.qubit === i) : null;
              const purity = correlation?.purity ?? 1.0;

              return (
                <div 
                  key={i} 
                  className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col items-center gap-6 hover:border-cyan-500/40 transition-all duration-300 shadow-2xl group relative overflow-hidden"
                >
                  {/* Subtle Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  {/* Card Header */}
                  <div className="flex items-center justify-between w-full border-b border-white/10 pb-4 z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono font-black text-sm flex items-center justify-center shadow-inner">
                        q{i}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white tracking-wide font-mono">Qubit | q{i} ⟩</h3>
                        <span className="text-[10px] text-slate-400 font-mono uppercase">State Vector Observer</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 border border-white/10 text-[10px] font-mono text-cyan-300">
                      <Orbit size={12} className="text-cyan-400 animate-pulse" />
                      <span>3D Orbit</span>
                    </div>
                  </div>

                  {/* Interactive Three.js 3D WebGL Canvas */}
                  <div className="relative my-2 z-10">
                    <ThreeBlochSphere 
                      theta={theta} 
                      phi={phi} 
                      x={x} 
                      y={y} 
                      z={z} 
                      qubitIndex={i}
                      size={240}
                      interactive={true}
                    />
                  </div>

                  {/* Polar Coordinates Readout */}
                  <div className="grid grid-cols-2 gap-3 w-full z-10">
                    <div className="flex flex-col p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Polar (θ)</span>
                      <span className="text-sm font-mono font-bold text-cyan-300">{theta.toFixed(2)}°</span>
                    </div>
                    <div className="flex flex-col p-3 rounded-2xl bg-slate-950/60 border border-white/5">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Azimuth (φ)</span>
                      <span className="text-sm font-mono font-bold text-purple-300">{phi.toFixed(2)}°</span>
                    </div>
                  </div>

                  {/* Cartesian Expectation Values */}
                  <div className="grid grid-cols-3 gap-2 w-full z-10">
                    <div className="flex flex-col items-center p-2.5 rounded-xl bg-slate-950/80 border border-emerald-500/20">
                      <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider font-mono">⟨X⟩</span>
                      <span className="text-xs font-mono font-bold text-white">{x.toFixed(3)}</span>
                    </div>
                    <div className="flex flex-col items-center p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/20">
                      <span className="text-[9px] font-black text-amber-400 uppercase tracking-wider font-mono">⟨Y⟩</span>
                      <span className="text-xs font-mono font-bold text-white">{y.toFixed(3)}</span>
                    </div>
                    <div className="flex flex-col items-center p-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/20">
                      <span className="text-[9px] font-black text-cyan-400 uppercase tracking-wider font-mono">⟨Z⟩</span>
                      <span className="text-xs font-mono font-bold text-white">{z.toFixed(3)}</span>
                    </div>
                  </div>

                  {/* Purity & Correlation Footer */}
                  <div className="w-full flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-slate-400 font-mono z-10">
                    <span>Reduced Purity:</span>
                    <span className="font-bold text-slate-200">{purity.toFixed(3)} {purity === 1.0 ? '(Pure)' : '(Mixed/Entangled)'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Guidance Banner */}
          {!blochVectors && !loading && (
            <div className="glass-panel p-8 rounded-3xl border border-cyan-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-base font-bold text-white font-mono">Circuit Not Yet Executed</h3>
                <p className="text-xs text-slate-400">
                  Showing default initial ground states $|0\dots 0\rangle$. Head to the Quantum Designer to apply gates and simulate!
                </p>
              </div>
              <Link 
                href="/circuit" 
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl active:scale-95 shrink-0"
              >
                Go to Circuit Designer →
              </Link>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}
