'use client';

import React from 'react';
import { GATE_TYPES, GATE_GROUPS } from '../shared/constants';
import useStore from '../shared/store';
import { Move } from 'lucide-react';

export default function GatePalette() {
  const { addGate } = useStore();

  const handleDragStart = (e, gateType) => {
    e.dataTransfer.setData('gateType', gateType);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 p-4 shrink-0 overflow-y-auto">
      <h2 className="text-sm font-semibold text-slate-400 mb-4 px-2 tracking-wider uppercase">
        Gate Palette
      </h2>
      
      {Object.values(GATE_GROUPS).map((groupName) => (
        <div key={groupName} className="mb-6">
          <h3 className="text-xs font-bold text-slate-500 mb-3 ml-2">
            {groupName}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(GATE_TYPES)
              .filter(([_, info]) => info.group === groupName)
              .map(([type, info]) => (
                <div
                  key={type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, type)}
                  className={`
                    group relative p-2 h-14 w-full flex flex-col items-center justify-center 
                    rounded-lg border border-slate-700 bg-slate-800/50 
                    hover:border-slate-500 hover:bg-slate-700/80 
                    cursor-grab active:cursor-grabbing transition-all
                  `}
                >
                  <div className={`
                    w-6 h-6 flex items-center justify-center rounded text-[10px] font-bold mb-1
                    ${info.color} text-white shadow-sm shadow-black/20
                  `}>
                    {info.symbol}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium group-hover:text-slate-200">
                    {type}
                  </span>
                </div>
              ))}
          </div>
        </div>
      ))}

      <div className="mt-auto p-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
        <p className="text-[10px] text-slate-500 italic leading-relaxed">
           Drag a gate onto any qubit wire to add it to your circuit.
        </p>
      </div>
    </div>
  );
}
