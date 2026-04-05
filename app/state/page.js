'use client';

import React from 'react';
import useStore from '../../shared/store';
import Toolbar from '../../components/Toolbar';
import { Sparkles, Orbit, Binary } from 'lucide-react';

const FullBlochSphere = ({ index, data }) => {
  const theta = data?.theta || 0;
  const phi = data?.phi || 0;
  const x = data?.x?.toFixed(2) || "0.00";
  const y = data?.y?.toFixed(2) || "0.00";
  const z = data?.z?.toFixed(2) || "1.00";

  return (
    <div className="bg-[#161b22] p-8 rounded-xl border border-[#30363d] flex flex-col items-center gap-8 group hover:border-[#2f81f7] transition-all">
      <div className="flex items-center gap-3 w-full">
         <div className="w-10 h-10 bg-[#0d1117] rounded-md flex items-center justify-center text-[#2f81f7] font-black border border-[#30363d]">
           {index}
         </div>
         <div className="flex-1">
            <h3 className="text-sm font-bold text-[#f0f6fc] uppercase tracking-tight">Qubit State</h3>
            <span className="text-[10px] text-[#8b949e] font-mono uppercase">State Vector Observation</span>
         </div>
         <Orbit size={14} className="text-[#484f58]" />
      </div>

      <div className="relative w-64 h-64">
         <div className="absolute inset-0 rounded-full border border-[#30363d] bg-[#0d1117]" />
         {/* Simple Axes */}
         <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#30363d]" />
         <div className="absolute inset-y-0 left-1/2 w-[1px] bg-[#30363d]" />
         
         {/* Vector */}
         <div 
           className="absolute top-1/2 left-1/2 h-32 w-0.5 origin-bottom -translate-x-1/2 -translate-y-full transition-transform duration-1000"
           style={{ transform: `translateX(-50%) translateY(-100%) rotate(${theta}deg)` }}
         >
           <div className="absolute inset-0 bg-[#2f81f7] shadow-[0_0_10px_rgba(47,129,247,0.5)]" />
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full" />
         </div>

         <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#8b949e]">|0⟩</div>
         <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#8b949e]">|1⟩</div>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full mt-2">
         {[
           { l: 'X', v: x, c: 'text-[#7ee787]' },
           { l: 'Y', v: y, c: 'text-[#d29922]' },
           { l: 'Z', v: z, c: 'text-[#2f81f7]' }
         ].map((stat, i) => (
           <div key={i} className="flex flex-col items-center gap-1 p-2 bg-[#0d1117] rounded-md border border-[#30363d]">
              <span className="text-[9px] font-bold text-[#484f58] uppercase">{stat.l}</span>
              <span className={`text-[11px] font-mono font-bold ${stat.c}`}>{stat.v}</span>
           </div>
         ))}
      </div>
    </div>
  );
};

export default function BlochStatePage() {
  const { numQubits, simulationResults } = useStore();
  const { blochVectors, loading } = simulationResults;

  return (
    <main className="min-h-screen bg-[#0d1117] flex flex-col overflow-hidden">
      <Toolbar />
      
      <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
         <div className="max-w-6xl mx-auto flex flex-col gap-10">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#30363d]">
               <div className="space-y-2">
                  <div className="flex items-center gap-2 px-2 py-0.5 bg-[#2f81f7]/10 border border-[#2f81f7]/20 text-[#2f81f7] rounded text-[9px] font-bold uppercase tracking-widest w-fit">
                     <Sparkles size={10} /> Live Telemetry
                  </div>
                  <h1 className="text-4xl font-black text-[#f0f6fc] tracking-tighter uppercase italic">
                     Bloch <span className="text-[#8b949e]">Observation</span>
                  </h1>
               </div>
               
               <div className="flex items-center gap-6 bg-[#161b22] px-6 py-3 rounded-lg border border-[#30363d]">
                  <div className="flex flex-col">
                     <span className="text-[9px] font-bold uppercase text-[#484f58]">Qubits</span>
                     <span className="text-2xl font-bold text-[#f0f6fc]">{numQubits}</span>
                  </div>
                  <div className="w-px h-8 bg-[#30363d]" />
                  <div className="flex flex-col">
                     <span className="text-[9px] font-bold uppercase text-[#484f58]">Engine Status</span>
                     <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
                        <span className="text-sm font-bold text-[#8b949e]">
                           {loading ? 'SIMULATING' : 'IDLE'}
                        </span>
                     </div>
                  </div>
               </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {Array.from({ length: numQubits }).map((_, i) => (
                  <FullBlochSphere 
                    key={i} 
                    index={i} 
                    data={blochVectors ? blochVectors[i] : null} 
                  />
               ))}
            </div>
         </div>
      </div>
    </main>
  );
}
