from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import time
import random

app = FastAPI(title="LuminaCode Core API")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CodeRequest(BaseModel):
    language: str
    code: str
    filename: Optional[str] = None

class Smell(BaseModel):
    type: str
    name: str
    severity: str
    line: Optional[int] = None
    description: Optional[str] = None

class AnalysisResponse(BaseModel):
    health_score: int
    security_score: int
    maintainability_score: int
    smells: List[Smell]
    complexity: Optional[str] = "O(1)"

# Global State to maintain consistency across views
project_state = {
    "global_health": 85,
    "security_score": 92,
    "maintainability_score": 78,
    "issues_open": 23,
    "issues_fixed": 142,
    "complexity": "O(n)",
    "graph_nodes": [],
    "graph_links": []
}

@app.get("/")
def read_root():
    return {"status": "LuminaCode Core System Online"}

@app.get("/system-health")
def get_system_health():
    return project_state

@app.post("/execute")
def execute_code(request: CodeRequest):
    # DANGEROUS: For local demo only.
    # In a real app, this would be sandboxed (Docker/microVM).
    try:
        # Capture stdout
        import sys
        from io import StringIO
        old_stdout = sys.stdout
        redirected_output = sys.stdout = StringIO()

        # Basic restrictions
        if "import os" in request.code or "import sys" in request.code:
             return {"output": "Security Alert: System modules are restricted in Sandbox."}

        exec(request.code, {})
        sys.stdout = old_stdout
        return {"output": redirected_output.getvalue()}
    except Exception as e:
        sys.stdout = old_stdout
        return {"output": str(e)}

