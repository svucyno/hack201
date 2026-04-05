from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict
import os
from google import genai
from google.genai import types

router = APIRouter(prefix="/ai")

# 1. AI Prompt Logic and Gemini Configuration
client = genai.Client(api_key=os.environ.get("GOOGLE_API_KEY", "DEMO_KEY")) # Ensure API key is configured

class Gate(BaseModel):
    id: str
    type: str
    qubit: int
    target: Optional[int] = None
    time: int
    params: Optional[Dict[str, float]] = {}

class AIRequest(BaseModel):
    numQubits: int
    gates: List[Gate]
    question: Optional[str] = None

@router.post("/explain")
async def explain_circuit(req: AIRequest):
    try:
        # Create Human-Readable description
        sorted_gates = sorted(req.gates, key=lambda g: g.time)
        steps = []
        for i, g in enumerate(sorted_gates):
            p = g.params or {}
            target_str = f" with target at Qubit {g.target}" if g.target is not None else ""
            param_str = f" with angle {p.get('theta', 0):.2f}" if g.type in ['Rx', 'Ry', 'Rz'] else ""
            steps.append(f"Step {i+1}: {g.type} gate on Qubit {g.qubit}{target_str}{param_str}")
        
        circuit_desc = "\n".join(steps)
        
        # 2. Call Gemini for detailed physics explanation
        prompt = f"""
        Explain the physics and information flow of this quantum circuit:
        Qubits: {req.numQubits}
        Steps:
        {circuit_desc}
        
        Question: {req.question or 'Explain what this circuit does and what its output state represents.'}
        
        Format your response as markdown with clear sections for:
        1. Overview
        2. Steps Explained
        3. Potential Application (e.g., Entanglement, Algorithm, etc.)
        """
        
        response = client.models.generate_content(
            model="gemini-2.0-flash", # Latest Flash model
            contents=[prompt]
        )
        
        return {"explanation": response.text}

    except Exception as e:
        return {"error": f"AI Explanation unavailable: {str(e)}"}
