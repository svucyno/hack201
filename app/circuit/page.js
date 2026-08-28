'use client';

import React, { useState } from 'react';
import useStore from '../../shared/store';
import Toolbar from '../../components/Toolbar';
import GatePalette from '../../components/GatePalette';
import CircuitEditor from '../../components/CircuitEditor';
import RightSidebar from '../../components/RightSidebar';
import { LayoutGrid, BarChart3, X, Activity, Cpu } from 'lucide-react';

export default function QFluxIDE() {
  const { numQubits, gates, noiseProfile } = useStore();
  const [activeMobilePanel, setActiveMobilePanel] = useState(null); // 'palette' | 'sidebar' | null

  return (
    <main className="flex flex-col h-screen w-full bg-[#030712] text-slate-100 overflow-hidden quantum-grid-bg">
      {/* Top Header / Toolbar */}
      <Toolbar />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Gate Palette (Sidebar) */}
        <aside className="hidden lg:flex w-72 xl:w-80 flex-col z-10 border-r border-white/10 bg-slate-950/80 glass-panel">
          <GatePalette />
        </aside>

        {/* Center: Circuit Canvas Workspace */}
        <section className="flex-1 overflow-auto relative p-4 sm:p-8 lg:p-10 custom-scrollbar flex items-start justify-center">
          <div className="min-w-full lg:min-w-0 flex items-start justify-center w-full">
            <CircuitEditor />
          </div>
        </section>

        {/* Right: Analysis, Telemetry & 3D States */}
        <aside className="hidden lg:flex w-80 xl:w-96 flex-col z-10 border-l border-white/10 bg-slate-950/80 glass-panel">
          <RightSidebar />
        </aside>

        {/* Mobile Navigation Bar - Fixed at Bottom of Viewport */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 glass-dropdown border-t border-white/10 flex items-center justify-around px-4 z-40 shadow-2xl">
          <button 
            onClick={() => setActiveMobilePanel(activeMobilePanel === 'palette' ? null : 'palette')}
            className={`flex flex-col items-center gap-1 transition-all ${activeMobilePanel === 'palette' ? 'text-cyan-400' : 'text-slate-400'}`}
          >
            <LayoutGrid size={18} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Operators</span>
          </button>
          
          <div className="w-px h-6 bg-white/10" />
          
          <button 
            onClick={() => setActiveMobilePanel(activeMobilePanel === 'sidebar' ? null : 'sidebar')}
            className={`flex flex-col items-center gap-1 transition-all ${activeMobilePanel === 'sidebar' ? 'text-cyan-400' : 'text-slate-400'}`}
          >
            <BarChart3 size={18} />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">Analysis</span>
          </button>
        </div>

        {/* Mobile Drawers (Overlays) */}
        {activeMobilePanel === 'palette' && (
          <div className="lg:hidden absolute inset-0 z-50 bg-slate-950 flex flex-col pb-16 animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">Select Operator</span>
              <button onClick={() => setActiveMobilePanel(null)} className="p-2 hover:bg-white/10 rounded-xl text-slate-400">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <GatePalette />
            </div>
          </div>
        )}

        {activeMobilePanel === 'sidebar' && (
          <div className="lg:hidden absolute inset-0 z-50 bg-slate-950 flex flex-col pb-16 animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">Simulation Analysis</span>
              <button onClick={() => setActiveMobilePanel(null)} className="p-2 hover:bg-white/10 rounded-xl text-slate-400">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <RightSidebar />
            </div>
          </div>
        )}
      </div>

      {/* Status Footer */}
      <footer className="hidden sm:flex h-8 border-t border-white/10 bg-slate-950/95 px-6 items-center justify-between text-[10px] font-mono text-slate-400 z-30">
        <div className="flex gap-6 items-center">
          <span className="text-white font-bold">WIRES: <span className="text-cyan-400">{numQubits}</span></span>
          <span className="text-slate-700">|</span>
          <span>GATE COUNT: <span className="text-cyan-400">{gates.length}</span></span>
          <span className="text-slate-700">|</span>
          <span>NOISE: <span className="text-slate-300">{noiseProfile?.label || 'Ideal'}</span></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400">AerSimulator Python Backend</span>
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_6px_#10b981]" />
        </div>
      </footer>
    </main>
  );
}
