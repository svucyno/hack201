'use client';

import React, { useRef } from 'react';
import useStore from '../shared/store';
import QubitWire from './QubitWire';
import { TIME_SLOTS } from '../shared/constants';

export default function CircuitEditor() {
  const { numQubits, gates } = useStore();
  const editorRef = useRef(null);

  // Compact Layout Constants
  const QUBIT_ROW_HEIGHT = 48;    // Matches h-12 in QubitWire
  const GUTTER_Y = 8;             // gap-2 for the container
  const TOP_GUTTER = 44;          // for time labels
  const LEFT_GUTTER = 64 + 16;    // w-16 + gap-4 (px)

  return (
    <div 
      ref={editorRef}
      className="relative flex flex-col min-w-[max-content] min-h-full p-10 bg-[#000000] rounded-xl border border-[#27272a] gate-grid-bg"
    >
      {/* Dynamic Header */}
      <div className="flex h-10 ml-[80px] mb-6 opacity-40">
        {Array.from({ length: TIME_SLOTS }).map((_, i) => (
          <div key={i} className="flex-1 flex items-center justify-center border-r border-[#27272a]/20 text-[9px] font-bold text-[#71717a] font-mono tracking-tighter uppercase transition-colors hover:text-[#fafafa]">
            t{i < 10 ? `0${i}` : i}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2 relative z-10 w-full animate-fade-in">
        {Array.from({ length: numQubits }).map((_, i) => (
          <QubitWire key={i} qubitIndex={i} />
        ))}
      </div>

      {/* Connection SVG Layer */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible" style={{ zIndex: 5 }}>
        {gates.filter(g => g.target !== undefined).map(gate => {
          // Precise coordinate mapping for compact grid
          const x = 80 + (gate.time / (TIME_SLOTS - 1)) * (editorRef.current?.offsetWidth - 80 - 80 || 0);
          const y1 = TOP_GUTTER + 40 + (QUBIT_ROW_HEIGHT + GUTTER_Y) * gate.qubit + 24;
          const y2 = TOP_GUTTER + 40 + (QUBIT_ROW_HEIGHT + GUTTER_Y) * gate.target + 24;

          return (
            <g key={gate.id}>
               <line 
                 x1={x} y1={y1} x2={x} y2={y2} 
                 className="stroke-[#2563eb] stroke-[1.5] shadow-xl"
               />
               <circle cx={x} cy={y1} r={3} className="fill-[#2563eb]" />
               <g transform={`translate(${x}, ${y2})`}>
                  <circle r={8} className="fill-[#000000] stroke-[#2563eb] stroke-2" />
                  {gate.type === 'CNOT' && (
                    <>
                      <line x1="-3" y1="0" x2="3" y2="0" className="stroke-[#2563eb] stroke-1.5" />
                      <line x1="0" y1="-3" x2="0" y2="3" className="stroke-[#2563eb] stroke-1.5" />
                    </>
                  )}
                  {gate.type === 'CZ' && <circle r={3} className="fill-[#2563eb]" />}
               </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
