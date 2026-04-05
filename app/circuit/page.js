'use client';

import React, { useState } from 'react';
import useStore from '../../shared/store';
import Toolbar from '../../components/Toolbar';
import GatePalette from '../../components/GatePalette';
import CircuitEditor from '../../components/CircuitEditor';
import RightSidebar from '../../components/RightSidebar';
import { LayoutGrid, BarChart3, X } from 'lucide-react';

export default function QFluxIDE() {
  const { numQubits, gates } = useStore();
  const [activeMobilePanel, setActiveMobilePanel] = useState(null); // 'palette' | 'sidebar' | null

  return (
    <main className="flex flex-col h-screen w-full bg-[#000000] text-[#fafafa] overflow-hidden">
      {/* Top Header/Toolbar - Now Responsive */}
      <Toolbar />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Gate Palette - HIDDEN ON MOBILE, SHOW AS DRAWER */}
        <aside className="hidden lg:flex w-72 xl:w-80 flex-col z-10 border-r border-[#27272a] bg-[#000000]">
          <GatePalette />
        </aside>

        {/* Center: Circuit Canvas (Main Workspace) - SCRollable and Responsive */}
        <section className="flex-1 overflow-auto relative bg-[#000000] p-4 sm:p-8 lg:p-12 custom-scrollbar flex items-start justify-center">
            {/* Horizontal Scroll wrapper for small devices */}
            <div className="min-w-full lg:min-w-0 flex items-start justify-center">
               <CircuitEditor />
            </div>
        </section>

        {/* Right: Analysis & Properties - HIDDEN ON MOBILE, SHOW AS DRAWER */}
        <aside className="hidden lg:flex w-80 xl:w-96 flex-col z-10 border-l border-[#27272a] bg-[#000000]">
          <RightSidebar />
        </aside>

        {/* Mobile Navigation Bar - Fixed at Bottom of Viewport */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#09090b] border-t border-[#27272a] flex items-center justify-around px-4 z-[90] shadow-2xl">
           <button 
             onClick={() => setActiveMobilePanel(activeMobilePanel === 'palette' ? null : 'palette')}
             className={`flex flex-col items-center gap-1 transition-all ${activeMobilePanel === 'palette' ? 'text-blue-500' : 'text-[#71717a]'}`}
           >
             <LayoutGrid size={20} />
             <span className="text-[9px] font-black uppercase tracking-widest">Operators</span>
           </button>
           
           <div className="w-px h-6 bg-[#27272a]" />
           
           <button 
             onClick={() => setActiveMobilePanel(activeMobilePanel === 'sidebar' ? null : 'sidebar')}
             className={`flex flex-col items-center gap-1 transition-all ${activeMobilePanel === 'sidebar' ? 'text-blue-500' : 'text-[#71717a]'}`}
           >
             <BarChart3 size={20} />
             <span className="text-[9px] font-black uppercase tracking-widest">Analysis</span>
           </button>
        </div>

        {/* Mobile Drawers (Overlays) */}
        {activeMobilePanel === 'palette' && (
           <div className="lg:hidden absolute inset-0 z-[110] bg-[#000000] animate-fade-in flex flex-col pb-16">
              <div className="flex items-center justify-between p-6 border-b border-[#27272a]">
                 <span className="text-[10px] font-black text-[#71717a] uppercase tracking-[0.2em]">Select Gate</span>
                 <button onClick={() => setActiveMobilePanel(null)} className="p-2 hover:bg-[#18181b] rounded-full"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto">
                 <GatePalette />
              </div>
           </div>
        )}

        {activeMobilePanel === 'sidebar' && (
           <div className="lg:hidden absolute inset-0 z-[110] bg-[#000000] animate-fade-in flex flex-col pb-16">
              <div className="flex items-center justify-between p-6 border-b border-[#27272a]">
                 <span className="text-[10px] font-black text-[#71717a] uppercase tracking-[0.2em]">State Results</span>
                 <button onClick={() => setActiveMobilePanel(null)} className="p-2 hover:bg-[#18181b] rounded-full"><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto">
                 <RightSidebar />
              </div>
           </div>
        )}
      </div>

      {/* Responsive Footer - Simplified for Mobile */}
      <footer className="hidden sm:flex h-8 border-t border-[#27272a] bg-[#09090b] px-6 items-center justify-between text-[9px] text-[#71717a] uppercase font-black tracking-widest z-[100]">
        <div className="flex gap-8 items-center">
           <span>WIRES: {numQubits}</span>
           <span className="hidden md:inline text-[#3f3f46]">|</span>
           <span>DEPTH: {gates.length}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="opacity-50">Local Simulation Engine</span>
          <div className="w-1 h-1 bg-green-500 rounded-full" />
        </div>
      </footer>
    </main>
  );
}
