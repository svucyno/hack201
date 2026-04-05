'use client';

import React, { useState } from 'react';
import { GATE_TYPES, GATE_GROUPS } from '../shared/constants';
import useStore from '../shared/store';
import { ChevronDown, ChevronRight } from 'lucide-react';

export default function GatePalette() {
  const { addGate } = useStore();
  const [collapsedGroups, setCollapsedGroups] = useState([]);

  const toggleGroup = (group) => {
    setCollapsedGroups(prev => 
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const handleDragStart = (e, gateType) => {
    e.dataTransfer.setData('gateType', gateType);
  };

  return (
    <div className="flex flex-col h-full bg-[#000000] border-r border-[#27272a] overflow-y-auto custom-scrollbar">
      <div className="p-6 border-b border-[#27272a] bg-[#000000] sticky top-0 z-10">
        <h2 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#71717a]">Operators</h2>
      </div>
      
      {Object.values(GATE_GROUPS).map((groupName) => {
        const isCollapsed = collapsedGroups.includes(groupName);
        const groupGates = Object.entries(GATE_TYPES).filter(([_, info]) => info.group === groupName);

        return (
          <div key={groupName} className="border-b border-[#27272a]/40 bg-[#000000]">
            <button 
              onClick={() => toggleGroup(groupName)}
              className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#09090b] transition-colors group"
            >
              <div className="flex items-center gap-3">
                {isCollapsed ? <ChevronRight size={12} className="text-[#a1a1aa]" /> : <ChevronDown size={12} className="text-[#a1a1aa]" />}
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717a] group-hover:text-[#fafafa] transition-colors">{groupName}</span>
              </div>
              <span className="text-[9px] font-mono text-[#3f3f46] font-black">{groupGates.length}</span>
            </button>
            
            {!isCollapsed && (
              <div className="flex flex-wrap gap-4 px-6 pb-6 animate-fade-in">
                {groupGates.map(([type, info]) => (
                  <div
                    key={type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, type)}
                    className={`
                      group relative w-12 h-12 flex flex-col items-center justify-center 
                      rounded-lg border border-transparent ${info.color} 
                      hover:scale-110 hover:shadow-2xl hover:shadow-black/50 
                      cursor-grab active:cursor-grabbing transition-all duration-300
                    `}
                    title={type}
                  >
                    <span className="text-white text-xs font-black pointer-events-none uppercase tracking-tighter">
                      {info.symbol}
                    </span>
                    {/* Minimal rich indicator for parameterized gates */}
                    {info.parameterized && (
                       <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-white/20 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-auto p-8 bg-[#09090b]/50 border-t border-[#27272a]/50">
        <p className="text-[9px] text-[#3f3f46] font-bold tracking-tight leading-relaxed italic opacity-80 uppercase">
           Drag an operator to modulate the qubit state vector.
        </p>
      </div>
    </div>
  );
}
