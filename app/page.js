'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useStore from '../shared/store';
import { CIRCUIT_PRESETS } from '../shared/presets';
import { 
  Play, 
  Terminal, 
  Orbit, 
  Sparkles, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  BrainCircuit,
  Activity,
  Code2
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { loadPreset } = useStore();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLaunchPreset = (preset) => {
    loadPreset(preset);
    router.push('/circuit');
  };

  return (
    <main className="min-h-screen bg-[#030712] text-slate-100 flex flex-col relative overflow-x-hidden quantum-grid-bg">
      {/* Background Interactive Aura */}
      <div 
        className="fixed w-[600px] h-[600px] bg-blue-500/10 blur-[140px] rounded-full pointer-events-none transition-all duration-500 ease-out -z-10"
        style={{ left: mousePos.x - 300, top: mousePos.y - 300 }}
      />
      <div className="fixed top-1/4 right-10 w-96 h-96 bg-cyan-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-10 w-96 h-96 bg-purple-500/10 blur-[160px] rounded-full pointer-events-none -z-10" />

      {/* Top Navbar */}
      <header className="h-20 border-b border-white/10 px-6 md:px-12 flex items-center justify-between z-50 glass-panel sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg glow-cyan">
            <Zap size={22} className="animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white font-mono flex items-center gap-1.5">
              QFlux <span className="text-cyan-400 text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">v2.1</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono block">Quantum Simulator IDE</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10">
          <Link href="/circuit" className="px-5 py-2 rounded-xl text-xs font-bold font-mono text-slate-300 hover:text-white hover:bg-white/5 transition-all">
            CIRCUIT DESIGNER
          </Link>
          <Link href="/playground" className="px-5 py-2 rounded-xl text-xs font-bold font-mono text-slate-300 hover:text-white hover:bg-white/5 transition-all">
            QISKIT LAB
          </Link>
          <Link href="/state" className="px-5 py-2 rounded-xl text-xs font-bold font-mono text-slate-300 hover:text-white hover:bg-white/5 transition-all">
            3D OBSERVER
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Aer Engine Ready
          </div>
          <Link 
            href="/circuit" 
            className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-black font-mono uppercase tracking-wider rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            Launch IDE <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 max-w-5xl mx-auto z-10">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold tracking-widest mb-8 animate-fade-in">
          <Sparkles size={14} className="text-cyan-400" />
          RESEARCH-GRADE QUANTUM SIMULATION PLATFORM
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight leading-none font-mono mb-6 animate-slide-up">
          Simulate Quantum <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 glow-text-cyan">
            Circuits with Precision
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed mb-10 font-normal">
          Interactive drag-and-drop circuit canvas, hardware noise modeling from IBM Yorktown, 3D WebGL Bloch spheres, and instant Qiskit Python code generation.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link 
            href="/circuit"
            className="w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3 glow-blue"
          >
            <Play size={18} fill="currentColor" stroke="none" />
            Open Circuit Designer
          </Link>

          <Link 
            href="/playground"
            className="w-full sm:w-auto px-10 py-4 bg-slate-950/80 hover:bg-slate-900 border border-white/10 hover:border-white/30 text-slate-200 font-mono font-bold text-sm uppercase tracking-wider rounded-2xl transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
          >
            <Terminal size={18} className="text-cyan-400" />
            Open Python Lab
          </Link>
        </div>
      </section>

      {/* 1-Click Circuit Presets */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto w-full mb-20 z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xs font-mono font-black uppercase tracking-widest text-cyan-400">1-Click Load</h2>
            <h3 className="text-2xl font-bold text-white font-mono">Benchmark Quantum Algorithms</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">Select algorithm to launch in Designer</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CIRCUIT_PRESETS.slice(0, 3).map((preset) => (
            <div 
              key={preset.id}
              onClick={() => handleLaunchPreset(preset)}
              className="glass-panel-interactive rounded-3xl p-6 border border-white/10 flex flex-col justify-between cursor-pointer group shadow-2xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono font-black uppercase px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                    {preset.category}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">{preset.numQubits} Qubits</span>
                </div>
                <h4 className="text-base font-bold text-white font-mono mb-2 group-hover:text-cyan-300 transition-colors">
                  {preset.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-6">
                  {preset.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-xs font-mono font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                <span>Load into Designer</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Pillar Grid */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto w-full mb-24 z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-6">
              <Layers size={24} />
            </div>
            <h3 className="text-xl font-bold text-white font-mono mb-3">Multi-Qubit Entanglement</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Place single unitaries ($H, X, Y, Z, S, T, R_x$), multi-qubit CNOT & CZ gates, and SWAP operators with real-time collision detection.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6">
              <Orbit size={24} />
            </div>
            <h3 className="text-xl font-bold text-white font-mono mb-3">3D WebGL Bloch Spheres</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Interactive 3D unit spheres with mouse orbit controls, expectation coordinate readouts ($\langle X \rangle, \langle Y \rangle, \langle Z \rangle$), and state purity meters.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel rounded-3xl p-8 border border-white/10 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-6">
              <Cpu size={24} />
            </div>
            <h3 className="text-xl font-bold text-white font-mono mb-3">AerSimulator Noise Models</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Run simulations with thermal relaxation ($T_1, T_2$) and depolarizing gate errors modeled after real IBM Quantum hardware.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 bg-slate-950/80 px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400 z-10">
        <div className="flex items-center gap-4">
          <span className="text-white font-bold">QFlux Quantum IDE</span>
          <span>•</span>
          <span>Core v2.1.0</span>
          <span>•</span>
          <span className="text-emerald-400">FastAPI Aer Engine Live</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/circuit" className="hover:text-cyan-400 transition-colors">Designer</Link>
          <Link href="/playground" className="hover:text-cyan-400 transition-colors">Python Lab</Link>
          <Link href="/state" className="hover:text-cyan-400 transition-colors">3D Observer</Link>
        </div>
      </footer>
    </main>
  );
}
