'use client';

import React from 'react';
import useStore from '../shared/store';
import { Trash2, Hash, Layers, ShieldCheck, Cpu, Code2, Sparkles } from 'lucide-react';
import { GATE_TYPES } from '../shared/constants';

// Matrix representations of standard single qubit unitaries
const getUnitaryMatrix = (type, theta = 0) => {
  const t2 = theta / 2;
  const c = Math.cos(t2);
  const s = Math.sin(t2);

  switch (type) {
    case 'H':
      return [['1/√2', '1/√2'], ['1/√2', '-1/√2']];
    case 'X':
      return [['0', '1'], ['1', '0']];
    case 'Y':
      return [['0', '-i'], ['i', '0']];
    case 'Z':
      return [['1', '0'], ['0', '-1']];
    case 'S':
      return [['1', '0'], ['0', 'i']];
    case 'T':
      return [['1', '0'], ['0', 'e^(iπ/4)']];
    case 'Rx':
      return [[c.toFixed(2), `-${s.toFixed(2)}i`], [`-${s.toFixed(2)}i`, c.toFixed(2)]];
    case 'Ry':
      return [[c.toFixed(2), `-${s.toFixed(2)}`], [s.toFixed(2), c.toFixed(2)]];
    case 'Rz':
      return [[`e^(-i${(t2/Math.PI).toFixed(2)}π)`, '0'], ['0', `e^(i${(t2/Math.PI).toFixed(2)}π)`]];
    default:
      return null;
  }
};

export default function PropertiesPanel() {
  const { selectedGateId, gates, updateGate, removeGate, numQubits } = useStore();

  const gate = gates.find((g) => g.id === selectedGateId);
  if (!gate) return null;

  const gateInfo = GATE_TYPES[gate.type] || { symbol: gate.type, name: gate.type, color: 'bg-blue-600', parameterized: false, multiQubit: false };
  const matrix = getUnitaryMatrix(gate.type, gate.params?.theta || 0);

  const setAnglePreset = (val) => {
    updateGate(gate.id, { params: { ...gate.params, theta: val } });
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in h-full select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className={`${gateInfo.color} w-12 h-12 rounded-2xl flex items-center justify-center text-base font-mono font-black text-white shadow-xl drop-shadow`}>
            {gateInfo.symbol}
          </div>
          <div>
            <h3 className="text-xs font-mono font-black text-white uppercase tracking-wider">
              {gateInfo.name || gate.type}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">{gate.type} Unitary</span>
              <span className="text-[10px] text-slate-500">• Slot T{gate.time < 10 ? '0' + gate.time : gate.time}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => removeGate(gate.id)}
          className="p-2.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
          title="Remove Operator"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Qubit Controls */}
      <div className="space-y-4">
        <div className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">
          Wire Assignment
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
              <Layers size={12} className="text-cyan-400" /> Control / Wire
            </label>
            <select
              value={gate.qubit}
              onChange={(e) => updateGate(gate.id, { qubit: parseInt(e.target.value) })}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl text-xs font-mono font-bold text-white px-3 py-2.5 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
            >
              {Array.from({ length: numQubits }).map((_, i) => (
                <option key={i} value={i} className="bg-slate-900">Qubit |q{i}⟩</option>
              ))}
            </select>
          </div>

          {gateInfo.multiQubit && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono font-bold text-slate-400 uppercase flex items-center gap-1.5">
                <Layers size={12} className="text-blue-400" /> Target Wire
              </label>
              <select
                value={gate.target}
                onChange={(e) => updateGate(gate.id, { target: parseInt(e.target.value) })}
                className="w-full bg-slate-950/80 border border-white/10 rounded-xl text-xs font-mono font-bold text-white px-3 py-2.5 focus:outline-none focus:border-cyan-500/50 cursor-pointer"
              >
                {Array.from({ length: numQubits }).map((_, i) => (
                  <option key={i} value={i} disabled={i === gate.qubit} className="bg-slate-900">
                    Qubit |q{i}⟩ {i === gate.qubit ? '(Control)' : ''}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Rotation Slider (if parameterized) */}
      {gateInfo.parameterized && (
        <div className="space-y-4 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Hash size={12} className="text-amber-400" /> Rotation Angle (θ)
            </span>
            <span className="text-xs font-mono font-bold text-amber-300">
              {((gate.params?.theta || 0) / Math.PI).toFixed(2)}π rad ({(gate.params?.theta || 0).toFixed(3)})
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="6.2831853"
            step="0.01"
            value={gate.params?.theta || 0}
            onChange={(e) => updateGate(gate.id, { params: { ...gate.params, theta: parseFloat(e.target.value) } })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />

          {/* Preset Buttons */}
          <div className="flex items-center gap-1.5">
            {[
              { label: 'π/4', val: Math.PI / 4 },
              { label: 'π/2', val: Math.PI / 2 },
              { label: 'π', val: Math.PI },
              { label: '2π', val: 2 * Math.PI },
            ].map(p => (
              <button
                key={p.label}
                onClick={() => setAnglePreset(p.val)}
                className="flex-1 py-1 bg-slate-900 hover:bg-slate-800 border border-white/5 hover:border-amber-500/30 rounded-lg text-[10px] font-mono text-slate-300 transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Unitary Matrix Display */}
      {matrix && (
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Code2 size={12} className="text-purple-400" /> Unitary Matrix U(2)
            </span>
          </div>

          <div className="p-3 bg-slate-950/90 rounded-xl border border-white/10 font-mono text-xs flex items-center justify-center gap-4">
            <span className="text-slate-500 text-lg font-light">[</span>
            <div className="flex flex-col gap-1 text-center">
              <div className="flex gap-4 text-cyan-300 font-bold">
                <span className="min-w-[40px]">{matrix[0][0]}</span>
                <span className="min-w-[40px]">{matrix[0][1]}</span>
              </div>
              <div className="flex gap-4 text-purple-300 font-bold">
                <span className="min-w-[40px]">{matrix[1][0]}</span>
                <span className="min-w-[40px]">{matrix[1][1]}</span>
              </div>
            </div>
            <span className="text-slate-500 text-lg font-light">]</span>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-auto p-3.5 bg-slate-950/60 rounded-2xl border border-white/5 text-[10px] font-mono text-slate-400 leading-relaxed">
        Operator parameters directly synchronized with AerSimulator transpile & statevector computation.
      </div>
    </div>
  );
}
