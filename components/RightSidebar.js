'use client';

import React from 'react';
import { Settings, BarChart3, Binary, MessageSquareCode } from 'lucide-react';
import useStore from '../shared/store';
import LivePreview from './LivePreview';
import BlochSphere from './BlochSphere';
import AIChatPanel from './AIChatPanel';
import PropertiesPanel from './PropertiesPanel';

export default function RightSidebar() {
  const { activeRightTab, setActiveTab, selectedGateId } = useStore();

  const tabs = [
    { id: 'preview', icon: <BarChart3 size={16} />, label: 'Results' },
    { id: 'bloch', icon: <Binary size={16} />, label: 'States' },
    { id: 'ai', icon: <MessageSquareCode size={16} />, label: 'AI Pilot' },
  ];

  if (selectedGateId) {
    tabs.unshift({ id: 'properties', icon: <Settings size={16} />, label: 'Gate' });
  }

  return (
    <div className="flex flex-col h-full bg-[#010409] border-l border-[#30363d] shrink-0 overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex bg-[#010409] border-b border-[#30363d]">
        {tabs.map((tab) => {
          const isActive = activeRightTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 flex flex-col items-center justify-center py-3 transition-all relative overflow-hidden
                ${isActive ? 'text-[#c9d1d9] border-b-2 border-[#2f81f7]' : 'text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#161b22]'}
              `}
            >
              <div className="mb-0.5">{tab.icon}</div>
              <span className="text-[10px] font-bold uppercase tracking-widest">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar relative">
        <div className="animate-fade-in">
           {activeRightTab === 'properties' && <PropertiesPanel />}
           {activeRightTab === 'preview' && <LivePreview />}
           {activeRightTab === 'bloch' && <BlochSphere />}
           {activeRightTab === 'ai' && <AIChatPanel />}
        </div>
      </div>

      {/* Connection Status */}
      <div className="p-3 border-t border-[#30363d] bg-[#0d1117] flex items-center justify-between px-4">
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            <span className="text-[9px] font-black uppercase tracking-widest text-[#484f58]">Backend Connected</span>
         </div>
         <span className="text-[9px] font-mono text-[#30363d]">v2.1</span>
      </div>
    </div>
  );
}
