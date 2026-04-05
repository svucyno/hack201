'use client';

import React, { useState } from 'react';
import useStore from '../shared/store';
import { TIME_SLOTS, GATE_TYPES } from '../shared/constants';

const GateIcon = ({ type, onClick, selected, id, qubit, time }) => {
  const gateInfo = GATE_TYPES[type];

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('gateId', id);
        e.dataTransfer.setData('gateType', type);
      }}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`
        absolute w-12 h-12 flex items-center justify-center 
        rounded-xl cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 
        ${gateInfo.color} transition-all duration-300 z-20 border border-white/20
        ${selected ? 'ring-4 ring-blue-500/30 scale-125 active-gate shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50' : 'hover:scale-110 hover:shadow-2xl shadow-black/50'}
      `}
      style={{ left: `${(time / (TIME_SLOTS - 1)) * 100}%`, top: '50%' }}
    >
      <span className="text-white text-[13px] font-black uppercase tracking-tighter leading-none select-none">
        {gateInfo.symbol}
      </span>
      {gateInfo.parameterized && (
         <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default function QubitWire({ qubitIndex }) {
  const { gates, addGate, moveGate, selectGate, selectedGateId } = useStore();
  const [hoverTime, setHoverTime] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    setHoverTime(null);
    const gateType = e.dataTransfer.getData('gateType');
    const existingGateId = e.dataTransfer.getData('gateId');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = Math.round((x / rect.width) * (TIME_SLOTS - 1));
    const clampTime = Math.max(0, Math.min(TIME_SLOTS - 1, time));

    if (existingGateId) {
      moveGate(existingGateId, qubitIndex, clampTime);
    } else {
      addGate({ type: gateType, qubit: qubitIndex, time: clampTime });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = Math.round((x / rect.width) * (TIME_SLOTS - 1));
    setHoverTime(time);
  };

  const handleDragLeave = () => setHoverTime(null);
  const qubitGates = gates.filter(g => g.qubit === qubitIndex);

  return (
    <div className="flex items-center gap-10 h-20 group relative overflow-visible">
      {/* Label - ENHANCED SIZE */}
      <div className="w-28 h-12 flex items-center justify-center shrink-0 border border-[#27272a] bg-[#09090b] rounded-2xl transition-all group-hover:border-blue-500/50 shadow-2xl group-hover:shadow-blue-500/10 active:scale-95">
        <span className="text-[14px] font-mono font-black text-[#71717a] group-hover:text-[#fafafa] uppercase tracking-widest italic transition-colors">
           | q{qubitIndex} ⟩
        </span>
      </div>

      {/* Track - HIGH INTERACTION */}
      <div 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => selectGate(null)}
        className="relative flex-1 h-16 flex items-center cursor-crosshair px-6 group-hover:bg-[#18181b]/50 transition-all duration-300 rounded-2xl shadow-inner shadow-black/50"
      >
        <div className="wire-line opacity-30 shadow-[0_0_20px_rgba(255,255,255,0.03)]" />
        
        {/* Ghost Position Indicator */}
        {hoverTime !== null && (
           <div 
             className="absolute w-12 h-12 border-2 border-dashed border-[#3f3f46] rounded-xl -translate-x-1/2 -translate-y-1/2 opacity-50 animate-pulse pointer-events-none transition-all duration-75"
             style={{ left: `${(hoverTime / (TIME_SLOTS - 1)) * 100}%`, top: '50%' }}
           />
        )}

        {/* Render Gates */}
        <div className="relative w-full h-full">
          {qubitGates.map((gate) => (
            <GateIcon
              key={gate.id}
              {...gate}
              selected={selectedGateId === gate.id}
              onClick={() => selectGate(gate.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
