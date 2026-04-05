'use client';

import React from 'react';
import useStore from '../shared/store';
import { Trash2, Hash, Layers } from 'lucide-react';
import { GATE_TYPES } from '../shared/constants';

export default function PropertiesPanel() {
  const { selectedGateId, gates, updateGate, removeGate, numQubits } = useStore();

  const gate = gates.find((g) => g.id === selectedGateId);
  if (!gate) return null;

  const gateInfo = GATE_TYPES[gate.type];

  return (
    <div className="flex flex-col gap-8 h-full bg-slate-900 border border-slate-800 rounded-2xl p-8 overflow-hidden shadow-2xl shadow-black/30">
      <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-2 group">
        <div className="flex items-center gap-4">
          <div className={`${gateInfo.color} w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg shadow-blue-500/10 group-hover:shadow-blue-500/20 active:scale-95 transition-all`}>
            {gateInfo.symbol}
          </div>
          <div>
            <h3 className="text-lg font-black text-slate-100 tracking-tight underline-offset-8 decoration-slate-700/50">Gate Properties</h3>
            <span className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase p-1 bg-slate-800/50 rounded-md border border-slate-700/30">Type: {gate.type}</span>
          </div>
        </div>
        <button
          onClick={() => removeGate(gate.id)}
          className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all active:scale-90 shadow-sm shadow-black/10 border border-transparent hover:border-red-500/50 group/btn"
        >
          <Trash2 size={18} className="group-hover/btn:animate-pulse" />
        </button>
      </div>

      <div className="space-y-10 mt-4">
        {/* Basic Configuration */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
             <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Layers size={12} className="text-slate-600" /> Primary Qubit
             </label>
             <select
               value={gate.qubit}
               onChange={(e) => updateGate(gate.id, { qubit: parseInt(e.target.value) })}
               className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-4 py-3 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner shadow-black/10 appearance-none cursor-pointer"
             >
               {Array.from({ length: numQubits }).map((_, i) => (
                 <option key={i} value={i}>Qubit {i}</option>
               ))}
             </select>
          </div>
          {gateInfo.multiQubit && (
            <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-500">
               <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Layers size={12} className="text-blue-500/50" /> Target Qubit
               </label>
               <select
                 value={gate.target}
                 onChange={(e) => updateGate(gate.id, { target: parseInt(e.target.value) })}
                 className="w-full bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-4 py-3 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner shadow-black/10 appearance-none cursor-pointer"
               >
                 {Array.from({ length: numQubits }).map((_, i) => (
                   <option key={i} value={i} disabled={i === gate.qubit}>Qubit {i}</option>
                 ))}
               </select>
            </div>
          )}
        </div>

        {/* Parameterized Configuration */}
        {gateInfo.parameterized && (
           <div className="space-y-6 pt-4 animate-in zoom-in-95 duration-500">
              <div className="flex justify-between items-center bg-slate-800/30 p-2 rounded-lg border border-slate-700/30">
                 <label className="text-[10px] font-bold text-slate-400 capitalize flex items-center gap-2">
                   <Hash size={12} className="text-orange-400" /> Angle (Theta)
                 </label>
                 <span className="text-[10px] font-mono text-orange-400 font-black p-1 bg-slate-900 rounded-md border border-orange-500/20 shadow-sm">
                   {(gate.params?.theta || 0).toFixed(4)} rad
                 </span>
              </div>
              <input
                type="range"
                min="0"
                max="6.2831" // 2pi
                step="0.01"
                value={gate.params?.theta || 0}
                onChange={(e) => updateGate(gate.id, { params: { ...gate.params, theta: parseFloat(e.target.value) } })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500 transition-all hover:bg-slate-700/50"
              />
              <div className="flex justify-between text-[8px] font-mono text-slate-600 uppercase tracking-widest px-1">
                 <span>0</span>
                 <span className="text-slate-700">π</span>
                 <span>2π</span>
              </div>
           </div>
        )}
      </div>

      <div className="mt-auto p-4 bg-slate-800/20 rounded-2xl border border-slate-700/20 shadow-inner group-hover:border-slate-700/50 transition-all">
         <p className="text-[10px] text-slate-500 italic leading-relaxed text-center font-medium opacity-70">
            Changes are saved automatically to the circuit state.
         </p>
      </div>
    </div>
  );
}
