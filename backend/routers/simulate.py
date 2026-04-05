from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import numpy as np
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit_aer.noise import NoiseModel, thermal_relaxation_error, depolarizing_error
from qiskit.quantum_info import Statevector, partial_trace, entropy

router = APIRouter(prefix="/simulate")

class Gate(BaseModel):
    id: str
    type: str
    qubit: int
    target: Optional[int] = None
    time: int
    params: Optional[Dict[str, float]] = {}

class NoiseProfile(BaseModel):
    id: str # 'perfect' | 'ibm_yorktown' | 'noisy_high'
    t1: Optional[float] = 50.0 # microseconds
    t2: Optional[float] = 70.0 # microseconds
    gate_error: Optional[float] = 0.001

class CircuitRequest(BaseModel):
    numQubits: int
    gates: List[Gate]
    noise: Optional[NoiseProfile] = None

def build_noise_model(profile: NoiseProfile):
    """Factory for generating hardware-fidelity noise models."""
    if not profile or profile.id == 'perfect':
        return None
    
    noise_model = NoiseModel()
    
    # Simple thermal relaxation noise
    t1, t2 = profile.t1, profile.t2
    time_u1, time_u2 = 35, 50 # nanoseconds
    
    error_u1 = thermal_relaxation_error(t1, t2, time_u1)
    error_u2 = thermal_relaxation_error(t1, t2, time_u2)
    
    # Depolarizing error for CNOT
    error_cx = depolarizing_error(profile.gate_error, 2)
    
    noise_model.add_all_qubit_quantum_error(error_u1, ['u1', 'u2', 'u3', 'h', 'x', 'y', 'z'])
    noise_model.add_all_qubit_quantum_error(error_cx, ['cx'])
    
    return noise_model

@router.post("")
async def simulate_circuit(req: CircuitRequest):
    try:
        # 1. Initialize Circuit
        qc = QuantumCircuit(req.numQubits)
        
        # 2. Add gates to Qiskit Circuit
        for gate in sorted(req.gates, key=lambda g: g.time):
            q, t = gate.qubit, gate.target
            p = gate.params or {}
            
            if gate.type == 'H': qc.h(q)
            elif gate.type == 'X': qc.x(q)
            elif gate.type == 'Y': qc.y(q)
            elif gate.type == 'Z': qc.z(q)
            elif gate.type == 'S': qc.s(q)
            elif gate.type == 'T': qc.t(q)
            elif gate.type == 'CNOT': qc.cx(q, t)
            elif gate.type == 'CZ': qc.cz(q, t)
            elif gate.type == 'SWAP': qc.swap(q, t)
            elif gate.type == 'Rx': qc.rx(p.get('theta', 0), q)
            elif gate.type == 'Ry': qc.ry(p.get('theta', 0), q)
            elif gate.type == 'Rz': qc.rz(p.get('theta', 0), q)

        # 3. Research Metrics: Entropy & Entanglement
        # Get Statevector
        qc_state = qc.copy()
        sv = Statevector.from_instruction(qc_state)
        
        # Calculate von Neumann Entropy (0 = Pure/Classical, >0 = Entangled/Mixed)
        # We calculate for the whole system (pure) and subsystems
        system_entropy = entropy(sv)
        
        # Correlation Analysis (Mutual Information approx)
        correlations = []
        if req.numQubits > 1:
            for i in range(req.numQubits - 1):
                rho_i = partial_trace(sv, [j for j in range(req.numQubits) if j != i])
                correlations.append({"qubit": i, "purity": np.real(np.trace(rho_i.data @ rho_i.data))})

        # 4. Bloch Vectors
        bloch_vectors = []
        for i in range(req.numQubits):
            rho = partial_trace(sv, [j for j in range(req.numQubits) if j != i])
            x = np.real(np.trace(rho.data @ np.array([[0, 1], [1, 0]])))
            y = np.real(np.trace(rho.data @ np.array([[0, -1j], [1j, 0]])))
            z = np.real(np.trace(rho.data @ np.array([[1, 0], [0, -1]])))
            bloch_vectors.append({"x": x, "y": y, "z": z, "theta": np.degrees(np.arccos(np.clip(z, -1, 1))), "phi": np.degrees(np.arctan2(y, x))})

        # 5. Transpilation WOW Factor (Hardware Optimization)
        backend = AerSimulator()
        noise_model = build_noise_model(req.noise)
        
        # Level 3 optimization for 'WOW' depth reduction
        t_qc = transpile(qc, backend, optimization_level=3)
        t_depth = t_qc.depth()
        
        # 6. Execute with Noise
        qc.measure_all()
        job = backend.run(transpile(qc, backend), noise_model=noise_model, shots=2048)
        result = job.result()
        counts = result.get_counts()
        
        total_shots = sum(counts.values())
        probs = {state: count/total_shots for state, count in counts.items()}

        return {
            "probabilities": probs,
            "counts": counts,
            "blochVectors": bloch_vectors,
            "metrics": {
                "systemEntropy": system_entropy,
                "originalDepth": qc.depth(),
                "optimizedDepth": t_depth,
                "fidelityEstimate": 1.0 - (t_depth * (req.noise.gate_error if req.noise else 0.0001))
            },
            "correlations": correlations
        }

    except Exception as e:
        return {"error": str(e)}
