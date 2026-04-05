'use client';

import React from 'react';
import useStore from '../shared/store';
import { Trash2, Hash, Layers, ShieldCheck } from 'lucide-react';
import { GATE_TYPES } from '../shared/constants';

export default function PropertiesPanel() {
  const { selectedGateId, gates, updateGate, removeGate, numQubits } = useStore();

  const gate = gates.find((g) => g.id === selectedGateId);
  if (!gate) return null;

  const gateInfo = GATE_TYPES[gate.type];

  return (
    <div className="flex flex-col gap-10 animate-fade-in h-full">
      {/* Header Tier */}
      <div className="flex items-center justify-between border-b border-[#27272a] pb-8 mb-2 group">
        <div className="flex items-center gap-6">
          <div className={`${gateInfo.color} w-16 h-16 rounded-2xl flex items-center justify-center text-[18px] font-black text-white shadow-2xl transition-all group-hover:scale-110 active:scale-95`}>
            {gateInfo.symbol}
          </div>
          <div className="space-y-1">
            <h3 className="text-[15px] font-black text-[#fafafa] uppercase tracking-tighter italic">Unitary Identity</h3>
            <div className="flex items-center gap-2">
               <ShieldCheck size={12} className="text-emerald-500" />
               <span className="text-[11px] text-[#71717a] font-mono font-black uppercase tracking-widest">{gate.type}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => removeGate(gate.id)}
          className="p-3 text-[#71717a] hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all border border-transparent hover:border-red-500/20 group/btn"
        >
          <Trash2 size={20} className="group-hover/btn:scale-110 transition-transform" />
        </button>
      </div>

      {/* Configuration Tier */}
      <div className="space-y-12">
        {/* Qubit Selection Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
             <label className="text-[12px] font-black text-[#71717a] uppercase tracking-[0.25em] flex items-center gap-2">
                <Layers size={14} className="text-[#3b82f6]" /> CONTROL
             </label>
             <select
               value={gate.qubit}
               onChange={(e) => updateGate(gate.id, { qubit: parseInt(e.target.value) })}
               className="w-full bg-[#0d1117] border border-[#27272a] rounded-xl text-[13px] font-bold text-[#fafafa] px-5 py-3 focus:border-blue-500/50 shadow-xl appearance-none cursor-pointer hover:bg-[#18181b] transition-all"
             >
               {Array.from({ length: numQubits }).map((_, i) => (
                 <option key={i} value={i} className="py-2 bg-[#0d1117]">Qubit {i}</option>
               ))}
             </select>
          </div>
          {gateInfo.multiQubit && (
            <div className="space-y-4 animate-slide-up">
               <label className="text-[12px] font-black text-[#71717a] uppercase tracking-[0.25em] flex items-center gap-2">
                  <Layers size={14} className="text-[#2563eb]" /> TARGET
               </label>
               <select
                 value={gate.target}
                 onChange={(e) => updateGate(gate.id, { target: parseInt(e.target.value) })}
                 className="w-full bg-[#0d1117] border border-[#27272a] rounded-xl text-[13px] font-bold text-[#fafafa] px-5 py-3 focus:border-blue-500/50 shadow-xl appearance-none cursor-pointer hover:bg-[#18181b] transition-all"
               >
                 {Array.from({ length: numQubits }).map((_, i) => (
                   <option key={i} value={i} disabled={i === gate.qubit} className="py-2 bg-[#0d1117]">Qubit {i}</option>
                 ))}
               </select>
            </div>
          )}
        </div>

        {/* Rotation Parameter Tier */}
        {gateInfo.parameterized && (
           <div className="space-y-8 pt-6 animate-slide-up">
              <div className="flex justify-between items-end border-b border-[#27272a]/50 pb-4">
                 <label className="text-[13px] font-black text-[#fafafa] tracking-tight uppercase italic flex items-center gap-2">
                    <Hash size={16} className="text-[#2563eb]" /> Angle (Theta)
                 </label>
                 <span className="text-[15px] font-mono text-blue-500 font-black tracking-tighter">
                   {(gate.params?.theta || 0).toFixed(4)} rad
                 </span>
              </div>
              <input
                type="range"
                min="0"
                max="6.2831" 
                step="0.01"
                value={gate.params?.theta || 0}
                onChange={(e) => updateGate(gate.id, { params: { ...gate.params, theta: parseFloat(e.target.value) } })}
                className="w-full h-2 bg-[#18181b] rounded-lg appearance-none cursor-pointer accent-[#2563eb] transition-all hover:bg-[#27272a]"
              />
              <div className="flex justify-between text-[10px] font-black font-mono text-[#3f3f46] uppercase tracking-[0.3em] px-2">
                 <span>0.00π</span>
                 <span className="text-[#71717a]">π</span>
                 <span>2.00π</span>
              </div>
           </div>
        )}
      </div>

      <div className="mt-auto p-6 bg-[#09090b] rounded-2xl border border-[#27272a] shadow-inner">
         <p className="text-[11px] text-[#3f3f46] font-black tracking-widest uppercase leading-relaxed text-center italic">
            Synchronized with <br /> AerSimulator Engine.
         </p>
      </div>
    </div>
  );
}
