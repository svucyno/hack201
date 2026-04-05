'use client';

import React, { useRef } from 'react';
import useStore from '../shared/store';
import QubitWire from './QubitWire';
import { TIME_SLOTS } from '../shared/constants';

export default function CircuitEditor() {
  const { numQubits, gates } = useStore();
  const editorRef = useRef(null);

  // Constants for coordinate calculations
  const QUBIT_ROW_HEIGHT = 88; // matches the h-16 + gap-8 in layout
  const LABEL_WIDTH = 80;      // matches the w-16 + gap-4 in QubitWire
  const PADDING_Y = 100;        // initial offset from top
  const HORIZONTAL_GUTTER = 64; // padding inside the wire

  return (
    <div 
      ref={editorRef}
      className="relative flex flex-col min-w-[max-content] min-h-full p-12 bg-slate-950 rounded-3xl border border-white/5 shadow-2xl shadow-black/40 overflow-visible"
    >
      <div className="absolute inset-0 gate-grid-bg opacity-[0.03] pointer-events-none rounded-3xl" />
      
      {/* Time Markers */}
      <div className="flex mb-8 ml-[104px]">
        {Array.from({ length: TIME_SLOTS }).map((_, i) => (
          <div key={i} className="flex-1 text-[10px] text-slate-700 font-black font-mono text-center tracking-widest uppercase opacity-50">
             Slot {i}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6 relative z-10">
        {Array.from({ length: numQubits }).map((_, qubitIndex) => (
          <QubitWire key={qubitIndex} qubitIndex={qubitIndex} />
        ))}
      </div>

      {/* SVG Layer for Multiqubit Connections (CNOT/CZ lines) */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
        {gates.filter(g => g.target !== undefined).map(gate => {
          const x = LABEL_WIDTH + 24 + ((gate.time + 0.5) / TIME_SLOTS) * (editorRef.current?.offsetWidth - LABEL_WIDTH - 48 || 0);
          const y1 = QUBIT_ROW_HEIGHT * gate.qubit + PADDING_Y;
          const y2 = QUBIT_ROW_HEIGHT * gate.target + PADDING_Y;

          return (
            <g key={gate.id} className="animate-in fade-in zoom-in duration-500">
               {/* Vertical Connection Line */}
               <line 
                 x1={x} y1={y1} x2={x} y2={y2} 
                 className="stroke-blue-500/50 stroke-[2] shadow-xl shadow-blue-500/20"
               />
               {/* Small Target Circle Decoration */}
               <circle 
                 cx={x} cy={y2} r={12} 
                 className="fill-none stroke-blue-500/80 stroke-2 animate-pulse"
               />
               <circle 
                 cx={x} cy={y2} r={4} 
                 className="fill-blue-500"
               />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