@app.post("/analyze", response_model=AnalysisResponse)
def analyze_code(request: CodeRequest):
    # Simulate processing time
    time.sleep(0.8)
    
    # 1. Deterministic Analysis Logic
    code = request.code
    smells = []
    
    # Complexity Analysis
    complexity_score = 1
    if "for" in code: complexity_score += 1
    if "while" in code: complexity_score += 1
    if "if" in code: complexity_score += 0.5
    if "switch" in code: complexity_score += 0.5
    
    # Nested loop check
    lines = code.split('\n')
    max_indent = 0
    for line in lines:
        indent = len(line) - len(line.lstrip())
        max_indent = max(max_indent, indent)
    
    complexity_label = "O(1)"
    if complexity_score > 3 or max_indent > 12: complexity_label = "O(n²)"
    elif complexity_score > 1: complexity_label = "O(n)"
    
    # Code Smells & Security Issues (Deterministic)
    if "private Database db" in code:
        smells.append(Smell(type="Code Smell", name="God Class", severity="high", description="Class has too many responsibilities (Database, Email, Logger, Payment)."))
    if "AWS_KEY" in code or "API_KEY" in code:
        smells.append(Smell(type="Security", name="Hardcoded Secret", severity="critical", description="Detected potential hardcoded API/Access Key."))
    if ("SELECT" in code or "select" in code) and ("+" in code or "fmt" in code):
        smells.append(Smell(type="Security", name="SQL Injection", severity="critical", description="Unsafe string concatenation in SQL query."))
    if "buffer" in code and "strcpy" in code:
        smells.append(Smell(type="Security", name="Buffer Overflow", severity="critical", description="Unsafe usage of 'strcpy' detected."))
    if "print" in code and "password" in code.lower():
         smells.append(Smell(type="Security", name="Sensitive Logging", severity="high", description="Logging potentially sensitive 'password' data."))

    # Calculate precise health metrics
    # Base 100, subtract for issues
    health_penalty = sum([20 if s.severity == "critical" else 10 if s.severity == "high" else 5 for s in smells])
    new_health = max(10, 100 - health_penalty)
    
    security_penalty = sum([30 if s.severity == "critical" else 15 if s.severity == "high" else 5 for s in smells if s.type == "Security"])
    new_security = max(10, 100 - security_penalty)
    
    maintainability_penalty = sum([15 for s in smells if s.type == "Code Smell"]) + (complexity_score * 5)
    new_maintainability = max(10, 100 - int(maintainability_penalty))
    
    # Update Global State
    project_state["global_health"] = new_health
    project_state["security_score"] = new_security
    project_state["maintainability_score"] = new_maintainability
    project_state["issues_open"] = len(smells)
    project_state["complexity"] = complexity_label
    
    # Generate Graph Nodes based on "functions" or "classes" found (Heuristic)
    # We'll create a central node for the file, and children for methods/imports
    nodes = [{"id": "File: " + request.filename, "complexity": complexity_score}]
    links = []
    
    # Mock parsing for graph structure
    for i, line in enumerate(lines):
        if "class " in line or "def " in line or "void " in line or "function " in line:
            name = line.split('(')[0].replace('class ', '').replace('def ', '').replace('void ', '').strip()
            nodes.append({"id": name, "complexity": 1})
            links.append({"source": "File: " + request.filename, "target": name})

    project_state["graph_nodes"] = nodes if len(nodes) > 1 else [{"id": "Main", "complexity": 1}]
    project_state["graph_links"] = links

    return AnalysisResponse(
        health_score=project_state["global_health"],
        security_score=project_state["security_score"],
        maintainability_score=project_state["maintainability_score"],
        smells=smells,
        complexity=project_state["complexity"]
    )

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
def chat_with_lumina(request: ChatRequest):
    # Simulate LLM latency for realism
    time.sleep(1.0) 
    
    msg = request.message.lower()
    
    # Keyword-based simulated AI logic
    if "hello" in msg or "hi" in msg:
        response = "Hello! I am Lumina, your advanced code quality assistant. How can I assist you with your codebase today?"
    elif "god class" in msg:
        response = "A 'God Class' is a class that knows too much or does too much. It violates the Single Responsibility Principle. To fix it, try breaking it down into smaller, specialized classes (e.g., extract 'EmailService', 'Logger' into their own files)."
    elif "sql injection" in msg:
        response = "SQL Injection occurs when user input is concatenated directly into queries. ATTENTION: This is a critical vulnerability. Always use parameterized queries (e.g., PreparedStatements in Java, or bind variables in Python) to prevent this."
    elif "complexity" in msg or "complex" in msg:
        response = "Cyclomatic complexity measures the number of linearly independent paths through a program's source code. High complexity (>10) suggests the code is hard to test and maintain. Consider simplifying logic or breaking checks into helper functions."
    elif "optimize" in msg or "improve" in msg:
        response = "To optimize code, focus on: 1. Reducing time complexity (nested loops). 2. Caching expensive operations (memoization). 3. Using efficient data structures (HashMaps vs Lists). Upload your file in the Analysis tab for specific advice!"
    elif "security" in msg:
        response = "Security is paramount. I look for hardcoded secrets, injection vulnerabilities, and weak encryption. Check the 'Security' tab for a detailed breakdown of risks in your current project."
    elif "lumina" in msg:
        response = "I am Lumina, a specialized AI designed for static code analysis. I use a combination of pattern matching and heuristic algorithms to ensure your code is clean, safe, and efficient."
    elif "python" in msg:
        response = "Python is great, but watch out for dynamic typing issues and indentation errors. I can analyze Python files for PEP-8 compliance and logic flaws."
    elif "java" in msg:
        response = "Java is robust. Common issues I check for include NullPointerExceptions, resource leaks (unclosed streams), and concurrency bugs."
    elif "how are you" in msg:
         response = "I am operating at peak efficiency. My analysis sub-systems are fully online. How is your code today?"
    else:
        # Generic "AI" Fallback
        response = "That's an interesting query about your code. To give you a precise answer, I recommend uploading the specific file you're working on in the 'Code Analysis' section. I can then analyze its structure, security, and complexity in detail."

    return {"response": response}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
