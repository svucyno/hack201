from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict
import numpy as np
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator
from qiskit.quantum_info import Statevector, partial_trace

router = APIRouter(prefix="/simulate")

class Gate(BaseModel):
    id: str
    type: str
    qubit: int
    target: Optional[int] = None
    time: int
    params: Optional[Dict[str, float]] = {}

class CircuitRequest(BaseModel):
    numQubits: int
    gates: List[Gate]

@router.post("")
async def simulate_circuit(req: CircuitRequest):
    try:
        # 1. Initialize Circuit
        qc = QuantumCircuit(req.numQubits)
        
        # 2. Sort gates by time
        sorted_gates = sorted(req.gates, key=lambda g: g.time)
        
        # 3. Add gates to Qiskit Circuit
        for gate in sorted_gates:
            q = gate.qubit
            t = gate.target
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
            elif gate.type == 'MEASURE': qc.measure_all() # simplified for local engine

        # 4. Get Statevector before final measurement
        # Create a separate circuit without measurements for statevector
        qc_state = qc.copy()
        qc_state.remove_final_measurements()
        sv = Statevector.from_instruction(qc_state)
        
        # 5. Calculate Bloch Vectors for each qubit
        bloch_vectors = []
        for i in range(req.numQubits):
            rho = partial_trace(sv, [j for j in range(req.numQubits) if j != i])
            # Expectation values for X, Y, Z
            x = np.real(np.trace(rho.data @ np.array([[0, 1], [1, 0]])))
            y = np.real(np.trace(rho.data @ np.array([[0, -1j], [1j, 0]])))
            z = np.real(np.trace(rho.data @ np.array([[1, 0], [0, -1]])))
            
            # Simple conversion to spherical for the frontend
            theta = np.degrees(np.arccos(z)) if z <= 1.0 else 0
            phi = np.degrees(np.arctan2(y, x))
            bloch_vectors.append({"theta": theta, "phi": phi, "x": x, "y": y, "z": z})

        # 6. Run Execution on Aer
        qc.measure_all() # ensure measurements are present for counts
        backend = AerSimulator()
        t_qc = transpile(qc, backend)
        job = backend.run(t_qc, shots=1024)
        result = job.result()
        counts = result.get_counts()
        
        # 7. Calculate Probabilities
        total_shots = sum(counts.values())
        probs = {state: count/total_shots for state, count in counts.items()}

        return {
            "probabilities": probs,
            "counts": counts,
            "blochVectors": bloch_vectors,
            "statevector": sv.data.astype(complex).tolist()
        }

    except Exception as e:
        return {"error": str(e)}
