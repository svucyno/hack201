'use client';

import React, { useState } from 'react';
import { GATE_TYPES, GATE_GROUPS } from '../shared/constants';
import useStore from '../shared/store';
import { ChevronDown, ChevronRight, Zap } from 'lucide-react';

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
    <div className="flex flex-col h-full bg-[#000000] border-r border-[#27272a] overflow-y-auto custom-scrollbar animate-fade-in shadow-2xl">
      {/* Category Sidebar Title */}
      <div className="p-8 border-b border-[#27272a] bg-[#000000] sticky top-0 z-10 flex items-center justify-between">
        <h2 className="text-[12px] font-black tracking-[0.3em] uppercase text-[#71717a] flex items-center gap-2">
           <Zap size={14} className="text-blue-500" /> OPERATORS
        </h2>
        <span className="text-[10px] font-mono text-[#3f3f46] tracking-[0.5em]">V2.1</span>
      </div>
      
      {Object.values(GATE_GROUPS).map((groupName) => {
        const isCollapsed = collapsedGroups.includes(groupName);
        const groupGates = Object.entries(GATE_TYPES).filter(([_, info]) => info.group === groupName);

        return (
          <div key={groupName} className="border-b border-[#27272a]/40 bg-[#000000]">
            <button 
              onClick={() => toggleGroup(groupName)}
              className="w-full flex items-center justify-between px-8 py-5 hover:bg-[#18181b] transition-all group"
            >
              <div className="flex items-center gap-4">
                {isCollapsed ? <ChevronRight size={16} className="text-[#a1a1aa]" /> : <ChevronDown size={16} className="text-[#a1a1aa]" />}
                <span className="text-[12px] font-black uppercase tracking-[0.2em] text-[#a1a1aa] group-hover:text-[#fafafa] transition-colors">{groupName}</span>
              </div>
              <span className="text-[11px] font-mono text-[#3f3f46] font-black opacity-30 group-hover:opacity-100 transition-opacity">{groupGates.length}</span>
            </button>
            
            {!isCollapsed && (
              <div className="flex flex-wrap gap-4 px-8 pb-8 animate-slide-up">
                {groupGates.map(([type, info]) => (
                  <div
                    key={type}
                    draggable
                    onDragStart={(e) => handleDragStart(e, type)}
                    className={`
                      group relative w-14 h-14 flex flex-col items-center justify-center 
                      rounded-xl border border-transparent ${info.color} 
                      hover:scale-110 hover:shadow-[0_15px_40px_rgba(0,0,0,0.8)] 
                      cursor-grab active:cursor-grabbing transition-all duration-300 shadow-xl
                    `}
                    title={type}
                  >
                    <span className="text-white text-[13px] font-black pointer-events-none uppercase tracking-tighter leading-none shadow-sm">
                      {info.symbol}
                    </span>
                    {info.parameterized && (
                       <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-white/30 rounded-full blur-[1px]" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-auto p-10 bg-[#09090b]/50 border-t border-[#27272a]/50">
        <p className="text-[11px] text-[#3f3f46] font-black tracking-widest uppercase leading-relaxed text-center italic">
           Drag unitaries to manipulate target vectors.
        </p>
      </div>
    </div>
  );
}
