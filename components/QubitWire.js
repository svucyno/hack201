'use client';

import React, { useState } from 'react';
import useStore from '../shared/store';
import { TIME_SLOTS, GATE_TYPES } from '../shared/constants';
import { Trash2 } from 'lucide-react';

const GateIcon = ({ type, onClick, selected, id, qubit, time, params, onRemove }) => {
  const gateInfo = GATE_TYPES[type] || { symbol: type, color: 'bg-blue-600', parameterized: false };

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('gateId', id);
        e.dataTransfer.setData('gateType', type);
      }}
      onClick={(e) => { 
        e.stopPropagation(); 
        onClick(); 
      }}
      className={`
        absolute w-12 h-12 flex items-center justify-center 
        rounded-2xl cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-1/2 
        ${gateInfo.color} transition-all duration-200 z-30 border border-white/20 select-none shadow-lg
        ${selected 
          ? 'ring-2 ring-cyan-400 scale-110 shadow-[0_0_20px_rgba(6,182,212,0.6)] z-40 border-white' 
          : 'hover:scale-105 hover:shadow-cyan-500/20'
        }
      `}
      style={{ left: `${(time / (TIME_SLOTS - 1)) * 100}%`, top: '50%' }}
      title={`${gateInfo.name || type} (Slot T${time < 10 ? '0' + time : time})`}
    >
      <span className="text-white text-sm font-black font-mono tracking-tighter leading-none pointer-events-none drop-shadow">
        {gateInfo.symbol}
      </span>

      {/* Parameter angle indicator */}
      {gateInfo.parameterized && params?.theta !== undefined && (
        <span className="absolute -bottom-2 text-[8px] font-mono font-black text-amber-300 bg-black/80 px-1 rounded-full border border-amber-500/30">
          {(params.theta / Math.PI).toFixed(1)}π
        </span>
      )}
    </div>
  );
};

export default function QubitWire({ qubitIndex }) {
  const { gates, addGate, moveGate, selectGate, selectedGateId, removeGate } = useStore();
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
    } else if (gateType) {
      addGate({ type: gateType, qubit: qubitIndex, time: clampTime });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = Math.round((x / rect.width) * (TIME_SLOTS - 1));
    const clampTime = Math.max(0, Math.min(TIME_SLOTS - 1, time));
    setHoverTime(clampTime);
  };

  const handleDragLeave = () => setHoverTime(null);
  const qubitGates = gates.filter(g => g.qubit === qubitIndex);

  return (
    <div className="flex items-center gap-6 h-20 group relative overflow-visible select-none">
      {/* Qubit State Register Label */}
      <div className="w-24 h-12 flex items-center justify-center shrink-0 border border-white/10 bg-slate-950/90 rounded-2xl transition-all group-hover:border-cyan-500/40 shadow-xl group-hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]">
        <span className="text-xs font-mono font-black text-slate-300 group-hover:text-cyan-300 tracking-wider transition-colors">
          | q{qubitIndex} ⟩
        </span>
      </div>

      {/* Wire Track */}
      <div 
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => selectGate(null)}
        className="relative flex-1 h-16 flex items-center cursor-crosshair px-4 rounded-2xl bg-slate-950/40 border border-white/5 group-hover:bg-slate-900/40 group-hover:border-white/10 transition-all duration-200"
      >
        {/* Glowing Wire Line */}
        <div className="w-full h-[2px] bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 group-hover:from-cyan-500/40 group-hover:via-blue-500/50 group-hover:to-cyan-500/40 transition-colors pointer-events-none" />
        
        {/* Timeline Tick Marks along the wire */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity">
          {Array.from({ length: TIME_SLOTS }).map((_, idx) => (
            <div key={idx} className="w-1 h-1 bg-white rounded-full" />
          ))}
        </div>

        {/* Ghost Position Indicator on Drag */}
        {hoverTime !== null && (
          <div 
            className="absolute w-12 h-12 border-2 border-dashed border-cyan-400/70 bg-cyan-500/10 rounded-2xl -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75 animate-pulse shadow-[0_0_12px_rgba(6,182,212,0.3)] z-10"
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
              onRemove={() => removeGate(gate.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
