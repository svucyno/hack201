from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional, Dict
import io
import sys
import contextlib

router = APIRouter(prefix="/code")

class RunCodeRequest(BaseModel):
    code: str

@router.post("/run")
async def run_qiskit_code(req: RunCodeRequest):
    """ Executes Qiskit/Python code and returns stdout. Simplified for demo. """
    f = io.StringIO()
    try:
        # Redirect stdout and capture it
        with contextlib.redirect_stdout(f):
            # Run the client code in its own namespace
            exec_namespace = {}
            exec(req.code, exec_namespace)
        
        output = f.getvalue()
        return {"output": output}

    except Exception as e:
        return {"error": str(e), "output": f.getvalue()}
