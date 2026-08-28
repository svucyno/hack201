'use client';

import React from 'react';
import { Settings, BarChart3, Orbit, Sparkles } from 'lucide-react';
import useStore from '../shared/store';
import LivePreview from './LivePreview';
import BlochSphere from './BlochSphere';
import PropertiesPanel from './PropertiesPanel';

export default function RightSidebar() {
  const { activeRightTab, setActiveTab, selectedGateId } = useStore();

  const tabs = [
    { id: 'preview', icon: <BarChart3 size={16} />, label: 'RESULTS' },
    { id: 'bloch', icon: <Orbit size={16} />, label: '3D STATES' },
  ];

  if (selectedGateId) {
    tabs.unshift({ id: 'properties', icon: <Settings size={16} />, label: 'OPERATOR' });
  }

  return (
    <div className="flex flex-col h-full bg-slate-950/90 border-l border-white/10 shrink-0 overflow-hidden shadow-2xl select-none">
      {/* Tab Navigation */}
      <div className="flex bg-slate-950/95 border-b border-white/10 p-1.5 gap-1">
        {tabs.map((tab) => {
          const isActive = activeRightTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all font-mono text-xs font-bold
                ${isActive 
                  ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-lg glow-cyan' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                }
              `}
            >
              <div className={isActive ? 'text-cyan-400' : ''}>
                {tab.icon}
              </div>
              <span className="text-[11px] uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-5 custom-scrollbar relative bg-slate-950/40">
        <div className="animate-fade-in">
          {activeRightTab === 'properties' && <PropertiesPanel />}
          {activeRightTab === 'preview' && <LivePreview />}
          {activeRightTab === 'bloch' && <BlochSphere />}
        </div>
      </div>

      {/* Connection Metadata Footer */}
      <div className="p-3.5 border-t border-white/10 bg-slate-950/95 flex items-center justify-between px-5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-300">Aer Engine Active</span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
          LOCAL_SIM
        </span>
      </div>
    </div>
  );
}
