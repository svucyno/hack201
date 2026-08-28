'use client';

import React, { useRef } from 'react';
import useStore from '../shared/store';
import QubitWire from './QubitWire';
import { TIME_SLOTS } from '../shared/constants';

export default function CircuitEditor() {
  const { numQubits, gates } = useStore();
  const editorRef = useRef(null);

  // Layout Constants for precise alignment
  const QUBIT_ROW_HEIGHT = 80;
  const GAP_Y = 16;
  const TOP_OFFSET = 72;
  const LEFT_LABEL_WIDTH = 112; // 28 * 4px width of wire label + gap

  return (
    <div 
      ref={editorRef}
      className="relative flex flex-col min-w-[max-content] w-full p-6 md:p-12 glass-panel rounded-3xl border border-white/10 shadow-2xl transition-all select-none"
    >
      {/* Background Subtle Matrix */}
      <div className="absolute inset-0 quantum-grid-bg opacity-30 pointer-events-none rounded-3xl" />
      
      {/* Time Step Header Grid */}
      <div className="flex h-10 ml-[124px] mb-6 select-none relative z-10">
        {Array.from({ length: TIME_SLOTS }).map((_, i) => (
          <div 
            key={i} 
            className="flex-1 flex flex-col items-center justify-center border-r border-white/5 group/time cursor-default hover:bg-white/5 transition-all rounded-lg"
          >
            <div className="w-1.5 h-1.5 bg-slate-700 rounded-full mb-1 group-hover/time:bg-cyan-400 group-hover/time:scale-150 transition-all shadow-[0_0_8px_rgba(6,182,212,0.4)]" />
            <div className="text-[10px] font-mono font-bold text-slate-500 group-hover/time:text-cyan-300 tracking-wider">
              T{i < 10 ? `0${i}` : i}
            </div>
          </div>
        ))}
      </div>

      {/* Qubit Wires */}
      <div className="flex flex-col gap-4 relative z-10 w-full animate-fade-in">
        {Array.from({ length: numQubits }).map((_, i) => (
          <QubitWire key={i} qubitIndex={i} />
        ))}
      </div>

      {/* Connection SVG Layer for Multi-Qubit Entanglement Gates (CNOT, CZ, SWAP) */}
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible z-20">
        <defs>
          <linearGradient id="beamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {gates.filter(g => g.target !== undefined).map(gate => {
          // Precise coordinate mapping
          const width = editorRef.current ? (editorRef.current.offsetWidth - 124 - 48) : 700;
          const x = 124 + (gate.time / (TIME_SLOTS - 1)) * width;
          const y1 = TOP_OFFSET + gate.qubit * (QUBIT_ROW_HEIGHT + GAP_Y) + QUBIT_ROW_HEIGHT / 2;
          const y2 = TOP_OFFSET + gate.target * (QUBIT_ROW_HEIGHT + GAP_Y) + QUBIT_ROW_HEIGHT / 2;

          return (
            <g key={gate.id} className="animate-fade-in group/conn">
              {/* Connecting Pulse Beam */}
              <line 
                x1={x} y1={y1} x2={x} y2={y2} 
                stroke="url(#beamGrad)" 
                strokeWidth="2.5"
                strokeDasharray="4 3"
                filter="url(#glowFilter)"
              >
                <animate attributeName="stroke-dashoffset" from="14" to="0" dur="1s" repeatCount="indefinite" />
              </line>

              {/* Control Dot at y1 */}
              <circle cx={x} cy={y1} r={5} className="fill-cyan-400 shadow-lg drop-shadow-[0_0_8px_#06b6d4]" />

              {/* Target Symbol at y2 */}
              <g transform={`translate(${x}, ${y2})`}>
                {gate.type === 'CNOT' && (
                  <>
                    <circle r={12} className="fill-slate-950 stroke-cyan-400 stroke-2 drop-shadow-[0_0_8px_#06b6d4]" />
                    <line x1="-7" y1="0" x2="7" y2="0" className="stroke-cyan-400 stroke-2" />
                    <line x1="0" y1="-7" x2="0" y2="7" className="stroke-cyan-400 stroke-2" />
                  </>
                )}

                {gate.type === 'CZ' && (
                  <circle r={7} className="fill-cyan-400 stroke-white stroke-1 drop-shadow-[0_0_8px_#06b6d4]" />
                )}

                {gate.type === 'SWAP' && (
                  <>
                    <circle r={12} className="fill-slate-950 stroke-teal-400 stroke-2 drop-shadow-[0_0_8px_#14b8a6]" />
                    <line x1="-6" y1="-6" x2="6" y2="6" className="stroke-teal-400 stroke-2" />
                    <line x1="-6" y1="6" x2="6" y2="-6" className="stroke-teal-400 stroke-2" />
                  </>
                )}
              </g>

              {/* If SWAP, also render 'x' at control point y1 (BUG-005 fix) */}
              {gate.type === 'SWAP' && (
                <g transform={`translate(${x}, ${y1})`}>
                  <circle r={12} className="fill-slate-950 stroke-teal-400 stroke-2 drop-shadow-[0_0_8px_#14b8a6]" />
                  <line x1="-6" y1="-6" x2="6" y2="6" className="stroke-teal-400 stroke-2" />
                  <line x1="-6" y1="6" x2="6" y2="-6" className="stroke-teal-400 stroke-2" />
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
