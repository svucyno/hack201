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
    { id: 'preview', icon: <BarChart3 size={18} />, label: 'Analysis' },
    { id: 'bloch', icon: <Binary size={18} />, label: 'States' },
    { id: 'ai', icon: <MessageSquareCode size={18} />, label: 'AI Explainer' },
  ];

  if (selectedGateId) {
    tabs.unshift({ id: 'properties', icon: <Settings size={18} />, label: 'Gate' });
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 shrink-0">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-900/80 p-2 gap-1 sticky top-0 z-20">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex flex-col items-center justify-center p-2 rounded-lg transition-all
              ${activeRightTab === tab.id ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-slate-500 hover:text-slate-300'}
            `}
            title={tab.label}
          >
            {tab.icon}
            <span className="text-[10px] mt-1 font-semibold">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {activeRightTab === 'properties' && <PropertiesPanel />}
        {activeRightTab === 'preview' && <LivePreview />}
        {activeRightTab === 'bloch' && <BlochSphere />}
        {activeRightTab === 'ai' && <AIChatPanel />}
      </div>
    </div>
  );
}
