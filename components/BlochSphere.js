'use client';

import React from 'react';
import useStore from '../shared/store';
import { Activity, Radio, Cpu, Target } from 'lucide-react';

export default function BlochSphere() {
  const { numQubits, simulationResults } = useStore();
  const { blochVectors, loading } = simulationResults;

  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      <div className="flex items-center justify-between border-b border-[#27272a] pb-6">
         <h3 className="text-[13px] font-black tracking-[0.3em] text-[#fafafa] uppercase italic">State Observation</h3>
         <div className="flex items-center gap-2">
            <Radio size={14} className="text-blue-500 animate-pulse" />
            <span className="text-[10px] font-black uppercase text-[#71717a] tracking-widest">Microwave Sync</span>
         </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {Array.from({ length: numQubits }).map((_, i) => (
          <div key={i} className="flex flex-col items-center justify-center p-10 bg-[#09090b] rounded-2xl border border-[#27272a] group hover:border-blue-500/20 transition-all shadow-xl">
            {/* Header Tier */}
            <div className="flex items-center gap-4 mb-8 w-full border-b border-[#27272a]/50 pb-4">
               <Target size={14} className="text-[#3b82f6]" />
               <h4 className="text-[12px] font-black text-[#fafafa] uppercase tracking-[0.2em] italic">Qubit |q{i}⟩ Projection</h4>
            </div>

            {/* 🌑 WOW FACTOR: ROTATING BLOCH INTERFACE */}
            <div className="relative w-40 h-40 flex items-center justify-center border-2 border-[#27272a] rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden bg-[#000000] group-hover:border-blue-600/40 transition-all group-hover:scale-105">
                 {/* Sphere Axes */}
                 <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-blue-500/30 via-transparent to-purple-500/30" />
                 <div className="w-px h-full bg-[#18181b] absolute left-1/2 opacity-50" />
                 <div className="w-full h-px bg-[#18181b] absolute top-1/2 opacity-50" />
                 <div className="absolute inset-0 border border-[#27272a]/30 rounded-full scale-[0.7] rotate-45" />
                 
                 {/* Vector Pointer - Animated Depth */}
                 <div className="h-20 w-1 bg-gradient-to-t from-blue-700 to-blue-400 absolute left-1/2 bottom-1/2 origin-bottom shadow-[0_0_20px_rgba(37,99,235,0.8)] transition-all duration-700 ease-out z-20 rounded-full" 
                   style={{ transform: `rotate(${blochVectors ? (blochVectors[i]?.theta || 0) : 0}deg) scaleY(${blochVectors ? 1 : 0.2})` }}
                 />

                 {/* Pulse Glow Overlay */}
                 <div className="absolute inset-0 bg-blue-500/5 transition-opacity opacity-0 group-hover:opacity-100" />
            </div>

            {/* Micro-Pulse Visualizer Interface (Research WoW) */}
            <div className="w-full mt-10 space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-[#71717a] uppercase tracking-widest">Hardware Pulse Trace</span>
                  <Activity size={12} className="text-[#3b82f6]" />
               </div>
               <div className="h-12 bg-[#000000] border border-[#27272a] rounded-xl flex items-center px-4 gap-2 overflow-hidden relative group/pulse shadow-inner">
                  {/* Generated Pulse Waves (Mock Architecture) */}
                  <div className="flex-1 flex items-end gap-[1px] h-6 overflow-hidden">
                     {Array.from({ length: 40 }).map((_, idx) => (
                        <div 
                          key={idx} 
                          className="w-1 bg-[#18181b] group-hover/pulse:bg-blue-500/40 transition-all rounded-t-sm"
                          style={{ 
                            height: `${Math.random() * 80 + 20}%`, 
                            transitionDelay: `${idx * 20}ms`,
                            animation: `pulseHeight 3s infinite alternate ${idx * 0.1}s` 
                          }}
                        />
                     ))}
                  </div>
                  <style jsx>{`
                    @keyframes pulseHeight {
                      from { height: 20%; }
                      to { height: 90%; }
                    }
                  `}</style>
               </div>
            </div>

            {/* Coordinates - Enhanced Size */}
            <div className="grid grid-cols-3 gap-3 mt-10 w-full">
                 <div className="flex flex-col gap-1 p-3 bg-[#0d1117] border border-[#27272a] rounded-xl text-center">
                    <span className="text-[9px] font-black text-[#71717a] uppercase">X-AXIS</span>
                    <span className="text-[13px] font-mono font-black text-blue-500">{(blochVectors ? (blochVectors[i]?.x || 0) : 0).toFixed(3)}</span>
                 </div>
                 <div className="flex flex-col gap-1 p-3 bg-[#0d1117] border border-[#27272a] rounded-xl text-center">
                    <span className="text-[9px] font-black text-[#71717a] uppercase">Y-AXIS</span>
                    <span className="text-[13px] font-mono font-black text-blue-500">{(blochVectors ? (blochVectors[i]?.y || 0) : 0).toFixed(3)}</span>
                 </div>
                 <div className="flex flex-col gap-1 p-3 bg-[#0d1117] border border-[#27272a] rounded-xl text-center">
                    <span className="text-[9px] font-black text-[#71717a] uppercase">Z-AXIS</span>
                    <span className="text-[13px] font-mono font-black text-blue-500">{(blochVectors ? (blochVectors[i]?.z || 0) : 0).toFixed(3)}</span>
                 </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-[#09090b] rounded-2xl border border-[#27272a] text-center shadow-lg">
         <p className="text-[11px] text-[#3f3f46] font-black tracking-widest uppercase leading-relaxed italic">
            Visualizing single-qubit expectation values <br /> projected onto the unit sphere.
         </p>
      </div>
    </div>
  );
}
