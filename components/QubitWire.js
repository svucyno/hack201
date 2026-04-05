'use client';

import React from 'react';
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
        absolute w-10 h-10 flex items-center justify-center 
        rounded-lg cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 
        ${gateInfo.color} transition-all duration-200 z-20 border border-white/10
        ${selected ? 'ring-2 ring-white ring-offset-2 ring-offset-[#000000] scale-110 active-gate' : 'hover:scale-105 shadow-black/50 shadow-black/30'}
      `}
      style={{ left: `${(time / (TIME_SLOTS - 1)) * 100}%`, top: '50%' }}
    >
      <span className="text-white text-[10px] font-black uppercase tracking-tighter leading-none mb-0.5">
        {gateInfo.symbol}
      </span>
      {gateInfo.parameterized && (
         <div className="absolute top-1 right-1 w-1 h-1 bg-white/40 rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default function QubitWire({ qubitIndex }) {
  const { gates, addGate, moveGate, selectGate, selectedGateId } = useStore();

  const handleDrop = (e) => {
    e.preventDefault();
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

  const handleDragOver = (e) => e.preventDefault();
  const qubitGates = gates.filter(g => g.qubit === qubitIndex);

  return (
    <div className="flex items-center gap-4 h-12 group relative">
      {/* Label - Compact Rich Style */}
      <div className="w-16 h-8 flex items-center justify-center shrink-0 border border-[#27272a] bg-[#09090b] rounded transition-all group-hover:border-[#3b82f6]/50">
        <span className="text-[10px] font-mono font-bold text-[#71717a] group-hover:text-[#fafafa] uppercase">
           |q{qubitIndex}⟩
        </span>
      </div>

      {/* Track - Sleek Line */}
      <div 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => selectGate(null)}
        className="relative flex-1 h-10 flex items-center cursor-crosshair px-4 group-hover:bg-[#18181b]/30 transition-all rounded"
      >
        <div className="wire-line opacity-50" />
        
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
