// hack201/shared/exportToQiskit.js

export function exportToQiskit(numQubits, gates) {
  let code = `from qiskit import QuantumCircuit, transpile\n`;
  code += `from qiskit_aer import AerSimulator\n\n`;
  code += `# 1. Initialize Circuit\n`;
  code += `qc = QuantumCircuit(${numQubits})\n\n`;

  // Sort gates by time
  const sortedGates = [...gates].sort((a, b) => a.time - b.time);

  code += `# 2. Apply Gates\n`;
  sortedGates.forEach(gate => {
    const p = gate.params || {};
    switch(gate.type) {
      case 'H': code += `qc.h(${gate.qubit})\n`; break;
      case 'X': code += `qc.x(${gate.qubit})\n`; break;
      case 'Y': code += `qc.y(${gate.qubit})\n`; break;
      case 'Z': code += `qc.z(${gate.qubit})\n`; break;
      case 'S': code += `qc.s(${gate.qubit})\n`; break;
      case 'T': code += `qc.t(${gate.qubit})\n`; break;
      case 'CNOT': code += `qc.cx(${gate.qubit}, ${gate.target})\n`; break;
      case 'CZ': code += `qc.cz(${gate.qubit}, ${gate.target})\n`; break;
      case 'SWAP': code += `qc.swap(${gate.qubit}, ${gate.target})\n`; break;
      case 'Rx': code += `qc.rx(${p.theta || 0}, ${gate.qubit})\n`; break;
      case 'Ry': code += `qc.ry(${p.theta || 0}, ${gate.qubit})\n`; break;
      case 'Rz': code += `qc.rz(${p.theta || 0}, ${gate.qubit})\n`; break;
      case 'MEASURE': code += `qc.measure_all()\n`; break;
      default: break;
    }
  });

  code += `\n# 3. Simulate\n`;
  code += `backend = AerSimulator()\n`;
  code += `t_qc = transpile(qc, backend)\n`;
  code += `result = backend.run(t_qc).result()\n`;
  code += `print("Counts:", result.get_counts())\n`;

  return code;
}
