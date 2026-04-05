'use client';

import React from 'react';
import useStore from '../../shared/store';
import Toolbar from '../../components/Toolbar';
import GatePalette from '../../components/GatePalette';
import CircuitEditor from '../../components/CircuitEditor';
import RightSidebar from '../../components/RightSidebar';

export default function QFluxIDE() {
  const { numQubits, gates } = useStore();

  return (
    <main className="flex flex-col h-screen w-full bg-[#000000] text-[#fafafa] overflow-hidden">
      {/* Top Header/Toolbar */}
      <Toolbar />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left: Gate Palette */}
        <aside className="w-80 flex flex-col z-10 border-r border-[#27272a] bg-[#000000]">
          <GatePalette />
        </aside>

        {/* Center: Circuit Canvas (Main Workspace) */}
        <section className="flex-1 overflow-auto relative bg-[#000000] p-12 custom-scrollbar flex items-start justify-center">
            <CircuitEditor />
        </section>

        {/* Right: Analysis & Properties */}
        <aside className="w-96 flex flex-col z-10 border-l border-[#27272a] bg-[#000000]">
          <RightSidebar />
        </aside>
      </div>

      {/* Subtle Bottom Bar */}
      <footer className="h-8 border-t border-[#27272a] bg-[#09090b] px-6 flex items-center justify-between text-[9px] text-[#71717a] uppercase font-black tracking-widest">
        <div className="flex gap-8 items-center">
           <span>WIRES: {numQubits}</span>
           <span>DEPTH: {gates.length}</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Engine: AerSimulator</span>
        </div>
      </footer>
    </main>
  );
}
