// hack201/shared/constants.js

export const GATE_GROUPS = {
  SINGLE: 'Single Qubit',
  MULTI: 'Multi-Qubit',
  PARAM: 'Parameterized',
  MEASURE: 'Measurement'
};

export const GATE_TYPES = {
  H: { symbol: 'H', color: 'bg-blue-500', group: GATE_GROUPS.SINGLE, parameterized: false, multiQubit: false },
  X: { symbol: 'X', color: 'bg-red-500', group: GATE_GROUPS.SINGLE, parameterized: false, multiQubit: false },
  Y: { symbol: 'Y', color: 'bg-green-500', group: GATE_GROUPS.SINGLE, parameterized: false, multiQubit: false },
  Z: { symbol: 'Z', color: 'bg-purple-500', group: GATE_GROUPS.SINGLE, parameterized: false, multiQubit: false },
  S: { symbol: 'S', color: 'bg-indigo-500', group: GATE_GROUPS.SINGLE, parameterized: false, multiQubit: false },
  T: { symbol: 'T', color: 'bg-pink-500', group: GATE_GROUPS.SINGLE, parameterized: false, multiQubit: false },
  CNOT: { symbol: '●', color: 'bg-sky-600', group: GATE_GROUPS.MULTI, parameterized: false, multiQubit: true },
  CZ: { symbol: 'CZ', color: 'bg-cyan-600', group: GATE_GROUPS.MULTI, parameterized: false, multiQubit: true },
  SWAP: { symbol: '×', color: 'bg-teal-600', group: GATE_GROUPS.MULTI, parameterized: false, multiQubit: true },
  Rx: { symbol: 'Rx', color: 'bg-orange-500', group: GATE_GROUPS.PARAM, parameterized: true, multiQubit: false },
  Ry: { symbol: 'Ry', color: 'bg-orange-600', group: GATE_GROUPS.PARAM, parameterized: true, multiQubit: false },
  Rz: { symbol: 'Rz', color: 'bg-orange-700', group: GATE_GROUPS.PARAM, parameterized: true, multiQubit: false },
  MEASURE: { symbol: 'M', color: 'bg-slate-700', group: GATE_GROUPS.MEASURE, parameterized: false, multiQubit: false }
};

export const INITIAL_NUM_QUBITS = 4;
export const MAX_QUBITS = 8;
export const MIN_QUBITS = 2;
export const TIME_SLOTS = 16;
