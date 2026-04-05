'use client';

import React from 'react';
import { Undo2, Redo2, Play, Plus, Minus, FileCode, Beaker, Layout, Code2 } from 'lucide-react';
import useStore from '../shared/store';
import { MAX_QUBITS, MIN_QUBITS } from '../shared/constants';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Toolbar() {
  const pathname = usePathname();
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
    <header className="h-16 border-b border-white/5 bg-slate-950/80 backdrop-blur-2xl flex items-center justify-between px-8 shrink-0 z-50 sticky top-0">
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-4 transition-transform active:scale-95 group">
           <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-lg flex items-center justify-center p-1 font-black text-white shadow-xl shadow-blue-500/10 group-hover:shadow-blue-500/30">Q</div>
           <h1 className="text-xl font-black bg-gradient-to-r from-blue-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-2 tracking-tighter">
             QFlux <span className="text-[10px] text-blue-500/50 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 shadow-sm font-mono tracking-widest uppercase">Engine 2.0</span>
           </h1>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3 p-1 bg-slate-900/50 rounded-xl border border-white/5 shadow-inner shadow-black/20">
          <Link href="/" className={`px-4 py-2 rounded-lg text-xs font-black tracking-widest uppercase flex items-center gap-3 transition-all ${pathname === '/' ? 'bg-slate-800 text-blue-400 shadow-lg shadow-black/30' : 'text-slate-500 hover:text-slate-300'}`}>
            <Layout size={14} /> Designer
          </Link>
          <Link href="/playground" className={`px-4 py-2 rounded-lg text-xs font-black tracking-widest uppercase flex items-center gap-3 transition-all ${pathname === '/playground' ? 'bg-slate-800 text-blue-400 shadow-lg shadow-black/30' : 'text-slate-500 hover:text-slate-300'}`}>
            <Code2 size={14} /> Playground
          </Link>
        </nav>

        {/* Action Controls (Designer Only) */}
        {pathname === '/' && (
          <div className="flex items-center gap-6 animate-in slide-in-from-left-4 duration-700">
            <div className="flex items-center gap-3 bg-slate-900/50 p-1 rounded-xl border border-white/5 shadow-inner shadow-black/20">
              <button 
                className="p-1 px-2 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 text-slate-400 active:scale-90"
                onClick={() => setNumQubits(numQubits - 1)}
                disabled={numQubits <= MIN_QUBITS}
              >
                <Minus size={14} />
              </button>
              <span className="text-xs font-mono font-black w-24 text-center text-slate-300 tracking-tighter border-x border-white/5 mx-1 uppercase">
                {numQubits} Qubits
              </span>
              <button 
                className="p-1 px-2 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 text-slate-400 active:scale-90"
                onClick={() => setNumQubits(numQubits + 1)}
                disabled={numQubits >= MAX_QUBITS}
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button 
                className="p-2 hover:bg-slate-900 rounded-lg disabled:opacity-20 transition-all active:scale-90 group/btn" 
                onClick={undo}
                disabled={undoStack.length === 0}
                title="Undo (Ctrl+Z)"
              >
                <Undo2 size={18} className="group-hover/btn:text-blue-400" />
              </button>
              <button 
                className="p-2 hover:bg-slate-900 rounded-lg disabled:opacity-20 transition-all active:scale-90 group/btn" 
                onClick={redo}
                disabled={redoStack.length === 0}
                title="Redo (Ctrl+Shift+Z)"
              >
                <Redo2 size={18} className="group-hover/btn:text-blue-400" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {pathname === '/' && (
           <button 
             className="px-4 py-2 text-slate-500 hover:text-slate-300 text-xs font-black tracking-widest uppercase transition-all active:scale-95"
             onClick={resetCircuit}
           >
             Reset Lab
           </button>
        )}
        
        <button 
          className="flex items-center gap-3 px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black rounded-xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 ring-4 ring-blue-500/10 active:ring-blue-500/30 uppercase tracking-[2px] border-b-2 border-blue-700"
          onClick={runSimulation}
        >
          <Play size={14} fill="currentColor" stroke="none" />
          {pathname === '/playground' ? 'Execute Playground' : 'Finalize Simulation'}
        </button>
      </div>
    </header>
  );
}
