import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { INITIAL_NUM_QUBITS } from './constants';

const useStore = create((set, get) => ({
  // --- Circuit State ---
  numQubits: INITIAL_NUM_QUBITS,
  gates: [],

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
    loading: false,
    error: null,
  },

  // --- Actions ---

  setNumQubits: (n) => {
    const { gates } = get();
    // Prune gates that are now out of bounds
    const filteredGates = gates.filter(g => g.qubit < n && (g.target === undefined || g.target < n));
    get().saveSnapshot();
    set({ numQubits: n, gates: filteredGates });
  },

  addGate: (gateData) => {
    get().saveSnapshot();
    const newGate = {
      ...gateData,
      id: uuidv4(),
      params: gateData.params || {},
    };
    set((state) => ({
      gates: [...state.gates, newGate],
      selectedGateId: newGate.id,
    }));
  },

  removeGate: (gateId) => {
    get().saveSnapshot();
    set((state) => ({
      gates: state.gates.filter((g) => g.id !== gateId),
      selectedGateId: state.selectedGateId === gateId ? null : state.selectedGateId,
    }));
  },

  updateGate: (gateId, patch) => {
    get().saveSnapshot();
    set((state) => ({
      gates: state.gates.map((g) => (g.id === gateId ? { ...g, ...patch } : g)),
    }));
  },

  moveGate: (gateId, qubit, time) => {
    get().saveSnapshot();
    set((state) => ({
      gates: state.gates.map((g) => (g.id === gateId ? { ...g, qubit, time } : g)),
    }));
  },

  selectGate: (gateId) => set({ selectedGateId: gateId }),

  setActiveTab: (tab) => set({ activeRightTab: tab }),

  // --- History Actions ---

  saveSnapshot: () => {
    const { gates, numQubits, undoStack } = get();
    const snapshot = JSON.stringify({ gates, numQubits });
    
    // Only save if different from last snapshot
    if (undoStack.length > 0 && undoStack[undoStack.length - 1] === snapshot) return;

    set({
      undoStack: [...undoStack, snapshot].slice(-50), // Limit to 50 undos
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
