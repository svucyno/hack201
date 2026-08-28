'use client';

import React, { useState } from 'react';
import { 
  Undo2, 
  Redo2, 
  Trash2, 
  Play, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ChevronDown, 
  Menu, 
  X, 
  Cpu, 
  Zap, 
  Sparkles,
  BookOpen,
  Sliders,
  RotateCcw
} from 'lucide-react';
import useStore from '../shared/store';
import { API_BASE_URL } from '../shared/api';
import { MAX_QUBITS, MIN_QUBITS, HARDWARE_PROFILES } from '../shared/constants';
import { CIRCUIT_PRESETS } from '../shared/presets';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';

export default function Toolbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
  const [noiseDropdownOpen, setNoiseDropdownOpen] = useState(false);

  const { 
    numQubits, setNumQubits,
    undo, redo, undoStack, redoStack,
    resetCircuit, gates, setSimulationLoading, setSimulationResults, setSimulationError,
    noiseProfile, setNoiseProfile, loadPreset, shots, setShots
  } = useStore();

  const runSimulation = async () => {
    setSimulationLoading(true);
    try {
      const resp = await fetch(`${API_BASE_URL}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numQubits, gates, noise: noiseProfile }),
      });
      const data = await resp.json();
      if (data.error) {
        setSimulationError(data.error);
      } else {
        setSimulationResults(data);
        // Trigger subtle quantum particle celebration
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.15, x: 0.85 },
            colors: ['#06b6d4', '#3b82f6', '#8b5cf6', '#10b981']
          });
        } catch (e) {
          // ignore if canvas-confetti fails
        }
      }
    } catch (err) {
      setSimulationError(err.message || 'Simulation Service Error');
    } finally {
      setSimulationLoading(false);
    }
  };

  return (
    <header className="h-18 border-b border-white/10 glass-panel flex items-center justify-between px-4 md:px-8 shrink-0 z-50 sticky top-0">
      {/* Left Hub: Back, Undo/Redo, Presets, Hardware Noise */}
      <div className="flex items-center gap-3 md:gap-5">
        <button 
          onClick={() => router.push('/')}
          className="p-2.5 bg-slate-900/80 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white border border-white/10 transition-all active:scale-95 group"
          title="Back to Landing"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Undo / Redo */}
        <div className="hidden sm:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-white/10">
          <button 
            onClick={undo}
            disabled={undoStack.length === 0}
            className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white disabled:opacity-20 transition-all"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button 
            onClick={redo}
            disabled={redoStack.length === 0}
            className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white disabled:opacity-20 transition-all"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={16} />
          </button>
        </div>

        <div className="hidden lg:block w-px h-6 bg-white/10" />

        {/* Circuit Presets Dropdown */}
        <div className="relative hidden md:block">
          <button 
            onClick={() => { setPresetDropdownOpen(!presetDropdownOpen); setNoiseDropdownOpen(false); }}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-cyan-500/30 rounded-xl text-xs font-mono font-bold text-slate-200 transition-all"
          >
            <Sparkles size={14} className="text-cyan-400" />
            <span>Presets</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {presetDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 glass-dropdown rounded-2xl p-2 z-50 animate-slide-up shadow-2xl border border-white/15">
              <div className="px-3 py-1.5 text-[10px] font-mono font-black uppercase text-slate-400 tracking-wider border-b border-white/5">
                Load Algorithm Preset
              </div>
              <div className="flex flex-col gap-1 mt-1 max-h-80 overflow-y-auto custom-scrollbar">
                {CIRCUIT_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { loadPreset(p); setPresetDropdownOpen(false); }}
                    className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-white/10 transition-all group flex flex-col gap-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-white group-hover:text-cyan-300">{p.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">{p.numQubits}Q</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight line-clamp-1">{p.description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Hardware Noise Profile Selector */}
        <div className="relative hidden xl:block">
          <button 
            onClick={() => { setNoiseDropdownOpen(!noiseDropdownOpen); setPresetDropdownOpen(false); }}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900/80 hover:bg-slate-800 border border-white/10 hover:border-blue-500/30 rounded-xl text-xs font-mono font-bold text-slate-200 transition-all"
          >
            {noiseProfile.id === 'perfect' ? <Zap size={14} className="text-emerald-400" /> : <Cpu size={14} className="text-cyan-400" />}
            <span>{noiseProfile.label || 'Hardware Profile'}</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {noiseDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-80 glass-dropdown rounded-2xl p-2 z-50 animate-slide-up shadow-2xl border border-white/15">
              <div className="px-3 py-1.5 text-[10px] font-mono font-black uppercase text-slate-400 tracking-wider border-b border-white/5">
                Quantum Hardware Noise Profile
              </div>
              <div className="flex flex-col gap-1 mt-1">
                {Object.values(HARDWARE_PROFILES).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setNoiseProfile(p.id); setNoiseDropdownOpen(false); }}
                    className={`w-full text-left px-3.5 py-3 rounded-xl transition-all border ${noiseProfile.id === p.id ? 'bg-cyan-500/10 border-cyan-500/30 text-white' : 'hover:bg-white/5 border-transparent text-slate-300'}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold">{p.label}</span>
                      <span className="text-[10px] font-mono text-cyan-400">T1: {p.t1}μs</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-tight">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center Nav Pill */}
      <nav className="hidden lg:flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-2xl border border-white/10">
        {[
          { id: 'circuit', label: 'DESIGNER', path: '/circuit' },
          { id: 'playground', label: 'PYTHON LAB', path: '/playground' },
          { id: 'state', label: '3D OBSERVER', path: '/state' }
        ].map(item => (
          <Link 
            key={item.id} 
            href={item.path} 
            className={`px-5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all ${pathname === item.path ? 'bg-white/10 text-white border border-white/10 shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right Hub: Wire Adjuster, Reset, Run Button */}
      <div className="flex items-center gap-3 md:gap-5">
        {/* Qubit Wire Count Controls */}
        <div className="hidden sm:flex items-center gap-3 bg-slate-950/80 px-3.5 py-1.5 rounded-xl border border-white/10">
          <span className="text-[10px] font-mono font-black uppercase text-slate-400 tracking-wider">WIRES</span>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setNumQubits(numQubits - 1)} 
              disabled={numQubits <= MIN_QUBITS} 
              className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white disabled:opacity-20 transition-all"
            >
              <Minus size={14} />
            </button>
            <span className="text-xs font-mono font-black text-cyan-400 min-w-[16px] text-center">{numQubits}</span>
            <button 
              onClick={() => setNumQubits(numQubits + 1)} 
              disabled={numQubits >= MAX_QUBITS} 
              className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white disabled:opacity-20 transition-all"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Reset Circuit */}
        <button
          onClick={resetCircuit}
          disabled={gates.length === 0}
          className="hidden sm:flex p-2.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 rounded-xl border border-transparent hover:border-rose-500/20 disabled:opacity-20 transition-all"
          title="Reset Circuit"
        >
          <RotateCcw size={16} />
        </button>

        {/* Execute Simulation Button */}
        <button 
          onClick={runSimulation}
          className="flex items-center gap-2.5 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-mono font-bold text-xs tracking-wider rounded-xl transition-all shadow-xl active:scale-95 glow-blue border border-white/20"
        >
          <Play size={14} fill="currentColor" stroke="none" />
          <span>RUN SIMULATION</span>
        </button>

        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 bg-slate-900/80 rounded-xl text-slate-300 border border-white/10"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 glass-dropdown border-b border-white/10 p-6 flex flex-col gap-4 lg:hidden animate-slide-up">
          <div className="flex flex-col gap-2">
            {[
              { id: 'circuit', label: 'QUANTUM DESIGNER', path: '/circuit' },
              { id: 'playground', label: 'QISKIT PYTHON LAB', path: '/playground' },
              { id: 'state', label: '3D STATE OBSERVER', path: '/state' }
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => { router.push(item.path); setMobileMenuOpen(false); }}
                className={`w-full text-left p-3.5 rounded-xl font-mono text-xs font-bold transition-all ${pathname === item.path ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20' : 'text-slate-300 hover:bg-white/5'}`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="h-px bg-white/10" />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Undo / Redo</span>
            <div className="flex gap-4">
              <button onClick={undo} disabled={undoStack.length === 0} className="text-slate-300 disabled:opacity-20 p-2"><Undo2 size={20} /></button>
              <button onClick={redo} disabled={redoStack.length === 0} className="text-slate-300 disabled:opacity-20 p-2"><Redo2 size={20} /></button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
