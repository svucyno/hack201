// hack201/shared/presets.js

export const CIRCUIT_PRESETS = [
  {
    id: 'bell_state',
    title: 'Bell State (|Φ+⟩)',
    category: 'Entanglement',
    description: 'Maximally entangled 2-qubit state: (|00⟩ + |11⟩)/√2',
    numQubits: 2,
    gates: [
      { id: 'p-1', type: 'H', qubit: 0, time: 1, params: {} },
      { id: 'p-2', type: 'CNOT', qubit: 0, target: 1, time: 3, params: {} }
    ]
  },
  {
    id: 'ghz_state',
    title: 'GHZ 3-Qubit Entanglement',
    category: 'Entanglement',
    description: 'Greenberger–Horne–Zeilinger state: (|000⟩ + |111⟩)/√2',
    numQubits: 3,
    gates: [
      { id: 'p-1', type: 'H', qubit: 0, time: 1, params: {} },
      { id: 'p-2', type: 'CNOT', qubit: 0, target: 1, time: 3, params: {} },
      { id: 'p-3', type: 'CNOT', qubit: 1, target: 2, time: 5, params: {} }
    ]
  },
  {
    id: 'superposition_all',
    title: 'Uniform Superposition',
    category: 'Foundations',
    description: 'Applies Hadamard to all qubits for 2^n simultaneous states',
    numQubits: 4,
    gates: [
      { id: 'p-1', type: 'H', qubit: 0, time: 1, params: {} },
      { id: 'p-2', type: 'H', qubit: 1, time: 1, params: {} },
      { id: 'p-3', type: 'H', qubit: 2, time: 1, params: {} },
      { id: 'p-4', type: 'H', qubit: 3, time: 1, params: {} }
    ]
  },
  {
    id: 'grover_search',
    title: 'Grover Search Oracle',
    category: 'Algorithms',
    description: '2-qubit quantum search marking state |11⟩ and amplifying probability',
    numQubits: 2,
    gates: [
      { id: 'p-1', type: 'H', qubit: 0, time: 1, params: {} },
      { id: 'p-2', type: 'H', qubit: 1, time: 1, params: {} },
      { id: 'p-3', type: 'CZ', qubit: 0, target: 1, time: 3, params: {} },
      { id: 'p-4', type: 'H', qubit: 0, time: 5, params: {} },
      { id: 'p-5', type: 'H', qubit: 1, time: 5, params: {} },
      { id: 'p-6', type: 'X', qubit: 0, time: 7, params: {} },
      { id: 'p-7', type: 'X', qubit: 1, time: 7, params: {} },
      { id: 'p-8', type: 'CZ', qubit: 0, target: 1, time: 9, params: {} },
      { id: 'p-9', type: 'X', qubit: 0, time: 11, params: {} },
      { id: 'p-10', type: 'X', qubit: 1, time: 11, params: {} },
      { id: 'p-11', type: 'H', qubit: 0, time: 13, params: {} },
      { id: 'p-12', type: 'H', qubit: 1, time: 13, params: {} }
    ]
  },
  {
    id: 'qft_3qubit',
    title: 'Quantum Fourier Transform (3-Qubit)',
    category: 'Algorithms',
    description: 'Frequency-domain phase mapping foundation of Shor algorithm',
    numQubits: 3,
    gates: [
      { id: 'p-1', type: 'H', qubit: 0, time: 1, params: {} },
      { id: 'p-2', type: 'Rz', qubit: 0, time: 3, params: { theta: 1.5708 } },
      { id: 'p-3', type: 'H', qubit: 1, time: 5, params: {} },
      { id: 'p-4', type: 'Rz', qubit: 1, time: 7, params: { theta: 0.7854 } },
      { id: 'p-5', type: 'H', qubit: 2, time: 9, params: {} },
      { id: 'p-6', type: 'SWAP', qubit: 0, target: 2, time: 11, params: {} }
    ]
  }
];
