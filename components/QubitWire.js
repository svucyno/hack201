'use client';

import React from 'react';
import useStore from '../shared/store';
import { TIME_SLOTS, GATE_TYPES } from '../shared/constants';

const GateIcon = ({ type, onClick, selected, id, qubit, time }) => {
  const gateInfo = GATE_TYPES[type];

  const handleDragStart = (e) => {
    e.dataTransfer.setData('gateId', id);
    e.dataTransfer.setData('gateType', type);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`
        absolute w-12 h-12 flex flex-col items-center justify-center 
        rounded-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 
        ${gateInfo.color} active:scale-95 transition-all shadow-md z-10
        ${selected ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 border-2 border-white/50 active-gate scale-105' : 'hover:scale-105'}
      `}
      style={{ left: `${(time / TIME_SLOTS) * 100}%`, top: '50%' }}
    >
      <span className="text-white text-sm font-bold pointer-events-none uppercase tracking-tight leading-none mb-1">
        {gateInfo.symbol}
      </span>
      {gateInfo.parameterized && (
         <span className="text-[8px] text-white/70 font-mono pointer-events-none">θ</span>
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
    const time = Math.round((x / rect.width) * TIME_SLOTS);
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
    <div className="flex items-center gap-4 group">
      {/* Qubit Label */}
      <div className="w-16 h-16 flex items-center justify-center shrink-0 border border-slate-800 bg-slate-900/50 rounded-xl group-hover:border-blue-500/50 transition-colors">
        <span className="text-sm font-mono font-bold text-slate-500 italic group-hover:text-blue-400">
           |q{qubitIndex}⟩
        </span>
      </div>

      {/* Wire Track */}
      <div 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => selectGate(null)}
        className="relative flex-1 h-16 flex items-center cursor-crosshair group-hover:bg-slate-900/10 rounded-lg transition-all px-6"
      >
        <div className="wire-line shadow-[0_0_20px_rgba(51,65,85,0.2)]" />
        
        {/* Render Gates on this wire */}
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
  );
}
