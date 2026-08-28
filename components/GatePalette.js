'use client';

import React, { useState } from 'react';
import { GATE_TYPES, GATE_GROUPS } from '../shared/constants';
import useStore from '../shared/store';
import { ChevronDown, ChevronRight, Zap, Info, Search, HelpCircle } from 'lucide-react';

export default function GatePalette() {
  const [collapsedGroups, setCollapsedGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTooltip, setActiveTooltip] = useState(null);

  const toggleGroup = (group) => {
    setCollapsedGroups(prev => 
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    );
  };

  const handleDragStart = (e, gateType) => {
    e.dataTransfer.setData('gateType', gateType);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/90 border-r border-white/10 overflow-y-auto custom-scrollbar animate-fade-in select-none">
      {/* Category Header */}
      <div className="p-5 border-b border-white/10 bg-slate-950/95 sticky top-0 z-20 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Zap size={14} />
            </div>
            <h2 className="text-xs font-mono font-black tracking-widest uppercase text-white">
              Gate Palette
            </h2>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold">
            13 Gates
          </span>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search operators (H, CNOT, Rx...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 border border-white/10 text-xs font-mono text-white pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-slate-400 placeholder:font-normal"
          />
        </div>
      </div>
      
      {/* Gate Groups List */}
      <div className="flex-1 p-3 space-y-3">
        {Object.values(GATE_GROUPS).map((groupName) => {
          const isCollapsed = collapsedGroups.includes(groupName);
          let groupGates = Object.entries(GATE_TYPES).filter(([_, info]) => info.group === groupName);

          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            groupGates = groupGates.filter(([type, info]) => 
              type.toLowerCase().includes(q) || 
              (info.name && info.name.toLowerCase().includes(q)) ||
              (info.description && info.description.toLowerCase().includes(q))
            );
            if (groupGates.length === 0) return null;
          }

          return (
            <div key={groupName} className="rounded-2xl bg-slate-900/40 border border-white/5 overflow-hidden">
              <button 
                onClick={() => toggleGroup(groupName)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-2">
                  {isCollapsed ? (
                    <ChevronRight size={14} className="text-slate-400 group-hover:text-white" />
                  ) : (
                    <ChevronDown size={14} className="text-slate-400 group-hover:text-white" />
                  )}
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">
                    {groupName}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-full border border-white/5">
                  {groupGates.length}
                </span>
              </button>
              
              {!isCollapsed && (
                <div className="grid grid-cols-2 gap-2.5 p-3 pt-1 animate-slide-up">
                  {groupGates.map(([type, info]) => (
                    <div
                      key={type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, type)}
                      onMouseEnter={() => setActiveTooltip(type)}
                      onMouseLeave={() => setActiveTooltip(null)}
                      className={`
                        relative flex flex-col items-center justify-center p-3.5 
                        rounded-xl border border-white/10 ${info.color} 
                        hover:scale-105 hover:shadow-xl hover:border-white/40
                        cursor-grab active:cursor-grabbing transition-all duration-200 shadow-md group
                      `}
                    >
                      <span className="text-white text-base font-black font-mono tracking-tighter leading-none select-none drop-shadow-md">
                        {info.symbol}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-white/80 mt-1 uppercase tracking-tight line-clamp-1 select-none">
                        {type}
                      </span>

                      {/* Parameterized indicator */}
                      {info.parameterized && (
                        <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]" />
                      )}

                      {/* Multi-qubit indicator */}
                      {info.multiQubit && (
                        <div className="absolute top-1.5 left-1.5 text-[8px] font-mono font-black text-white/90 bg-black/40 px-1 rounded">
                          2Q
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tooltip Card / Guide footer */}
      <div className="p-4 border-t border-white/10 bg-slate-950/80 m-3 rounded-2xl border">
        {activeTooltip && GATE_TYPES[activeTooltip] ? (
          <div className="space-y-1 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-black text-cyan-400 uppercase">
                {GATE_TYPES[activeTooltip].name || activeTooltip}
              </span>
              <span className="text-[9px] font-mono text-slate-400 uppercase">
                {GATE_TYPES[activeTooltip].group}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {GATE_TYPES[activeTooltip].description}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2.5 text-slate-400 text-xs">
            <Info size={14} className="text-cyan-400 shrink-0" />
            <p className="text-[10px] font-mono leading-tight">
              Drag gates onto timeline wires to compose unitary sequence.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
