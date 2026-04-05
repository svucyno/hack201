'use client';

import React from 'react';
import { Settings, BarChart3, Binary, LayoutGrid } from 'lucide-react';
import useStore from '../shared/store';
import LivePreview from './LivePreview';
import BlochSphere from './BlochSphere';
import PropertiesPanel from './PropertiesPanel';

export default function RightSidebar() {
  const { activeRightTab, setActiveTab, selectedGateId } = useStore();

  const tabs = [
    { id: 'preview', icon: <BarChart3 size={18} />, label: 'RESULTS' },
    { id: 'bloch', icon: <Binary size={18} />, label: 'STATES' },
  ];

  if (selectedGateId) {
    tabs.unshift({ id: 'properties', icon: <Settings size={18} />, label: 'UNITARY' });
  }

  return (
    <div className="flex flex-col h-full bg-[#000000] border-l border-[#27272a] shrink-0 overflow-hidden shadow-2xl">
      {/* Tab Navigation - Enhanced Font Scale */}
      <div className="flex bg-[#000000] border-b border-[#27272a]">
        {tabs.map((tab) => {
          const isActive = activeRightTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex flex-col items-center justify-center py-4 transition-all relative overflow-hidden
                ${isActive ? 'text-[#fafafa] border-b-2 border-blue-500 bg-[#18181b]/50' : 'text-[#71717a] hover:text-[#fafafa] hover:bg-[#18181b]/30'}
              `}
            >
              <div className={`mb-1 transition-transform duration-300 ${isActive ? 'scale-110 text-blue-500' : ''}`}>
                {tab.icon}
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content - More padding for readability */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative bg-[#000000]/50">
        <div className="animate-fade-in">
           {activeRightTab === 'properties' && <PropertiesPanel />}
           {activeRightTab === 'preview' && <LivePreview />}
           {activeRightTab === 'bloch' && <BlochSphere />}
        </div>
      </div>

      {/* Connection Metadata - Larger and Cleaner */}
      <div className="p-4 border-t border-[#27272a] bg-[#09090b] flex items-center justify-between px-6">
         <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#71717a]">Live Session Active</span>
         </div>
         <span className="text-[10px] font-mono text-[#3f3f46] font-bold">NODE_PRIME</span>
      </div>
    </div>
  );
}
