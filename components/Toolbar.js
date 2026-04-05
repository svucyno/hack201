'use client';

import React, { useState } from 'react';
import { Undo2, Redo2, Trash2, Play, Plus, Minus, ArrowLeft, ChevronDown, Menu, X, Share2, Cpu, ShieldCheck, Zap } from 'lucide-react';
import useStore from '../shared/store';
import { MAX_QUBITS, MIN_QUBITS } from '../shared/constants';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Toolbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { 
    numQubits, setNumQubits,
    undo, redo, undoStack, redoStack,
    resetCircuit, gates, setSimulationLoading, setSimulationResults, setSimulationError,
    noiseProfile, setNoiseProfile
  } = useStore();

  const runSimulation = async () => {
    setSimulationLoading(true);
    try {
      const resp = await fetch('http://localhost:8000/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numQubits, gates, noise: noiseProfile }),
      });
      const data = await resp.json();
      if (data.error) {
        setSimulationError(data.error);
      } else {
        setSimulationResults(data);
      }
    } catch (err) {
      setSimulationError(err.message);
    }
  };

  return (
    <header className="h-16 border-b border-[#27272a] bg-[#000000] flex items-center justify-between px-6 md:px-10 shrink-0 z-[100] sticky top-0 shadow-2xl">
      {/* 🧬 IBM Senior Research Tier: Left Command Hub */}
      <div className="flex items-center gap-4 md:gap-10">
        <button 
          onClick={() => router.push('/')}
          className="p-3 hover:bg-[#18181b] rounded-2xl text-[#a1a1aa] transition-all hover:text-[#fafafa] border border-transparent hover:border-[#27272a] shadow-lg group"
        >
          <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        
        <div className="hidden lg:flex items-center gap-1.5 ml-2">
          <button 
            onClick={undo}
            disabled={undoStack.length === 0}
            className="p-2.5 hover:bg-[#18181b] rounded-xl text-[#a1a1aa] disabled:opacity-5 transition-all shadow-sm"
          >
            <Undo2 size={18} />
          </button>
          <button 
            onClick={redo}
            disabled={redoStack.length === 0}
            className="p-2.5 hover:bg-[#18181b] rounded-xl text-[#a1a1aa] disabled:opacity-5 transition-all shadow-sm"
          >
            <Redo2 size={18} />
          </button>
        </div>

        <div className="hidden lg:block w-[1px] h-6 bg-[#27272a]" />

        {/* 🚀 WOW FACTOR: Hardware Profile Selector */}
        <div className="relative group hidden xl:block">
           <button className="flex items-center gap-4 px-6 py-3 bg-[#18181b] border border-[#27272a] rounded-2xl text-[13px] font-black text-[#fafafa] transition-all hover:border-blue-500/40 shadow-2xl group/btn">
              <div className="flex items-center gap-3">
                 {noiseProfile.id === 'perfect' ? <Zap size={14} className="text-yellow-500" /> : <Cpu size={14} className="text-blue-500" />}
                 <span className="uppercase tracking-[0.2em]">{noiseProfile.id === 'perfect' ? 'Perfect Simulator' : 'IBM Hardware Profiling'}</span>
              </div>
              <ChevronDown size={14} className="text-[#3f3f46] group-hover/btn:text-blue-500 transition-colors" />
           </button>
           
           <div className="absolute top-full left-0 mt-3 w-72 bg-[#09090b] border border-[#27272a] rounded-2xl shadow-[0_30px_60px_-12px_rgba(0,0,0,0.9)] p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-100">
              {[
                { id: 'perfect', label: 'Ideal Local Q-Engine', desc: 'No gate or decoherence errors.' },
                { id: 'ibm_yorktown', label: 'IBM Yorktown Profile', desc: 'Realistic 5-qubit hardware noise.' },
                { id: 'noisy_high', label: 'Degraded High-Noise', desc: 'Stress-test error correction.' }
              ].map((p) => (
                <button 
                  key={p.id}
                  className={`w-full text-left px-5 py-4 hover:bg-[#18181b] rounded-2xl transition-all border border-transparent ${noiseProfile.id === p.id ? 'bg-[#18181b] border-[#27272a]' : ''}`}
                  onClick={() => { setNoiseProfile({ id: p.id, t1: p.id === 'perfect' ? 50.0 : 40.0 }); }}
                >
                   <div className="flex flex-col gap-1">
                      <span className={`text-[12px] font-black uppercase tracking-widest ${noiseProfile.id === p.id ? 'text-blue-500' : 'text-[#fafafa]'}`}>{p.label}</span>
                      <p className="text-[10px] text-[#71717a] font-black leading-tight italic uppercase">{p.desc}</p>
                   </div>
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Center Nav Segment */}
      <nav className="hidden lg:flex items-center gap-2 p-1.5 bg-[#18181b] border border-[#27272a] rounded-2xl scale-110 shadow-2xl">
        {[
          { id: 'circuit', label: 'DESIGNER', path: '/circuit' },
          { id: 'playground', label: 'QISKIT', path: '/playground' },
          { id: 'state', label: 'OBSERVER', path: '/state' }
        ].map(item => (
          <Link 
            key={item.id} 
            href={item.path} 
            className={`px-6 py-2.5 rounded-xl text-[12px] font-black tracking-[0.25em] transition-all duration-300 ${pathname === item.path ? 'bg-[#27272a] text-[#fafafa] shadow-lg border border-[#3f3f46]' : 'text-[#71717a] hover:text-[#fafafa]'}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right Action Hub */}
      <div className="flex items-center gap-4 md:gap-10">
        <div className="hidden xl:flex items-center gap-5 bg-[#18181b] px-6 py-2.5 rounded-2xl border border-[#27272a] shadow-inner">
          <span className="text-[11px] font-black uppercase text-[#3f3f46] tracking-[0.3em]">WIRES</span>
          <div className="flex items-center gap-5">
             <button onClick={() => setNumQubits(numQubits - 1)} disabled={numQubits <= MIN_QUBITS} className="text-[#a1a1aa] hover:text-[#fafafa] disabled:opacity-5 transition-colors"><Minus size={18} /></button>
             <span className="text-[16px] font-black text-[#fafafa] font-mono min-w-[20px] text-center tracking-tighter">{numQubits}</span>
             <button onClick={() => setNumQubits(numQubits + 1)} disabled={numQubits >= MAX_QUBITS} className="text-[#a1a1aa] hover:text-[#fafafa] disabled:opacity-5 transition-colors"><Plus size={18} /></button>
          </div>
        </div>
        
        <button 
          onClick={runSimulation}
          className="group flex items-center gap-4 px-8 md:px-10 py-3.5 bg-[#2563eb] hover:bg-[#3b82f6] font-black text-white rounded-2xl text-[13px] md:text-[14px] tracking-[0.25em] shadow-[0_15px_40px_rgba(37,99,235,0.4)] transition-all active:scale-95 uppercase border border-white/10"
        >
          <Play size={20} fill="currentColor" stroke="none" className="group-hover:scale-125 transition-all animate-pulse shadow-2xl" />
          <span className="hidden sm:inline">EXECUTE DESIGN</span>
          <span className="sm:hidden">ENGAGE</span>
        </button>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-3 hover:bg-[#18181b] rounded-2xl text-[#fafafa] border border-[#27272a] shadow-lg"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Interaction - Boosted Size */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-[#09090b] border-b border-[#27272a] flex flex-col p-10 gap-8 z-[110] lg:hidden shadow-2xl animate-slide-up">
           <div className="flex flex-col gap-4">
            {[
              { id: 'circuit', label: 'QUANTUM DESIGNER', path: '/circuit' },
              { id: 'playground', label: 'QISKIT PYTHON LAB', path: '/playground' },
              { id: 'state', label: 'STATE OBSERVER', path: '/state' }
            ].map(item => (
              <button 
                key={item.id} 
                onClick={() => { router.push(item.path); setMobileMenuOpen(false); }}
                className={`w-full text-left p-6 rounded-2xl text-[16px] font-black tracking-widest transition-all ${pathname === item.path ? 'bg-[#18181b] text-blue-500 shadow-2xl border border-blue-500/20' : 'text-[#71717a] hover:bg-[#18181b]/50'}`}
              >
                {item.label}
              </button>
            ))}
           </div>
           
           <div className="h-[1px] bg-[#27272a] mx-2" />
           
           <div className="flex items-center justify-between p-2">
              <span className="text-[11px] font-black text-[#52525b] uppercase tracking-[0.4em]">HARDWARE CONTROL</span>
              <div className="flex gap-10">
                <button onClick={undo} disabled={undoStack.length === 0} className="text-[#fafafa] disabled:opacity-5"><Undo2 size={28} /></button>
                <button onClick={redo} disabled={redoStack.length === 0} className="text-[#fafafa] disabled:opacity-5"><Redo2 size={28} /></button>
              </div>
           </div>
        </div>
      )}
    </header>
  );
}
