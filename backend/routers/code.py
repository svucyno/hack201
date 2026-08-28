from fastapi import APIRouter
from pydantic import BaseModel
import io
import ast
import contextlib
import builtins

router = APIRouter(prefix="/code")

class RunCodeRequest(BaseModel):
    code: str

# Allowed modules for quantum code execution
ALLOWED_MODULES = {'qiskit', 'qiskit_aer', 'numpy', 'math', 'cmath', 'scipy'}

# Strictly forbidden modules and calls
FORBIDDEN_NAMES = {
    'os', 'sys', 'subprocess', 'shutil', 'importlib', 'socket', 'urllib',
    'requests', 'pathlib', 'eval', 'exec', 'compile', 'open',
    'input', 'globals', 'locals', 'getattr', 'setattr', 'delattr', 'ctypes'
}

def validate_code_ast(code_str: str):
    """Parses Python AST and verifies no forbidden system modules or functions are called."""
    try:
        tree = ast.parse(code_str)
    except SyntaxError as e:
        raise ValueError(f"Syntax Error: {e.msg} (line {e.lineno})")

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                root = alias.name.split('.')[0]
                if root in FORBIDDEN_NAMES or (root not in ALLOWED_MODULES):
                    raise ValueError(f"Security Blocked: Import of module '{alias.name}' is prohibited.")
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                root = node.module.split('.')[0]
                if root in FORBIDDEN_NAMES or (root not in ALLOWED_MODULES):
                    raise ValueError(f"Security Blocked: Import from module '{node.module}' is prohibited.")
        elif isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name) and node.func.id in FORBIDDEN_NAMES:
                raise ValueError(f"Security Blocked: Call to restricted function '{node.func.id}()' is prohibited.")

def safe_import(name, globals=None, locals=None, fromlist=(), level=0):
    """Restricted __import__ that strictly permits only quantum science libraries."""
    root = name.split('.')[0]
    if root not in ALLOWED_MODULES:
        raise ImportError(f"Security Blocked: Module '{name}' is not allowed in sandbox.")
    return builtins.__import__(name, globals, locals, fromlist, level)

@router.post("/run")
async def run_qiskit_code(req: RunCodeRequest):
    """Executes Qiskit/Python code safely inside a sandboxed execution context."""
    # 1. AST Security Validation
    try:
        validate_code_ast(req.code)
    except ValueError as val_err:
        return {"error": str(val_err), "output": ""}

    # 2. Sandboxed execution environment
    f = io.StringIO()
    try:
        import qiskit
        import qiskit_aer
        import numpy as np

        safe_builtins = {
            '__import__': safe_import,
            'print': print,
            'range': range,
            'len': len,
            'int': int,
            'float': float,
            'str': str,
            'list': list,
            'dict': dict,
            'set': set,
            'tuple': tuple,
            'bool': bool,
            'abs': abs,
            'min': min,
            'max': max,
            'sum': sum,
            'round': round,
            'enumerate': enumerate,
            'zip': zip,
            'isinstance': isinstance,
            'Exception': Exception,
            'ValueError': ValueError,
            'TypeError': TypeError,
            'ImportError': ImportError,
        }

        exec_namespace = {
            "__builtins__": safe_builtins,
            "qiskit": qiskit,
            "QuantumCircuit": qiskit.QuantumCircuit,
            "transpile": qiskit.transpile,
            "AerSimulator": qiskit_aer.AerSimulator,
            "np": np,
            "numpy": np
        }

        with contextlib.redirect_stdout(f):
            exec(req.code, exec_namespace)

        output = f.getvalue()
        return {"output": output if output else "Code executed cleanly (no stdout output)."}

    except Exception as e:
        return {"error": f"Execution Error: {str(e)}", "output": f.getvalue()}
