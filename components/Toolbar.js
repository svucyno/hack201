'use client';

import React from 'react';
import { Undo2, Redo2, Trash2, Play, Plus, Minus, ArrowLeft, ChevronDown } from 'lucide-react';
import useStore from '../shared/store';
import { MAX_QUBITS, MIN_QUBITS } from '../shared/constants';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function Toolbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { 
    numQubits, setNumQubits,
    undo, redo, undoStack, redoStack,
    resetCircuit, gates, setSimulationLoading, setSimulationResults, setSimulationError
  } = useStore();

  const runSimulation = async () => {
    setSimulationLoading(true);
    try {
      const resp = await fetch('http://localhost:8000/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numQubits, gates }),
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
    <header className="h-14 border-b border-[#27272a] bg-[#09090b] flex items-center justify-between px-6 shrink-0 z-50">
      {/* Left Control Group */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.push('/')}
          className="p-1.5 hover:bg-[#18181b] rounded-md text-[#71717a] transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        
        <div className="flex items-center gap-1.5 ml-2">
          <button 
            onClick={undo}
            disabled={undoStack.length === 0}
            className="p-1.5 hover:bg-[#18181b] rounded-md text-[#71717a] disabled:opacity-20"
          >
            <Undo2 size={16} />
          </button>
          <button 
            onClick={redo}
            disabled={redoStack.length === 0}
            className="p-1.5 hover:bg-[#18181b] rounded-md text-[#71717a] disabled:opacity-20"
          >
            <Redo2 size={16} />
          </button>
        </div>

        <div className="w-[1px] h-4 bg-[#27272a] mx-2" />

        <div className="relative group">
           <button className="flex items-center gap-2 px-3 py-1.5 bg-[#18181b] border border-[#27272a] rounded-lg text-[11px] font-semibold text-[#fafafa] transition-all hover:border-[#3f3f46]">
              Presets <ChevronDown size={12} className="text-[#a1a1aa]" />
           </button>
           <div className="absolute top-full left-0 mt-2 w-48 bg-[#09090b] border border-[#27272a] rounded-lg shadow-2xl p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-100">
              {['Bell State', 'GHZ State', 'Deutsch Algorithm', 'QFT (3-Qbit)'].map((p) => (
                <button 
                  key={p}
                  className="w-full text-left px-3 py-2 hover:bg-[#18181b] rounded-md text-[11px] text-[#71717a] hover:text-[#fafafa] transition-colors"
                  onClick={() => {
                    resetCircuit();
                    // Preset loading logic...
                  }}
                >
                  {p}
                </button>
              ))}
           </div>
        </div>

        <button 
          onClick={resetCircuit}
          className="p-1.5 hover:bg-[#18181b] rounded-md text-[#71717a] hover:text-red-400 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Nav Segment - Minimalist Toggle */}
      <nav className="flex items-center gap-1 p-1 bg-[#18181b] border border-[#27272a] rounded-xl scale-95">
        {[
          { id: 'circuit', label: 'Circuit', path: '/circuit' },
          { id: 'playground', label: 'Qiskit Python', path: '/playground' },
          { id: 'state', label: 'Observer', path: '/state' }
        ].map(item => (
          <Link 
            key={item.id} 
            href={item.path} 
            className={`px-4 py-1.5 rounded-lg text-[11px] font-bold tracking-tight transition-all duration-200 ${pathname === item.path ? 'bg-[#27272a] text-[#fafafa] shadow-sm' : 'text-[#71717a] hover:text-[#fafafa]'}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Right Action Group */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 bg-[#18181b] px-3 py-1.5 rounded-lg border border-[#27272a]">
          <span className="text-[10px] font-black uppercase text-[#71717a] tracking-widest">Qubits</span>
          <div className="flex items-center gap-3">
             <button onClick={() => setNumQubits(numQubits - 1)} disabled={numQubits <= MIN_QUBITS} className="text-[#a1a1aa] hover:text-[#fafafa] disabled:opacity-20"><Minus size={12} /></button>
             <span className="text-xs font-bold text-[#fafafa] font-mono min-w-[12px] text-center">{numQubits}</span>
             <button onClick={() => setNumQubits(numQubits + 1)} disabled={numQubits >= MAX_QUBITS} className="text-[#a1a1aa] hover:text-[#fafafa] disabled:opacity-20"><Plus size={12} /></button>
          </div>
        </div>
        
        <button 
          onClick={runSimulation}
          className="flex items-center gap-2.5 px-6 py-2 bg-[#2563eb] hover:bg-[#3b82f6] font-bold text-white rounded-lg text-[11px] shadow-sm transition-all active:scale-95"
        >
          <Play size={12} fill="currentColor" stroke="none" />
          RUN SIMULATION
        </button>
      </div>
    </header>
  );
}
