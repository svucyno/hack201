'use client';

import React, { useRef } from 'react';
import useStore from '../shared/store';
import QubitWire from './QubitWire';
import { TIME_SLOTS } from '../shared/constants';

export default function CircuitEditor() {
  const { numQubits, gates } = useStore();
  const editorRef = useRef(null);

  // Spacious Interaction Constants
  const QUBIT_ROW_HEIGHT = 64;    
  const GUTTER_Y = 16;            
  const TOP_GUTTER = 48;          
  const LEFT_GUTTER = 80 + 24;    

  return (
    <div 
      ref={editorRef}
      className="relative flex flex-col min-w-[max-content] min-h-full p-10 md:p-20 bg-[#000000] rounded-2xl border border-[#27272a] shadow-2xl relative transition-all duration-700"
    >
      {/* Background Micro Interaction Pattern */}
      <div className="absolute inset-0 gate-grid-bg opacity-[0.05] pointer-events-none rounded-2xl hover:opacity-[0.08] transition-opacity" />
      
      {/* Dynamic Header - High fidelity hover tracks */}
      <div className="flex h-12 ml-[104px] mb-8 opacity-30 select-none">
        {Array.from({ length: TIME_SLOTS }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-center border-r border-[#27272a]/10 group/time cursor-default hover:bg-[#18181b]/50 transition-all rounded">
            <div className="w-1 h-1 bg-[#27272a] rounded-full mb-2 group-hover/time:bg-blue-500/50 group-hover/time:scale-125 transition-all" />
            <div className="text-[10px] font-bold text-[#71717a] font-mono tracking-widest uppercase group-hover/time:text-[#fafafa]">
              T{i < 10 ? `0${i}` : i}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 relative z-10 w-full animate-fade-in">
        {Array.from({ length: numQubits }).map((_, i) => (
          <QubitWire key={i} qubitIndex={i} />
        ))}
      </div>

      {/* Connection SVG Layer - Animated Fidelity */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 5 }}>
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.8" />
          </linearGradient>
        </defs>
        {gates.filter(g => g.target !== undefined).map(gate => {
          const x = 104 + (gate.time / (TIME_SLOTS - 1)) * (editorRef.current?.offsetWidth - 104 - 104 || 0);
          const y1 = TOP_GUTTER + 48 + (QUBIT_ROW_HEIGHT + GUTTER_Y) * gate.qubit + 32;
          const y2 = TOP_GUTTER + 48 + (QUBIT_ROW_HEIGHT + GUTTER_Y) * gate.target + 32;

          return (
            <g key={gate.id} className="animate-fade-in group/conn">
               <line 
                 x1={x} y1={y1} x2={x} y2={y2} 
                 className="stroke-[url(#lineGrad)] stroke-[1.5] transition-all hover:stroke-[2.5]"
                 strokeDasharray="4,4"
               >
                 <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite" />
               </line>
               <circle cx={x} cy={y1} r={4} className="fill-[#3b82f6] shadow-xl animate-pulse" />
               <g transform={`translate(${x}, ${y2})`}>
                  <circle r={10} className="fill-[#000000] stroke-[#3b82f6] stroke-2 hover:r-12 transition-all" />
                  <circle r={10} className="fill-none stroke-blue-500 opacity-20 animate-ping" />
                  {gate.type === 'CNOT' && (
                    <>
                      <line x1="-5" y1="0" x2="5" y2="0" className="stroke-[#3b82f6] stroke-1.5" />
                      <line x1="0" y1="-5" x2="0" y2="5" className="stroke-[#3b82f6] stroke-1.5" />
                    </>
                  )}
                  {gate.type === 'CZ' && <circle r={4} className="fill-[#3b82f6]" />}
               </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
