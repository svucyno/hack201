'use client';

import React, { useEffect } from 'react';
import useStore from '../shared/store';
import Toolbar from '../components/Toolbar';
import GatePalette from '../components/GatePalette';
import CircuitEditor from '../components/CircuitEditor';
import RightSidebar from '../components/RightSidebar';

export default function QFluxIDE() {
  const { numQubits, gates } = useStore();

  return (
    <main className="flex flex-col h-screen w-full bg-slate-950 text-slate-50 overflow-hidden">
      {/* Top Header/Toolbar */}
      <Toolbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Gate Palette */}
        <aside className="w-64 border-r border-slate-800 bg-slate-900/50 flex flex-col">
          <GatePalette />
        </aside>

        {/* Center: Circuit Canvas (Main Workspace) */}
        <section className="flex-1 overflow-auto relative bg-slate-950 p-8 custom-scrollbar">
          <CircuitEditor />
        </section>

        {/* Right: Analysis & Properties */}
        <aside className="w-80 border-l border-slate-800 bg-slate-900/50 flex flex-col">
          <RightSidebar />
        </aside>
      </div>

      {/* Footer / Status Bar */}
      <footer className="h-8 border-t border-slate-800 bg-slate-900 px-4 flex items-center justify-between text-xs text-slate-500">
        <div className="flex gap-4">
          <span>Qubits: {numQubits}</span>
          <span>Gates: {gates.length}</span>
        </div>
        <div>
          Engine: Qiskit Aer (Local)
        </div>
      </footer>
    </main>
  );
}
