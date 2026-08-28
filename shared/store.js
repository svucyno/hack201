import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { INITIAL_NUM_QUBITS, HARDWARE_PROFILES, DEFAULT_SHOTS } from './constants';

/**
 * Helper: Checks if placing/moving a gate causes a collision on any occupied qubit wire at time.
 */
const hasCollision = (gates, targetQubit, targetTime, excludeGateId = null) => {
  return gates.some(g => {
    if (g.id === excludeGateId) return false;
    if (g.time !== targetTime) return false;
    const occupiedQubits = [g.qubit, g.target].filter(q => q !== undefined && q !== null);
    return occupiedQubits.includes(targetQubit);
  });
};

const useStore = create((set, get) => ({
  // --- Circuit State ---
  numQubits: INITIAL_NUM_QUBITS,
  shots: DEFAULT_SHOTS,
  gates: [],
  noiseProfile: HARDWARE_PROFILES.perfect,

  // --- History State ---
  undoStack: [],
  redoStack: [],

  // --- UI/Selection State ---
  selectedGateId: null,
  activeRightTab: 'preview', // 'preview', 'bloch', 'ai', 'properties'

  // --- Simulation Results ---
  simulationResults: {
    statevector: null,
    probabilities: null,
    blochVectors: null,
    counts: null,
    metrics: null,
    correlations: null,
    loading: false,
    error: null,
  },

  // --- Actions ---

  setShots: (shots) => set({ shots }),

  setNoiseProfile: (profileKeyOrObject) => set((state) => {
    let profile = profileKeyOrObject;
    if (typeof profileKeyOrObject === 'string' && HARDWARE_PROFILES[profileKeyOrObject]) {
      profile = HARDWARE_PROFILES[profileKeyOrObject];
    }
    return { noiseProfile: { ...state.noiseProfile, ...profile } };
  }),

  setNumQubits: (n) => {
    const { gates } = get();
    const filteredGates = gates.filter(g => g.qubit < n && (g.target === undefined || g.target < n));
    get().saveSnapshot();
    set({ numQubits: n, gates: filteredGates });
  },

  loadPreset: (preset) => {
    get().saveSnapshot();
    set({
      numQubits: preset.numQubits,
      gates: preset.gates.map(g => ({
        ...g,
        id: uuidv4(),
        params: g.params || {}
      })),
      selectedGateId: null,
      simulationResults: {
        statevector: null,
        probabilities: null,
        blochVectors: null,
        counts: null,
        metrics: null,
        correlations: null,
        loading: false,
        error: null,
      }
    });
  },

  addGate: (gateData) => {
    const { gates, numQubits } = get();
    const targetQubit = gateData.qubit;
    const time = gateData.time;

    // 1. Bounds check
    if (targetQubit < 0 || targetQubit >= numQubits) return false;

    // 2. Collision check
    if (hasCollision(gates, targetQubit, time)) return false;

    // 3. Default multi-qubit target setup if missing (ensure target != control)
    let target = gateData.target;
    if (gateData.type === 'CNOT' || gateData.type === 'CZ' || gateData.type === 'SWAP') {
      if (target === undefined || target === targetQubit) {
        target = targetQubit + 1 < numQubits ? targetQubit + 1 : (targetQubit > 0 ? targetQubit - 1 : 0);
      }
      if (target === targetQubit) return false; // Cannot control and target same qubit
      if (hasCollision(gates, target, time)) return false;
    }

    get().saveSnapshot();
    const newGate = {
      ...gateData,
      id: uuidv4(),
      target,
      params: gateData.params || {},
    };

    set((state) => ({
      gates: [...state.gates, newGate],
      selectedGateId: newGate.id,
    }));
    return true;
  },

  removeGate: (gateId) => {
    get().saveSnapshot();
    set((state) => ({
      gates: state.gates.filter((g) => g.id !== gateId),
      selectedGateId: state.selectedGateId === gateId ? null : state.selectedGateId,
    }));
  },

  updateGate: (gateId, patch) => {
    const { gates, numQubits } = get();
    const existing = gates.find(g => g.id === gateId);
    if (!existing) return;

    const updatedControl = patch.qubit !== undefined ? patch.qubit : existing.qubit;
    const updatedTarget = patch.target !== undefined ? patch.target : existing.target;

    // Prevent control == target
    if (updatedTarget !== undefined && updatedControl === updatedTarget) return;

    // Check collision if qubit position shifted
    if (patch.qubit !== undefined && hasCollision(gates, updatedControl, existing.time, gateId)) return;
    if (patch.target !== undefined && updatedTarget !== undefined && hasCollision(gates, updatedTarget, existing.time, gateId)) return;

    get().saveSnapshot();
    set((state) => ({
      gates: state.gates.map((g) => (g.id === gateId ? { ...g, ...patch } : g)),
    }));
  },

  moveGate: (gateId, qubit, time) => {
    const { gates } = get();
    const existing = gates.find(g => g.id === gateId);
    if (!existing) return;

    // Collision check
    if (hasCollision(gates, qubit, time, gateId)) return;
    if (existing.target !== undefined) {
      const targetDelta = existing.target - existing.qubit;
      const newTarget = qubit + targetDelta;
      if (hasCollision(gates, newTarget, time, gateId)) return;
    }

    get().saveSnapshot();
    set((state) => ({
      gates: state.gates.map((g) => (g.id === gateId ? { 
        ...g, 
        qubit, 
        time,
        target: g.target !== undefined ? qubit + (g.target - g.qubit) : undefined 
      } : g)),
    }));
  },

  selectGate: (gateId) => set({ selectedGateId: gateId }),
  setActiveTab: (tab) => set({ activeRightTab: tab }),

  // --- History Actions ---
  saveSnapshot: () => {
    const { gates, numQubits, undoStack } = get();
    const snapshot = JSON.stringify({ gates, numQubits });
    if (undoStack.length > 0 && undoStack[undoStack.length - 1] === snapshot) return;
    set({
      undoStack: [...undoStack, snapshot].slice(-50),
      redoStack: [],
    });
  },

  undo: () => {
    const { undoStack, redoStack, gates, numQubits } = get();
    if (undoStack.length === 0) return;
    const currentSnapshot = JSON.stringify({ gates, numQubits });
    const lastSnapshot = JSON.parse(undoStack[undoStack.length - 1]);
    set({
      gates: lastSnapshot.gates,
      numQubits: lastSnapshot.numQubits,
      undoStack: undoStack.slice(0, -1),
      redoStack: [currentSnapshot, ...redoStack],
      selectedGateId: null,
    });
  },

  redo: () => {
    const { undoStack, redoStack, gates, numQubits } = get();
    if (redoStack.length === 0) return;
    const currentSnapshot = JSON.stringify({ gates, numQubits });
    const nextSnapshot = JSON.parse(redoStack[0]);
    set({
      gates: nextSnapshot.gates,
      numQubits: nextSnapshot.numQubits,
      undoStack: [...undoStack, currentSnapshot],
      redoStack: redoStack.slice(1),
      selectedGateId: null,
    });
  },

  // --- Simulation Actions ---
  setSimulationLoading: (loading) => set((state) => ({
    simulationResults: { ...state.simulationResults, loading }
  })),

  setSimulationResults: (results) => set((state) => ({
    simulationResults: {
      ...state.simulationResults,
      ...results,
      loading: false,
      error: null
    }
  })),

  setSimulationError: (error) => set((state) => ({
    simulationResults: { ...state.simulationResults, error, loading: false }
  })),

  resetCircuit: () => {
    get().saveSnapshot();
    set({ gates: [], selectedGateId: null });
  }
}));

export default useStore;

