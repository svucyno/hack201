// hack201/shared/constants.js

export const GATE_GROUPS = {
  SINGLE: 'Single Qubit',
  MULTI: 'Multi-Qubit',
  PARAM: 'Parameterized',
  MEASURE: 'Measurement'
};

export const GATE_TYPES = {
  H: { symbol: 'H', name: 'Hadamard', color: 'bg-blue-500', group: GATE_GROUPS.SINGLE, parameterized: false, multiQubit: false, description: 'Creates equal superposition' },
  X: { symbol: 'X', name: 'Pauli-X (NOT)', color: 'bg-red-500', group: GATE_GROUPS.SINGLE, parameterized: false, multiQubit: false, description: 'Flips qubit state |0⟩ ↔ |1⟩' },
  Y: { symbol: 'Y', name: 'Pauli-Y', color: 'bg-green-500', group: GATE_GROUPS.SINGLE, parameterized: false, multiQubit: false, description: 'Bit and phase flip' },
  Z: { symbol: 'Z', name: 'Pauli-Z', color: 'bg-purple-500', group: GATE_GROUPS.SINGLE, parameterized: false, multiQubit: false, description: 'Phase flip gate' },
  S: { symbol: 'S', name: 'S Gate (Phase)', color: 'bg-indigo-500', group: GATE_GROUPS.SINGLE, parameterized: false, multiQubit: false, description: 'π/2 phase shift' },
  T: { symbol: 'T', name: 'T Gate (π/8)', color: 'bg-pink-500', group: GATE_GROUPS.SINGLE, parameterized: false, multiQubit: false, description: 'π/4 phase shift' },
  CNOT: { symbol: '●', name: 'Controlled-NOT', color: 'bg-sky-600', group: GATE_GROUPS.MULTI, parameterized: false, multiQubit: true, description: 'Entangles control & target qubits' },
  CZ: { symbol: 'CZ', name: 'Controlled-Z', color: 'bg-cyan-600', group: GATE_GROUPS.MULTI, parameterized: false, multiQubit: true, description: 'Applies Z gate based on control' },
  SWAP: { symbol: '×', name: 'SWAP Gate', color: 'bg-teal-600', group: GATE_GROUPS.MULTI, parameterized: false, multiQubit: true, description: 'Swaps states of two qubits' },
  Rx: { symbol: 'Rx', name: 'Rotation X', color: 'bg-orange-500', group: GATE_GROUPS.PARAM, parameterized: true, multiQubit: false, description: 'X-axis rotation by angle θ' },
  Ry: { symbol: 'Ry', name: 'Rotation Y', color: 'bg-orange-600', group: GATE_GROUPS.PARAM, parameterized: true, multiQubit: false, description: 'Y-axis rotation by angle θ' },
  Rz: { symbol: 'Rz', name: 'Rotation Z', color: 'bg-orange-700', group: GATE_GROUPS.PARAM, parameterized: true, multiQubit: false, description: 'Z-axis rotation by angle θ' },
  MEASURE: { symbol: 'M', name: 'Measurement', color: 'bg-slate-700', group: GATE_GROUPS.MEASURE, parameterized: false, multiQubit: false, description: 'Projects qubit state to classical bit' }
};

export const HARDWARE_PROFILES = {
  perfect: { id: 'perfect', label: 'Ideal Local Q-Engine', t1: 1000.0, t2: 1000.0, gate_error: 0.0, desc: 'Zero gate or decoherence errors.' },
  ibm_yorktown: { id: 'ibm_yorktown', label: 'IBM Yorktown Profile', t1: 50.0, t2: 70.0, gate_error: 0.001, desc: 'Realistic 5-qubit hardware noise.' },
  noisy_high: { id: 'noisy_high', label: 'Degraded High-Noise', t1: 15.0, t2: 20.0, gate_error: 0.01, desc: 'Stress-test error mitigation & fidelity.' }
};

export const INITIAL_NUM_QUBITS = 4;
export const MAX_QUBITS = 8;
export const MIN_QUBITS = 2;
export const TIME_SLOTS = 16;
export const DEFAULT_SHOTS = 2048;

