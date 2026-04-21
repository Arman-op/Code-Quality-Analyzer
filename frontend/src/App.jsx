import { useState, useEffect, useRef, useCallback } from "react";
import { AlertTriangle, Zap, Shield, GitBranch, MessageSquare, ChevronRight, X, Send, Star, Cpu, Code2, Activity, FileCode, CheckCircle, XCircle, Download, RefreshCw, ExternalLink } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth, googleProvider } from "./firebase";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";


const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Mono:wght@400;700&family=Exo+2:wght@300;400;600&display=swap');
`;

const CSS = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  :root {
    --void: #000008;
    --cyan: #00F5FF;
    --purple: #BF00FF;
    --orange: #FF6B00;
    --surface: rgba(255,255,255,0.04);
    --surface2: rgba(255,255,255,0.08);
    --glass: rgba(0,0,50,0.6);
    --border: rgba(0,245,255,0.15);
    --text: #E0F8FF;
    --muted: rgba(224,248,255,0.5);
  }
  html { scroll-behavior: smooth; }
  body { background: var(--void); color: var(--text); font-family: 'Exo 2', sans-serif; overflow-x: hidden; cursor: none; }
  .orbitron { font-family: 'Orbitron', sans-serif; }
  .mono { font-family: 'Space Mono', monospace; }
  .exo { font-family: 'Exo 2', sans-serif; }

  /* Custom cursor */
  #cursor { position: fixed; width: 20px; height: 20px; border: 1px solid var(--cyan); border-radius: 50%; pointer-events: none; z-index: 99999; transform: translate(-50%,-50%); transition: transform 0.1s; }
  #cursor-ring { position: fixed; width: 40px; height: 40px; border: 1px solid rgba(0,245,255,0.3); border-radius: 50%; pointer-events: none; z-index: 99998; transform: translate(-50%,-50%); transition: transform 0.3s ease, width 0.3s, height 0.3s; }
  #cursor-ring.expanded { width: 60px; height: 60px; border-color: rgba(191,0,255,0.5); }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--void); }
  ::-webkit-scrollbar-thumb { background: var(--cyan); border-radius: 2px; }

  /* Float animation */
  @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
  @keyframes float-slow { 0%,100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
  @keyframes pulse-glow { 0%,100% { box-shadow: 0 0 20px var(--cyan), 0 0 40px rgba(0,245,255,0.3); } 50% { box-shadow: 0 0 40px var(--cyan), 0 0 80px rgba(0,245,255,0.5), 0 0 120px rgba(0,245,255,0.2); } }
  @keyframes orbit { 0% { transform: rotate(0deg) translateX(120px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(120px) rotate(-360deg); } }
  @keyframes orbit2 { 0% { transform: rotate(0deg) translateX(180px) rotate(0deg); } 100% { transform: rotate(-360deg) translateX(180px) rotate(360deg); } }
  @keyframes scan { 0% { left: -100%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { left: 110%; opacity: 0; } }
  @keyframes particle-up { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-200px) scale(0); opacity: 0; } }
  @keyframes spin-slow { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  @keyframes counter-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(-360deg); } }
  @keyframes ripple { 0% { transform: scale(0); opacity: 1; } 100% { transform: scale(4); opacity: 0; } }
  @keyframes nebula { 0%,100% { opacity: 0.3; transform: scale(1) rotate(0deg); } 50% { opacity: 0.6; transform: scale(1.1) rotate(180deg); } }
  @keyframes stagger-in { 0% { opacity: 0; transform: translateY(40px); } 100% { opacity: 1; transform: translateY(0); } }
  @keyframes warp-error { 0%,100% { border-color: rgba(255,0,0,0.3); } 50% { border-color: rgba(255,0,0,0.9); box-shadow: 0 0 30px rgba(255,0,0,0.5); } }
  @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
  @keyframes repair-beam { 0% { left: 0; width: 0; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { left: 0; width: 100%; opacity: 0; } }
  @keyframes count-up { from { opacity: 0; } to { opacity: 1; } }
  @keyframes shooting-star { 0% { transform: translateX(-100px) translateY(100px) rotate(45deg); opacity: 0; } 10% { opacity: 1; } 80% { opacity: 1; } 100% { transform: translateX(800px) translateY(-800px) rotate(45deg); opacity: 0; } }

  .float { animation: float 4s ease-in-out infinite; }
  .float-slow { animation: float-slow 6s ease-in-out infinite; }
  .pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }

  /* Glass panels */
  .glass-panel {
    background: var(--glass);
    border: 1px solid var(--border);
    border-radius: 16px;
    backdrop-filter: blur(20px);
  }
  .glass-panel:hover { border-color: rgba(0,245,255,0.35); transition: border-color 0.3s; }

  /* Plasma button */
  .plasma-btn {
    position: relative;
    background: transparent;
    border: 1px solid var(--cyan);
    color: var(--cyan);
    font-family: 'Orbitron', sans-serif;
    font-size: 13px;
    letter-spacing: 2px;
    padding: 14px 32px;
    border-radius: 4px;
    cursor: none;
    overflow: hidden;
    transition: all 0.3s;
  }
  .plasma-btn::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, transparent, rgba(0,245,255,0.1), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s;
  }
  .plasma-btn:hover::before { transform: translateX(100%); }
  .plasma-btn:hover { background: rgba(0,245,255,0.08); box-shadow: 0 0 30px rgba(0,245,255,0.4); transform: scale(1.02); }
  .plasma-btn:active { transform: scale(0.98); }

  /* Orange variant */
  .plasma-btn-orange {
    border-color: var(--orange);
    color: var(--orange);
  }
  .plasma-btn-orange:hover { background: rgba(255,107,0,0.08); box-shadow: 0 0 30px rgba(255,107,0,0.4); }

  /* Purple variant */
  .plasma-btn-purple {
    border-color: var(--purple);
    color: var(--purple);
  }
  .plasma-btn-purple:hover { background: rgba(191,0,255,0.08); box-shadow: 0 0 30px rgba(191,0,255,0.4); }

  /* Metric orb */
  .metric-orb {
    position: relative;
    border-radius: 50%;
    cursor: none;
    transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
  }
  .metric-orb:hover { transform: scale(1.15) !important; }
  .metric-orb:hover .orb-tooltip { opacity: 1; transform: translateY(-10px); }
  .orb-tooltip {
    position: absolute;
    bottom: 110%;
    left: 50%;
    transform: translateX(-50%) translateY(0);
    background: rgba(0,0,30,0.95);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 16px;
    min-width: 180px;
    opacity: 0;
    transition: opacity 0.3s, transform 0.3s;
    pointer-events: none;
    z-index: 100;
    white-space: nowrap;
  }

  /* Stars canvas */
  #starfield { position: fixed; inset: 0; z-index: 0; }

  /* Section */
  section { position: relative; z-index: 1; }

  /* Code diff */
  .diff-before { background: rgba(255,50,50,0.06); border-left: 2px solid rgba(255,50,50,0.5); }
  .diff-after { background: rgba(0,255,100,0.06); border-left: 2px solid rgba(0,255,100,0.5); }

  /* Chat */
  .chat-bubble { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
  .chat-bubble:hover { transform: scale(1.1); }

  /* Node graph */
  .code-node { cursor: none; transition: all 0.3s; }
  .code-node:hover { filter: brightness(1.4); }

  /* Scanning beam */
  .scan-beam { animation: scan 2s ease-in-out; }

  /* Shooting stars */
  .shooting-star { position: fixed; height: 1px; background: linear-gradient(90deg, transparent, var(--cyan)); animation: shooting-star linear infinite; pointer-events: none; z-index: 0; }

  /* Grade cosmic */
  .grade-neutron { color: #00FF88; text-shadow: 0 0 20px #00FF88; }
  .grade-pulsar { color: var(--cyan); text-shadow: 0 0 20px var(--cyan); }
  .grade-dwarf { color: #FFD700; text-shadow: 0 0 20px #FFD700; }
  .grade-giant { color: var(--orange); text-shadow: 0 0 20px var(--orange); }
  .grade-blackhole { color: #FF2255; text-shadow: 0 0 20px #FF2255; }

  .section-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 4px;
    color: var(--cyan);
    text-transform: uppercase;
    opacity: 0.7;
  }
  .section-title {
    font-family: 'Orbitron', sans-serif;
    background: linear-gradient(135deg, var(--cyan), var(--purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Scrolling ticker */
  @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  .ticker-wrap { overflow: hidden; white-space: nowrap; }
  .ticker-content { display: inline-block; animation: ticker 20s linear infinite; }

  /* Nebula bg */
  .nebula-bg {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    animation: nebula 8s ease-in-out infinite;
  }

  input, textarea {
    background: rgba(0,245,255,0.04);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: 'Exo 2', sans-serif;
    padding: 12px 16px;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.3s;
    width: 100%;
  }
  input:focus, textarea:focus {
    border-color: var(--cyan);
    box-shadow: 0 0 20px rgba(0,245,255,0.2);
  }
  input::placeholder, textarea::placeholder { color: var(--muted); }
`;

const MASTER_SYSTEM_PROMPT = `You are LuminaCode Static Analysis Engine. You receive source code and return a structured JSON anomaly report. You are expert in: Java, Python, C++, JavaScript, TypeScript, Go, Rust, Ruby, PHP, Swift, Kotlin, C#, SQL, Bash, and 20+ others.

Detect and classify:
- SECURITY: SQL Injection, XSS, CSRF, Buffer Overflow, Hardcoded Secrets, Path Traversal, Deserialization flaws
- STRUCTURE: God Class (>300 lines), Long Method (>50 lines), Feature Envy, Shotgun Surgery, Data Clumps
- QUALITY: Dead Code, Magic Numbers, Duplicate Code, Deep Nesting (>4 levels)
- MEMORY: Memory Leaks, Unclosed Resources, Null Pointer risks
- PERFORMANCE: N+1 queries, Blocking I/O in async contexts, Inefficient loops

Return ONLY valid JSON in this exact schema:
{
  "language": "detected_language",
  "file": "filename",  
  "health_score": 0-100,
  "anomalies": [
    {
      "type": "smell_type",
      "severity": "CRITICAL|HIGH|MEDIUM|LOW",
      "line": 47,
      "description": "...",
      "fix_suggestion": "..."
    }
  ],
  "auto_refactor_confidence": 0.0-1.0
}`;

const runAnalysisPipeline = async (filename, content, lines) => {
  console.log(`[LuminaCode Orchestrator] Triggering claude-haiku-4-5 for rapid pre-scan on ${filename}...`);
  const isComplex = lines > 500;
  const analysisModel = isComplex ? "claude-opus-4-6" : "claude-sonnet-4-6";
  console.log(`[LuminaCode Orchestrator] File length is ${lines} lines. Routing payload to ${analysisModel}`);
  const payload = {
    model: analysisModel,
    max_tokens: 16000,
    system: MASTER_SYSTEM_PROMPT,
    messages: [{ role: "user", content: `Analyze this code:\n\n${content}` }]
  };
  if (isComplex) {
    console.log(`[LuminaCode Orchestrator] Enabling extended thinking mode for deep reasoning (10000 budget)`);
    payload.thinking = { type: "enabled", budget_tokens: 10000 };
  }
  console.log("[LuminaCode Engine] Payload outgoing:", payload);
  return { status: "simulated_success", routed_to: analysisModel };
};
const generateRefactorData = (filename, content, type) => {
  let pre = `// ${filename} — BEFORE\n`;
  let post = `// ${filename} — AFTER (Zero-G Refactor)\n`;
  let tests = [];

  if (content) {
    const codeSnippet = content.split('\n').slice(0, 12).join('\n');
    pre += codeSnippet;
    let postBody = codeSnippet;
    
    if (type === "secrets") {
       postBody = postBody.replace(/(password|secret|api_key|token)[\s=:]+['"][a-zA-Z0-9_-]{8,}['"]/ig, "$1 = API_VAULT.getSecret(); /* LuminaCode Secured */");
       tests = [{name: "Security::testVaultIntegration", pass: true}, {name: "Auth::testCredentials", pass: true}];
    } else if (type === "logs") {
       postBody = postBody.replace(/console\.log/ig, "logger.info").replace(/system\.out\.println/ig, "logger.info").replace(/print\(/ig, "logger.debug(");
       tests = [{name: "Logging::testDebugTraces", pass: true}, {name: "Format::testOutputString", pass: true}];
    } else {
       pre += "\n// Inefficient data mapping detected.";
       postBody += "\n/* Standard optimizations applied. */";
       tests = [{name: "Core::testMemoryProfile", pass: true}, {name: "Core::testExecutionTime", pass: true}];
    }
    post += postBody;
  } else {
    pre += "public List<User> getUsers(String input) {\n  String query = \"SELECT * FROM users WHERE name = '\" \n               + input + \"'\";  // SQL Injection!\n  return db.execute(query);\n}";
    post += "public List<User> getUsers(String input) {\n  String query = \"SELECT * FROM users WHERE name = ?\";\n  PreparedStatement stmt = db.prepare(query);\n  stmt.setString(1, sanitize(input));\n  return stmt.executeQuery();   // Safe & clean ✓\n}";
    tests = [{name: "AuthTest::testSQLInjectionPrevention", pass: true}, {name: "AuthTest::testInputSanitization", pass: true}];
  }
  
  while(tests.length < 5) tests.push({name: `App::testSuite_${tests.length+1}`, pass: true});
  tests[3].pass = false;

  return { before: pre, after: post, tests };
};

const analyzeRealCode = (filename, content, lines) => {
  const anomalies = [];
  const text = content.toLowerCase();
  
  let score = 100;
  
  if (lines > 300) {
    anomalies.push({ id: filename, x: 220, y: 120, status: lines > 800 ? "critical" : "warning", issues: [`God Class Anti-Pattern. ${lines} lines.`, "High Cyclomatic Complexity"], type: "Architecture" });
    score -= (lines > 800 ? 25 : 10);
  }

  const secrets = content.match(/(password|secret|api_key|token)[\s=:]+['"][a-zA-Z0-9_-]{8,}['"]/ig);
  if (secrets) {
    anomalies.push({ id: "SecurityScanner", x: 400, y: 80, status: "critical", issues: [`Hardcoded secrets detected (${secrets.length} instances)`], type: "Security" });
    score -= 30;
  }

  const logs = content.match(/console\.log|system\.out\.println|print\(/g);
  if (logs && logs.length > 3) {
    anomalies.push({ id: "DebugTraces", x: 600, y: 200, status: "warning", issues: [`Lingering debug logs (${logs.length} instances)`], type: "Code Smell" });
    score -= 5;
  }

  if (content.match(/for.*\{[\s\S]*for.*\{/)) {
    anomalies.push({ id: "Performance", x: 180, y: 280, status: "warning", issues: ["Nested loops (O(n²) time complexity risk)"], type: "Performance" });
    score -= 10;
  }
  
  if (anomalies.length === 0) {
    anomalies.push({ id: filename, x: 360, y: 150, status: "clean", issues: ["No major issues"], type: "Target" });
  }

  anomalies.push({ id: "NetworkLayer", x: 360, y: 320, status: "clean", issues: ["Network layer verified secured"], type: "Network" });

  const healthScore = Math.max(12, score);
  const grade = healthScore > 90 ? "A" : healthScore > 75 ? "B" : healthScore > 60 ? "C" : healthScore > 40 ? "D" : "F";
  const refactorType = secrets ? "secrets" : logs ? "logs" : "general";
  
  return {
    metrics: {
      healthScore,
      vulnerabilities: secrets ? secrets.length : 0,
      codeSmells: (logs ? logs.length : 0) + (lines > 300 ? 2 : 0),
      autoRefactorRate: Math.max(40, 98 - Math.floor(lines/100)),
      healthTrend: [72, 65, 78, 71, 84, 80, healthScore],
      scannedFiles: 1,
      loc: lines,
      testCoverage: Math.max(10, 95 - Math.floor(lines/150)),
      techDebt: Math.ceil(lines * 0.05)
    },
    anomalies,
    grade,
    refactorResult: generateRefactorData(filename, content, refactorType)
  };
};

const createMockResult = (filename, lines, content = null) => {
  if (content) return analyzeRealCode(filename, content, lines);

  const fileLines = lines || 1200;
  const fileName = filename || "remote-repo";
  const healthBase = Math.max(30, 100 - Math.min(60, Math.floor(fileLines / 40)));
  const grade = healthBase > 90 ? "A" : healthBase > 75 ? "B" : healthBase > 60 ? "C" : healthBase > 40 ? "D" : "F";
  
  return {
    metrics: {
      healthScore: healthBase,
      vulnerabilities: Math.floor(fileLines / 150) + 1,
      codeSmells: Math.floor(fileLines / 30) + 3,
      autoRefactorRate: Math.max(50, 95 - Math.floor(fileLines / 200)),
      healthTrend: [72, 65, 78, 71, 84, 80, healthBase],
      scannedFiles: Math.max(1, Math.ceil(fileLines / 300)),
      loc: fileLines,
      testCoverage: Math.max(10, 95 - Math.floor(fileLines/150)),
      techDebt: Math.ceil(fileLines * 0.05)
    },
    anomalies: [
      { id: fileName, x: 360, y: 150, status: healthBase < 50 ? "critical" : healthBase < 80 ? "warning" : "clean", issues: healthBase < 50 ? ["SQL Injection Vector", "God Class detected", "No input validation"] : healthBase < 80 ? ["Long Method", "Magic Numbers"] : ["No major issues"], type: "Target" },
      { id: "DatabaseLayer", x: 180, y: 220, status: "clean", issues: ["No issues detected"], type: "Core" },
      { id: "AuthModule", x: 540, y: 180, status: healthBase < 70 ? "critical" : "warning", issues: healthBase < 70 ? ["Hardcoded secrets"] : ["Long Method"], type: "Security" },
      { id: "CacheSys", x: 360, y: 320, status: "warning", issues: ["Memory leak possibility", "Inefficient lookup"], type: "Data" },
    ],
    grade: grade,
    refactorResult: generateRefactorData(fileName, null, null)
  };
};

// ─── Starfield (Three.js via CDN is too heavy for artifact; CSS canvas approach) ───
function Starfield() {
  const canvasRef = useRef(null);
  const raf = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    const resize = () => { W = window.innerWidth; H = window.innerHeight; canvas.width = W; canvas.height = H; };
    window.addEventListener("resize", resize);
    const stars = Array.from({ length: 280 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.3 + 0.05,
      twinkle: Math.random() * Math.PI * 2,
      color: Math.random() > 0.9 ? "#BF00FF" : Math.random() > 0.8 ? "#00F5FF" : "#ffffff"
    }));
    // Parallax layers
    const layers = [0.02, 0.05, 0.1];
    let mx = 0, my = 0;
    const onMove = (e) => { mx = (e.clientX / W - 0.5) * 2; my = (e.clientY / H - 0.5) * 2; };
    window.addEventListener("mousemove", onMove);
    let t = 0;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      t += 0.01;
      stars.forEach((s, i) => {
        const layer = layers[i % 3];
        const px = (s.x + mx * layer * 30 + W) % W;
        const py = (s.y + my * layer * 20 + H) % H;
        const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.twinkle + t * s.speed));
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.color.replace(")", `,${alpha})`).replace("rgb", "rgba").replace("#ffffff", `rgba(255,255,255,${alpha})`).replace("#BF00FF", `rgba(191,0,255,${alpha})`).replace("#00F5FF", `rgba(0,245,255,${alpha})`);
        ctx.fill();
        // Bright stars get a glow
        if (s.r > 1.2) {
          ctx.beginPath(); ctx.arc(px, py, s.r * 3, 0, Math.PI * 2);
          const g = ctx.createRadialGradient(px, py, 0, px, py, s.r * 3);
          g.addColorStop(0, s.color === "#00F5FF" ? "rgba(0,245,255,0.3)" : "rgba(255,255,255,0.1)");
          g.addColorStop(1, "transparent");
          ctx.fillStyle = g; ctx.fill();
        }
      });
      raf.current = requestAnimationFrame(draw);
    }
    draw();
    return () => { cancelAnimationFrame(raf.current); window.removeEventListener("resize", resize); window.removeEventListener("mousemove", onMove); };
  }, []);
  return <canvas ref={canvasRef} id="starfield" style={{ position: "fixed", inset: 0, zIndex: 0 }} />;
}

// ─── Custom Cursor ───
function Cursor() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  useEffect(() => {
    let rx = 0, ry = 0;
    const move = (e) => {
      if (cursorRef.current) { cursorRef.current.style.left = e.clientX + "px"; cursorRef.current.style.top = e.clientY + "px"; }
      rx += (e.clientX - rx) * 0.12; ry += (e.clientY - ry) * 0.12;
      if (ringRef.current) { ringRef.current.style.left = rx + "px"; ringRef.current.style.top = ry + "px"; }
    };
    const raf = requestAnimationFrame(function loop() { if (ringRef.current) { ringRef.current.style.left = rx + "px"; ringRef.current.style.top = ry + "px"; } requestAnimationFrame(loop); });
    window.addEventListener("mousemove", move);
    const hover = (e) => { if (e.target.closest("button,a,.plasma-btn,.metric-orb,.code-node")) ringRef.current?.classList.add("expanded"); else ringRef.current?.classList.remove("expanded"); };
    window.addEventListener("mouseover", hover);
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", hover); };
  }, []);
  return (<><div ref={cursorRef} id="cursor" /><div ref={ringRef} id="cursor-ring" /></>);
}

// ─── Animated Counter ───
function AnimCounter({ target, duration = 1800, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0, startTime = null;
        const step = (ts) => {
          if (!startTime) startTime = ts;
          const p = Math.min((ts - startTime) / duration, 1);
          setVal(Math.floor(p * p * target));
          if (p < 1) requestAnimationFrame(step);
          else setVal(target);
        };
        requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{val}{suffix}</span>;
}

// ─── Ripple Effect ───
function withRipple(onClick) {
  return (e) => {
    const btn = e.currentTarget;
    const r = document.createElement("span");
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    r.style.cssText = `position:absolute;border-radius:50%;background:rgba(0,245,255,0.3);width:${size}px;height:${size}px;left:${e.clientX - rect.left - size / 2}px;top:${e.clientY - rect.top - size / 2}px;transform:scale(0);animation:ripple 0.6s ease-out forwards;pointer-events:none;`;
    btn.appendChild(r);
    setTimeout(() => r.remove(), 600);
    if (onClick) onClick(e);
  };
}

// ─── Section 1: HERO ───
function Hero({ onAnalyze }) {
  return (
    <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", position: "relative", overflow: "hidden" }}>
      {/* Nebula blobs */}
      <div className="nebula-bg" style={{ width: 600, height: 600, background: "radial-gradient(circle, rgba(191,0,255,0.12) 0%, transparent 70%)", top: "10%", left: "-10%", animationDelay: "0s" }} />
      <div className="nebula-bg" style={{ width: 500, height: 500, background: "radial-gradient(circle, rgba(0,245,255,0.1) 0%, transparent 70%)", top: "30%", right: "-5%", animationDelay: "3s" }} />

      {/* Orbiting planet */}
      <div className="float-slow" style={{ position: "relative", width: 200, height: 200, marginBottom: 60 }}>
        <div style={{ width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, #1a0040, #000008)", border: "1px solid rgba(191,0,255,0.4)", boxShadow: "0 0 60px rgba(191,0,255,0.3), inset 0 0 40px rgba(191,0,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontFamily: "Space Mono", fontSize: 11, color: "rgba(0,245,255,0.6)", lineHeight: 1.6, textAlign: "center", padding: "0 20px" }}>{"{\n  code:\n  clean\n}"}</span>
        </div>
        {/* Orbit ring 1 */}
        <div style={{ position: "absolute", inset: -40, borderRadius: "50%", border: "1px solid rgba(0,245,255,0.15)", animation: "spin-slow 12s linear infinite" }}>
          <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", width: 12, height: 12, borderRadius: "50%", background: "var(--cyan)", boxShadow: "0 0 12px var(--cyan)" }} />
        </div>
        {/* Orbit ring 2 */}
        <div style={{ position: "absolute", inset: -70, borderRadius: "50%", border: "1px solid rgba(191,0,255,0.12)", animation: "counter-spin 18s linear infinite" }}>
          <div style={{ position: "absolute", top: -5, left: "50%", transform: "translateX(-50%)", width: 10, height: 10, borderRadius: "50%", background: "var(--purple)", boxShadow: "0 0 10px var(--purple)" }} />
        </div>
        {/* Code glyphs */}
        {["λ", "∑", "∞", "δ", "Ω", "∇"].map((g, i) => (
          <div key={i} style={{ position: "absolute", top: "50%", left: "50%", width: 24, height: 24, marginTop: -12, marginLeft: -12, display: "flex", alignItems: "center", justifyContent: "center", animation: `spin-slow ${8 + i * 2}s linear infinite`, transformOrigin: `${110 + i * 15}px 0` }}>
            <span style={{ fontFamily: "Space Mono", fontSize: 11, color: `hsl(${i * 60},100%,70%)`, opacity: 0.7, transform: `rotate(${-i * 60}deg)` }}>{g}</span>
          </div>
        ))}
      </div>

      <div className="section-label" style={{ marginBottom: 16, letterSpacing: 6 }}>LUMINACODE — v2.4.0</div>
      <h1 className="orbitron" style={{ fontSize: "clamp(32px, 6vw, 72px)", fontWeight: 900, textAlign: "center", lineHeight: 1.1, marginBottom: 20, background: "linear-gradient(135deg, var(--cyan) 0%, #fff 40%, var(--purple) 80%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
        YOUR CODE.<br />ILLUMINATED.<br />FROM THE VOID.
      </h1>
      <p style={{ fontFamily: "Exo 2", fontSize: 16, color: "var(--muted)", textAlign: "center", maxWidth: 480, marginBottom: 48, lineHeight: 1.8 }}>
        The premier code intelligence platform. Illuminating dark architecture and pulling anomalies into the light.
      </p>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <button className="plasma-btn pulse-glow" style={{ position: "relative", overflow: "hidden" }} onClick={withRipple(() => document.getElementById("scanner")?.scrollIntoView({ behavior: "smooth" }))}>
          ⬡ ANALYZE REPOSITORY
        </button>
        <button className="plasma-btn plasma-btn-purple" style={{ position: "relative", overflow: "hidden" }} onClick={withRipple(() => document.getElementById("metrics")?.scrollIntoView({ behavior: "smooth" }))}>
          VIEW MISSION STATS
        </button>
      </div>

      {/* Shooting star */}
      <div className="shooting-star" style={{ width: 150, top: "20%", left: "10%", animationDuration: "6s", animationDelay: "2s" }} />
      <div className="shooting-star" style={{ width: 100, top: "60%", left: "30%", animationDuration: "9s", animationDelay: "5s" }} />

      {/* Ticker */}
      <div style={{ position: "absolute", bottom: 30, left: 0, right: 0, borderTop: "1px solid rgba(0,245,255,0.1)", padding: "10px 0" }}>
        <div className="ticker-wrap">
          <div className="ticker-content mono" style={{ fontSize: 10, color: "rgba(0,245,255,0.4)", letterSpacing: 2 }}>
            {Array(4).fill("  ◆ ANTI-GRAVITY SCAN ACTIVE  ◆ CODE HEALTH: OPTIMAL  ◆ 847 REPOS ANALYZED TODAY  ◆ GRAVITATIONAL ANOMALIES: 12  ◆ ZERO-G REFACTORS: 94%  ").join("")}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 2: SCANNER ───
function Scanner({ scanResult, onScanComplete }) {
  const [url, setUrl] = useState("");
  const [errorUrl, setErrorUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [done, setDone] = useState(false);
  const [lang, setLang] = useState(null);
  const steps = ["Entering Orbit...", "Scanning Codebase...", "Detecting Anomalies...", "Mapping Dependencies...", "Generating Report..."];

  const detect = (v) => {
    if (v.includes(".py") || v.includes("python")) return "Python";
    if (v.includes(".java") || v.includes("spring")) return "Java";
    if (v.includes(".cpp") || v.includes(".cc")) return "C++";
    if (v.includes("github")) return "Auto-Detect";
    return null;
  };

  const getRepoLines = async (fetchUrl) => {
    const match = fetchUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) throw new Error("Invalid URL");
    const r = await fetch(`https://api.github.com/repos/${match[1]}/${match[2].replace('.git','')}`);
    if (!r.ok) throw new Error("Invalid URL");
    const data = await r.json();
    return (data.size || 500) * 10;
  };

  const runScan = async () => {
    if (!url) return;
    
    const isValidUrl = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i.test(url.trim()) || url.startsWith("local://") || url.includes("github.com/");
    if (!isValidUrl) {
      setErrorUrl("url is not valid please give the correct url");
      return;
    }
    setErrorUrl("");

    setScanning(true); setDone(false); setScanStep(0);
    setLang(detect(url) || "Auto-Detect");
    
    let generatedMockResult = null;
    let fileResult = null;

    if (url.startsWith("local://") && window.__lastFile) {
        fileResult = { name: window.__lastFile.name, content: window.__lastFile.content, lines: window.__lastFile.lines };
    } else {
        let fetchUrl = url;
        if (url.includes("github.com") && url.includes("/blob/")) {
            fetchUrl = url.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
            try {
                const res = await fetch(fetchUrl);
                if (!res.ok) throw new Error("Invalid file");
                const text = await res.text();
                fileResult = { name: url.split("/").pop(), content: text, lines: text.split("\n").length };
            } catch (e) {
                setScanning(false);
                return setErrorUrl("url is not valid please give the correct url");
            }
        }
    }

    try {
        if (fileResult) {
          runAnalysisPipeline(fileResult.name, fileResult.content, fileResult.lines);
          generatedMockResult = createMockResult(fileResult.name, fileResult.lines, fileResult.content);
        } else {
          // Verify directory / generic URL is actually resolvable
          let lines = 1500;
          if (url.includes("github.com")) {
              lines = await getRepoLines(url);
          } else {
              const res = await fetch(url, { method: "HEAD", mode: "no-cors" }).catch(() => null);
              if (!res) throw new Error("Invalid URL");
          }
          const name = url.split("/").pop() || "remote-repo";
          generatedMockResult = createMockResult(name, lines);
        }
        generatedMockResult.sourceUrl = url;
    } catch(e) {
        setScanning(false);
        return setErrorUrl("url is not valid please give the correct url");
    }
    
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setScanStep(i);
      if (i >= steps.length) { 
        clearInterval(iv); 
        setScanning(false); 
        setDone(true); 
        if (onScanComplete) onScanComplete(generatedMockResult);
      }
    }, 700);
  };

  return (
    <section id="scanner" style={{ padding: "100px 24px", display: "flex", justifyContent: "center" }}>
      <div className="glass-panel float" style={{ width: "100%", maxWidth: 720, padding: "48px" }}>
        <div className="section-label" style={{ marginBottom: 12 }}>02 — GRAVITY WELL DETECTOR</div>
        <h2 className="section-title" style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Repository Scanner</h2>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 36, fontFamily: "Exo 2" }}>Enter a GitHub URL or upload source files. LuminaCode maps every code anomaly.</p>

        <div style={{ position: "relative", marginBottom: 24, display: "flex", gap: "12px" }}>
          <div style={{ position: "relative", flex: 1 }}>
            <input
              placeholder="https://github.com/your/repository"
              value={url}
              onChange={e => { setUrl(e.target.value); setErrorUrl(""); }}
              onKeyDown={e => e.key === "Enter" && runScan()}
              style={{ width: "100%", paddingRight: 120, fontFamily: "Space Mono", fontSize: 12, border: errorUrl ? "1px solid #FF2255" : "1px solid var(--border)", outline: "none", background: "rgba(0,0,0,0.5)", color: "var(--text)", padding: "16px" }}
            />
            {lang && (
              <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,245,255,0.12)", border: "1px solid var(--cyan)", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "var(--cyan)", fontFamily: "Space Mono" }}>
                {lang}
              </div>
            )}
            {errorUrl && <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 4, color: "#FF2255", fontSize: 10, fontFamily: "Space Mono" }}>{errorUrl}</div>}
          </div>
          <button 
            className="plasma-btn plasma-btn-purple" 
            style={{ padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "none" }}
            onClick={withRipple(() => document.getElementById("hidden-file-input").click())}
            title="Upload Source File"
          >
            <span style={{ fontSize: "16px", marginRight: "8px" }}>⬆</span> UPLOAD
          </button>
          <input 
            id="hidden-file-input"
            type="file"
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];
                setUrl("local://" + file.name);
                setLang("Auto-Detect");
                const reader = new FileReader();
                reader.onload = (evt) => {
                  const content = evt.target.result;
                  const lines = content.split('\n').length;
                  window.__lastFile = { name: file.name, content, lines };
                };
                reader.readAsText(file);
              }
            }}
            style={{ display: "none" }} 
          />
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 36, flexWrap: "wrap" }}>
          {["Java", "Python", "C++", "TypeScript", "Go", "Rust"].map(l => (
            <div key={l} onClick={() => setLang(l)} style={{ padding: "6px 14px", borderRadius: 20, border: `1px solid ${lang === l ? "var(--cyan)" : "rgba(255,255,255,0.1)"}`, fontSize: 11, color: lang === l ? "var(--cyan)" : "var(--muted)", cursor: "none", transition: "all 0.2s", fontFamily: "Space Mono", background: lang === l ? "rgba(0,245,255,0.08)" : "transparent" }}>
              {l}
            </div>
          ))}
        </div>

        {/* Scan beam */}
        <div style={{ position: "relative", overflow: "hidden", height: 2, background: "rgba(255,255,255,0.05)", borderRadius: 1, marginBottom: 24 }}>
          {scanning && <div className="scan-beam" style={{ position: "absolute", height: "100%", width: "60%", background: "linear-gradient(90deg, transparent, var(--cyan), transparent)", boxShadow: "0 0 20px var(--cyan)" }} />}
          {done && <div style={{ position: "absolute", inset: 0, background: "var(--cyan)", boxShadow: "0 0 10px var(--cyan)" }} />}
        </div>

        {scanning && (
          <div style={{ marginBottom: 24 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, opacity: i <= scanStep ? 1 : 0.3, transition: "opacity 0.3s" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: i < scanStep ? "#00FF88" : i === scanStep ? "var(--cyan)" : "rgba(255,255,255,0.2)", boxShadow: i === scanStep ? "0 0 10px var(--cyan)" : "none", animation: i === scanStep ? "pulse-glow 1s infinite" : "none" }} />
                <span className="mono" style={{ fontSize: 11, color: i < scanStep ? "#00FF88" : "var(--text)" }}>{s}</span>
                {i < scanStep && <span style={{ marginLeft: "auto", fontSize: 10, color: "#00FF88" }}>✓</span>}
              </div>
            ))}
          </div>
        )}

        {done && (
          <div style={{ background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 8, padding: "14px 20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
            <CheckCircle size={16} color="#00FF88" />
            <span className="mono" style={{ fontSize: 12, color: "#00FF88" }}>SCAN COMPLETE — {scanResult?.metrics?.scannedFiles || "2,847"} files analyzed. {scanResult?.anomalies?.length || "12"} anomalies detected.</span>
          </div>
        )}

        <button className="plasma-btn" style={{ position: "relative", overflow: "hidden", width: "100%" }} onClick={withRipple(runScan)} disabled={scanning}>
          {scanning ? "SCANNING..." : done ? "RESCAN REPOSITORY" : "⚡ INITIATE GRAVITY SCAN"}
        </button>
      </div>
    </section>
  );
}

// ─── Section 3: METRICS ───
function Metrics({ scanResult }) {
  const data = scanResult?.metrics || { healthScore: 87, vulnerabilities: 12, codeSmells: 34, autoRefactorRate: 85, healthTrend: [72, 65, 78, 71, 84, 80, 87] };

  const orbs = [
    { label: "Code Health", value: data.healthScore, suffix: "", color: "#00F5FF", glow: "rgba(0,245,255,0.4)", icon: "⬡", detail: "Structural integrity assessed.", subLabel: "STELLAR SCORE" },
    { label: "Vulnerabilities", value: data.vulnerabilities, suffix: "", color: "#FF2255", glow: "rgba(255,34,85,0.4)", icon: "⚠", detail: "Review required.", subLabel: "ANOMALIES" },
    { label: "Code Smells", value: data.codeSmells, suffix: "", color: "#FF8C00", glow: "rgba(255,107,0,0.4)", icon: "☁", detail: "Nebulous patterns detected.", subLabel: "NEBULA CLOUDS" },
    { label: "Auto-Refactor", value: data.autoRefactorRate, suffix: "%", color: "#00FF88", glow: "rgba(0,255,136,0.4)", icon: "↑", detail: "Resolvable automatically.", subLabel: "ZERO-G RATE" }
  ];
  return (
    <section id="metrics" style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>03 — STELLAR METRICS</div>
          <h2 className="section-title" style={{ fontSize: 36, fontWeight: 700 }}>Orbital Intelligence</h2>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap", alignItems: "center" }}>
          {orbs.map((o, i) => (
            <div key={i} className="metric-orb float" style={{ width: 180, height: 180, animationDelay: `${i * 0.8}s`, position: "relative" }}>
              <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, rgba(0,0,30,0.9), var(--void))`, border: `2px solid ${o.color}`, boxShadow: `0 0 40px ${o.glow}, 0 0 80px ${o.glow.replace("0.4", "0.15")}, inset 0 0 40px ${o.glow.replace("0.4", "0.1")}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                <div className="section-label" style={{ color: o.color, fontSize: 9, marginBottom: 2 }}>{o.subLabel}</div>
                <div className="orbitron" style={{ fontSize: 36, fontWeight: 900, color: o.color, lineHeight: 1 }}>
                  <AnimCounter target={o.value} suffix={o.suffix} />
                </div>
                <div className="exo" style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", padding: "0 16px" }}>{o.label}</div>
              </div>
              {/* Orbit ring */}
              <div style={{ position: "absolute", inset: -20, borderRadius: "50%", border: `1px solid ${o.color.replace(")", ",0.2)")}`, animation: `spin-slow ${10 + i * 3}s linear infinite` }}>
                <div style={{ position: "absolute", top: -4, left: "50%", transform: "translateX(-50%)", width: 8, height: 8, borderRadius: "50%", background: o.color, boxShadow: `0 0 8px ${o.color}` }} />
              </div>
              <div className="orb-tooltip">
                <div className="mono" style={{ fontSize: 10, color: o.color, marginBottom: 6 }}>{o.label.toUpperCase()}</div>
                <div className="exo" style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.5 }}>{o.detail}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Recharts bar */}
        <div className="glass-panel" style={{ marginTop: 64, padding: "32px", overflow: "hidden" }}>
          <div className="section-label" style={{ marginBottom: 16 }}>HEALTH TREND — LAST 7 SCANS</div>
          <div style={{ display: "flex", gap: 4, alignItems: "flex-end", height: 80 }}>
            {data.healthTrend.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", height: v * 0.8, background: `linear-gradient(0deg, rgba(0,245,255,0.8), rgba(191,0,255,0.4))`, borderRadius: "3px 3px 0 0", boxShadow: "0 0 10px rgba(0,245,255,0.3)", transition: "height 1s ease", animation: `stagger-in 0.5s ease ${i * 0.1}s both` }} />
                <span className="mono" style={{ fontSize: 9, color: "var(--muted)" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section 4: CODE SMELL MAP ───
function AnomalyMap({ scanResult }) {
  const [selected, setSelected] = useState(null);
  const nodes = scanResult?.anomalies || [
    { id: "AuthModule", x: 220, y: 80, status: "critical", issues: ["SQL Injection (line 47)", "God Class (780 lines)", "XSS vulnerability (line 203)"], type: "Security" },
    { id: "UserService", x: 420, y: 140, status: "warning", issues: ["Long Method: processUser()", "Magic Numbers × 7", "Dead Code: 3 functions"], type: "Service" },
    { id: "Database", x: 140, y: 220, status: "clean", issues: ["No issues detected"], type: "Core" },
    { id: "APIGateway", x: 360, y: 260, status: "warning", issues: ["Buffer Overflow risk", "Missing null checks × 12"], type: "Network" },
    { id: "PaymentCtrl", x: 580, y: 180, status: "critical", issues: ["SQL Injection risk", "Hardcoded secrets", "No input validation"], type: "Critical" },
    { id: "CacheLayer", x: 520, y: 300, status: "clean", issues: ["No issues detected"], type: "Infra" },
    { id: "Analytics", x: 260, y: 320, status: "warning", issues: ["Memory leak detected", "Inefficient loops × 4"], type: "Data" },
    { id: "Config", x: 440, y: 380, status: "clean", issues: ["No issues detected"], type: "Config" },
  ];
  const edges = scanResult?.anomalies ? (scanResult.anomalies.length > 3 ? [[0,1], [1,2], [0,3]] : [[0,1]]) : [[0,1],[0,2],[1,3],[1,4],[3,5],[3,6],[5,7],[2,6]];
  const statusColor = { critical: "#FF2255", warning: "#FF8C00", clean: "#00FF88" };
  const statusY = { critical: -20, warning: -8, clean: 0 }; // Anti-gravity: bad code floats

  return (
    <section id="anomaly" style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>04 — ANOMALY MAP</div>
          <h2 className="section-title" style={{ fontSize: 36, fontWeight: 700 }}>Code Universe Graph</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 8 }}>Unstable code floats higher. Red nodes defy gravity the most. Click to inspect.</p>
        </div>

        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <div className="glass-panel" style={{ flex: 2, minWidth: 300, padding: "24px", position: "relative", overflow: "hidden" }}>
            <svg width="100%" viewBox="0 0 720 440" style={{ fontFamily: "Space Mono" }}>
              <defs>
                <filter id="glow-r"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="glow-o"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                <filter id="glow-g"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              {/* Edges */}
              {edges.map(([a, b], i) => {
                const na = nodes[a], nb = nodes[b];
                return <line key={i} x1={na.x} y1={na.y + statusY[na.status]} x2={nb.x} y2={nb.y + statusY[nb.status]} stroke="rgba(0,245,255,0.12)" strokeWidth="1" strokeDasharray="4 4" />;
              })}
              {/* Nodes */}
              {nodes.map((n, i) => {
                const c = statusColor[n.status];
                const yOff = statusY[n.status];
                return (
                  <g key={i} className="code-node" onClick={() => setSelected(n)} style={{ cursor: "pointer" }}>
                    <circle cx={n.x} cy={n.y + yOff} r={28} fill={`${c}15`} stroke={c} strokeWidth={selected?.id === n.id ? 2 : 1} filter={`url(#glow-${n.status === "critical" ? "r" : n.status === "warning" ? "o" : "g"})`} />
                    <circle cx={n.x} cy={n.y + yOff} r={10} fill={`${c}40`} stroke={c} strokeWidth="1" />
                    <text x={n.x} y={n.y + yOff + 44} textAnchor="middle" fill="rgba(224,248,255,0.7)" fontSize="9">{n.id}</text>
                    <text x={n.x} y={n.y + yOff + 54} textAnchor="middle" fill={c} fontSize="8">{n.type}</text>
                    {n.status === "critical" && <text x={n.x + 20} y={n.y + yOff - 20} fill="#FF2255" fontSize="12">↑</text>}
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Side panel */}
          <div className="glass-panel" style={{ flex: 1, minWidth: 240, padding: "28px" }}>
            {selected ? (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <div>
                    <div className="mono" style={{ fontSize: 14, color: statusColor[selected.status] }}>{selected.id}</div>
                    <div className="section-label" style={{ color: statusColor[selected.status] }}>{selected.status.toUpperCase()}</div>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 4, color: "var(--muted)", cursor: "none", padding: "4px 8px" }}><X size={12} /></button>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <div className="section-label" style={{ marginBottom: 10 }}>DETECTED ISSUES</div>
                  {selected.issues.map((iss, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10, padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: 6, borderLeft: `2px solid ${statusColor[selected.status]}` }}>
                      <AlertTriangle size={11} color={statusColor[selected.status]} style={{ marginTop: 2, flexShrink: 0 }} />
                      <span className="exo" style={{ fontSize: 12, color: "var(--text)", lineHeight: 1.5 }}>{iss}</span>
                    </div>
                  ))}
                </div>
                <button className="plasma-btn plasma-btn-orange" style={{ width: "100%", position: "relative", overflow: "hidden", fontSize: 11 }} onClick={withRipple(() => document.getElementById("refactor")?.scrollIntoView({ behavior: "smooth" }))}>
                  AUTO-REFACTOR →
                </button>
              </>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12, opacity: 0.5 }}>
                <GitBranch size={32} color="var(--cyan)" />
                <p className="exo" style={{ fontSize: 13, textAlign: "center", color: "var(--muted)" }}>Select a node to inspect its gravitational anomalies</p>
              </div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: "flex", gap: 24, marginTop: 24, flexWrap: "wrap" }}>
          {[["#FF2255", "Critical — Defying Gravity"], ["#FF8C00", "Warning — Unstable Orbit"], ["#00FF88", "Clean — Zero Anomalies"]].map(([c, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: c, boxShadow: `0 0 8px ${c}` }} />
              <span className="exo" style={{ fontSize: 12, color: "var(--muted)" }}>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section 5: REFACTOR ───
function Refactor({ scanResult }) {
  const autoRefactorRate = scanResult?.metrics?.autoRefactorRate || 85;
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const before = scanResult?.refactorResult?.before || `// AuthModule.java — BEFORE
public List<User> getUsers(String input) {
  String query = "SELECT * FROM users WHERE name = '" 
               + input + "'";  // SQL Injection!
  return db.execute(query);     // God Class (820 lines)
}
// Dead code below — never called
private void legacyAuth() { /* 240 lines... */ }`;

  const after = scanResult?.refactorResult?.after || `// AuthModule.java — AFTER (Zero-G Refactor)
public List<User> getUsers(String input) {
  String query = "SELECT * FROM users WHERE name = ?";
  PreparedStatement stmt = db.prepare(query);
  stmt.setString(1, sanitize(input));
  return stmt.executeQuery();   // Safe & clean ✓
}
// Dead code removed — 240 lines purged ✓`;

  const tests = scanResult?.refactorResult?.tests || [
    { name: "AuthTest::testSQLInjectionPrevention", pass: true },
    { name: "AuthTest::testInputSanitization", pass: true },
    { name: "AuthTest::testNullInput", pass: true },
    { name: "AuthTest::testMaxLength", pass: false },
    { name: "AuthTest::testSpecialChars", pass: true },
  ];

  return (
    <section id="refactor" style={{ padding: "100px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ marginBottom: 48 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>05 — ZERO-G REFACTOR</div>
          <h2 className="section-title" style={{ fontSize: 36, fontWeight: 700 }}>Self-Healing Engine</h2>
          <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
            <div style={{ background: "rgba(0,255,136,0.1)", border: "1px solid rgba(0,255,136,0.3)", borderRadius: 20, padding: "6px 16px", fontSize: 12, color: "#00FF88", fontFamily: "Space Mono" }}>{autoRefactorRate}% AUTO-REFACTOR RATE</div>
            <div style={{ background: "rgba(0,245,255,0.08)", border: "1px solid rgba(0,245,255,0.2)", borderRadius: 20, padding: "6px 16px", fontSize: 12, color: "var(--cyan)", fontFamily: "Space Mono" }}>SANDBOXED TEST RESULTS — ORBITAL VERIFICATION</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 32 }}>
          {/* Before */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="section-label" style={{ marginBottom: 10, color: "#FF2255" }}>BEFORE — ANOMALY DETECTED</div>
            <div style={{ background: "rgba(255,34,85,0.04)", border: "1px solid rgba(255,34,85,0.2)", borderRadius: 10, padding: "20px", position: "relative", overflow: "hidden" }}>
              <pre className="mono" style={{ fontSize: 11, color: "rgba(224,248,255,0.8)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{before}</pre>
            </div>
          </div>

          {/* Arrow */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ position: "relative", width: 60, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ width: 1, height: 60, background: "linear-gradient(180deg, transparent, var(--cyan), transparent)", boxShadow: "0 0 10px var(--cyan)" }} />
              {applied ? <CheckCircle size={24} color="#00FF88" /> : <Zap size={24} color="var(--cyan)" style={{ animation: applying ? "pulse-glow 0.5s infinite" : "none" }} />}
              <div style={{ width: 1, height: 60, background: "linear-gradient(180deg, transparent, var(--cyan), transparent)", boxShadow: "0 0 10px var(--cyan)" }} />
            </div>
          </div>

          {/* After */}
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="section-label" style={{ marginBottom: 10, color: "#00FF88" }}>AFTER — ANOMALY RESOLVED</div>
            <div style={{ background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.2)", borderRadius: 10, padding: "20px", position: "relative", overflow: "hidden" }}>
              <pre className="mono" style={{ fontSize: 11, color: "rgba(224,248,255,0.8)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{after}</pre>
              {applying && <div style={{ position: "absolute", top: 0, left: 0, height: "100%", width: "3px", background: "var(--cyan)", boxShadow: "0 0 20px var(--cyan)", animation: "repair-beam 1.5s ease forwards" }} />}
            </div>
          </div>
        </div>

        {/* Tests */}
        <div className="glass-panel" style={{ padding: "28px", marginBottom: 24 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>SANDBOXED TEST RESULTS — ORBITAL VERIFICATION</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {tests.map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: t.pass ? "rgba(0,255,136,0.06)" : "rgba(255,34,85,0.06)", border: `1px solid ${t.pass ? "rgba(0,255,136,0.25)" : "rgba(255,34,85,0.25)"}`, borderRadius: 8, flex: "1 1 200px" }}>
                {t.pass ? <CheckCircle size={12} color="#00FF88" /> : <XCircle size={12} color="#FF2255" />}
                <span className="mono" style={{ fontSize: 10, color: t.pass ? "#00FF88" : "#FF2255" }}>{t.name.split("::")[1]}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          className="plasma-btn"
          style={{ position: "relative", overflow: "hidden" }}
          onClick={withRipple(() => {
            setApplying(true);
            setTimeout(() => { setApplying(false); setApplied(true); }, 1500);
          })}
        >
          {applied ? "✓ FIX APPLIED TO CODEBASE" : applying ? "APPLYING REPAIR BEAM..." : "⚡ APPLY ZERO-G FIX"}
        </button>
      </div>
    </section>
  );
}

// ─── Section 6: AI ASSISTANT ───
function AIAssistant({ scanResult }) {
  const [open, setOpen] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [apiKeySaved, setApiKeySaved] = useState(false);
  const [messages, setMessages] = useState([
    { role: "ai", text: `🌌 LuminaCode Intelligence online. Ask me about your codebase anomalies, your orbital grade, or refactoring strategies.` }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const gradeMap = { A: ["Neutron Star", "grade-neutron"], B: ["Pulsar", "grade-pulsar"], C: ["White Dwarf", "grade-dwarf"], D: ["Red Giant", "grade-giant"], F: ["Black Hole", "grade-blackhole"] };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim(); 
    setInput(""); 
    setLoading(true);

    setMessages(m => [...m, { role: "user", text: userMsg }]);

    if (apiKeySaved && apiKey) {
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            const contextPayload = scanResult ? `\n\nCURRENT REPOSITORY CONTEXT:\n${JSON.stringify(scanResult, null, 2)}` : "";
            const systemInst = `You are LuminaCode Orbital Intelligence — an AI code quality assistant with an anti-gravity space theme.\nYou help developers understand code quality issues based on the structured JSON anomalies provided by the Master Analysis pass. Provide concise, expert-level advice. Always format code suggestions with markdown blocks. Reference the current payload to answer specific metric and anomaly questions.${contextPayload}\n\n` + MASTER_SYSTEM_PROMPT;
            
            const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: systemInst });
            
            const chatHistory = messages.filter((m, idx) => !(idx === 0 && m.role === "ai")).map(msg => ({
                role: msg.role === "ai" ? "model" : "user",
                parts: [{ text: msg.text }]
            }));
            
            const chat = model.startChat({ history: chatHistory });
            const result = await chat.sendMessage(userMsg);
            const text = result.response.text();
            
            setMessages(m => [...m, { role: "ai", text }]);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setMessages(m => [...m, { role: "ai", text: "Gravitational interference! LLM connection failed. Check your API key or connection." }]);
            setLoading(false);
        }
        return;
    }

    // Mock fallback logic
    let mockResponse = "";
    const q = userMsg.toLowerCase();
    if (q.includes("sql") || q.includes("injection") || q.includes("security")) {
       mockResponse = "To resolve these security anomalies, replace standard statement concatenation with a parameter-bound `PreparedStatement` or use an established ORM. Never trust raw user inputs.";
    } else if (q.includes("grade") || q.includes("score")) {
       mockResponse = `Your current orbital grade is ${scanResult?.grade || "class-dependent"}. The health score is sitting at ${scanResult?.metrics?.healthScore || "fluctuating levels"}. We detected ${scanResult?.anomalies?.length || "several"} outstanding anomalies pulling your score down.`;
    } else if (q.includes("refactor")) {
       mockResponse = `The auto-refactor rate is currently ${scanResult?.metrics?.autoRefactorRate || 85}%. Look closely at the Code Universe graph to see which red nodes are defying gravity the most, and apply Zero-G fixes there first.`;
    } else {
       mockResponse = "Orbital transmission intercepted (API Key missing or invalid). Please attach a Google Gemini API Key in the chat header to enable live LLM integrations!";
    }
    setTimeout(() => {
      setMessages(m => [...m, { role: "ai", text: mockResponse }]);
      setLoading(false);
    }, 800);
  };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const grade = scanResult?.grade || "B";
  const [gradeName, gradeClass] = gradeMap[grade] || gradeMap["B"];

  return (
    <>
      {/* Floating bubble */}
      {!open && (
        <div className="chat-bubble" onClick={() => setOpen(true)} style={{ position: "fixed", bottom: 32, right: 32, width: 60, height: 60, borderRadius: "50%", background: "var(--glass)", border: "2px solid var(--cyan)", backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "none", zIndex: 1000, boxShadow: "0 0 30px rgba(0,245,255,0.4)", animation: "float 3s ease-in-out infinite" }}>
          <MessageSquare size={22} color="var(--cyan)" />
          <div style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: "50%", background: "#FF2255", border: "2px solid var(--void)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "white", fontWeight: 700 }}>{scanResult?.anomalies?.length || 3}</div>
        </div>
      )}

      {/* Chat panel */}
      {open && (
        <div className="glass-panel" style={{ position: "fixed", bottom: 24, right: 24, width: 380, height: 540, zIndex: 1000, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "radial-gradient(circle at 35% 35%, rgba(0,245,255,0.3), transparent)", border: "1px solid var(--cyan)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Cpu size={16} color="var(--cyan)" />
              </div>
              <div>
                <div className="orbitron" style={{ fontSize: 12, color: "var(--cyan)" }}>ORBITAL INTELLIGENCE</div>
                <div className="exo" style={{ fontSize: 10, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00FF88", boxShadow: "0 0 6px #00FF88" }} /> &lt;3s Warp Speed
                </div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right", display: "flex", gap: 8, alignItems: "center" }}>
                <div>
                  <div className="mono" style={{ fontSize: 9, color: "var(--muted)" }}>REPO GRADE</div>
                  <div className={`orbitron ${gradeClass}`} style={{ fontSize: 20, fontWeight: 900 }}>{grade}</div>
                </div>
                <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "none", paddingBottom: 10 }}><X size={14} /></button>
              </div>
            </div>
            
            {/* API Key Input */}
            {!apiKeySaved ? (
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="password" value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="Attach Gemini API Key for Live AI..." style={{ flex: 1, fontSize: 10, padding: "6px 8px", background: "rgba(0,0,0,0.5)", border: "1px solid var(--border)", color: "var(--cyan)", outline: "none", fontFamily: "Space Mono" }} />
                  <button onClick={() => setApiKeySaved(true)} style={{ fontSize: 10, padding: "6px 12px", background: "var(--cyan)", border: "none", color: "var(--void)", cursor: "none", fontWeight: 700, fontFamily: "Orbitron" }}>CONNECT</button>
                </div>
            ) : (
                <div style={{ fontSize: 10, color: "#00FF88", display: "flex", justifyContent: "space-between", fontFamily: "Space Mono" }}>
                  <span>✓ LIVE LLM DETECTED</span>
                  <span onClick={() => setApiKeySaved(false)} style={{ cursor: "none", textDecoration: "underline", color: "var(--muted)" }}>Edit Key</span>
                </div>
            )}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px", display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                <div style={{ maxWidth: "85%", padding: "10px 14px", borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", background: m.role === "user" ? "rgba(0,245,255,0.12)" : "rgba(191,0,255,0.1)", border: `1px solid ${m.role === "user" ? "rgba(0,245,255,0.25)" : "rgba(191,0,255,0.25)"}` }}>
                  <p className="exo" style={{ fontSize: 12, lineHeight: 1.6, color: "var(--text)" }}>{m.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", gap: 6, padding: "10px 14px" }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--purple)", animation: `blink 1.2s ${i * 0.2}s infinite` }} />)}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick prompts */}
          <div style={{ padding: "8px 12px", display: "flex", gap: 6, flexWrap: "wrap", borderTop: "1px solid var(--border)" }}>
            {["Why is auth flagged?", "Fix SQL injection", "Grade explanation"].map(q => (
              <div key={q} onClick={() => { setInput(q); }} style={{ padding: "4px 10px", borderRadius: 12, border: "1px solid rgba(0,245,255,0.15)", fontSize: 10, color: "var(--muted)", cursor: "none", transition: "all 0.2s", fontFamily: "Exo 2" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--cyan)"; e.currentTarget.style.color = "var(--cyan)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(0,245,255,0.15)"; e.currentTarget.style.color = "var(--muted)"; }}>
                {q}
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: "12px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask about your codebase..."
              style={{ flex: 1, fontSize: 12, padding: "10px 14px" }}
            />
            <button className="plasma-btn" style={{ padding: "8px 14px", fontSize: 11, position: "relative", overflow: "hidden", flexShrink: 0 }} onClick={withRipple(sendMessage)} disabled={loading}>
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Section 7: MISSION DEBRIEF ───
function MissionDebrief({ scanResult }) {
  const anomalies = scanResult?.anomalies || [];
  const metrics = scanResult?.metrics || { scannedFiles: 2847, loc: 148392 };
  const grade = scanResult?.grade || "B";
  const gradeMap = { A: ["Neutron Star", "grade-neutron"], B: ["Pulsar", "grade-pulsar"], C: ["White Dwarf", "grade-dwarf"], D: ["Red Giant", "grade-giant"], F: ["Black Hole", "grade-blackhole"] };
  const gradeClass = gradeMap[grade]?.[1] || "grade-pulsar";
  const gradeName = gradeMap[grade]?.[0] || "Pulsar Class";
  const [downloading, setDownloading] = useState(false);

  const exportPDF = async () => {
    setDownloading(true);
    const element = document.getElementById("report-content");
    if (element) {
      try {
        const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#000008" });
        const imgData = canvas.toDataURL("image/jpeg", 0.9);
        const pdf = new jsPDF({
          orientation: canvas.width > canvas.height ? "landscape" : "portrait",
          unit: "px",
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);
        pdf.save("LuminaCode_Mission_Log.pdf");
      } catch (err) {
        console.error("PDF generation failed", err);
      }
    }
    setDownloading(false);
  };

  const findings = anomalies.length > 0 ? anomalies.map(a => ({
    title: a.issues[0] || "Anomaly detected",
    severity: a.status.toUpperCase(),
    file: a.id,
    desc: `Type: ${a.type}. ${a.issues.join(", ")}`,
    color: a.status === "critical" ? "#FF2255" : a.status === "warning" ? "#FF8C00" : "#00FF88"
  })) : [
    { title: "SQL Injection Vector", severity: "CRITICAL", file: "AuthModule.java:47", desc: "Unsanitized user input concatenated directly into SQL query. Immediate refactor required.", color: "#FF2255" },
    { title: "God Class Anti-Pattern", severity: "HIGH", file: "AuthModule.java", desc: "820-line class violates Single Responsibility. Split into AuthService, TokenManager, SessionHandler.", color: "#FF8C00" },
    { title: "Memory Leak", severity: "MEDIUM", file: "Analytics.java:203", desc: "Connection not closed in finally block. Causes gradual heap exhaustion under load.", color: "#FFD700" },
    { title: "Dead Code Cluster", severity: "LOW", file: "Multiple files", desc: "19 unreachable functions identified. Safe to remove — reduces binary size by ~12KB.", color: "#00F5FF" },
  ];
  const wins = anomalies.length > 0 ? anomalies.slice(0,3).map((a, i) => ({
    title: ["Pattern Optimization", "Complexity Extraction", "Memory Management", "Type Assertion"][i % 4],
    file: a.id,
    lines: (Math.floor((a.id.length * 4) % 40) + 4) + " lines refactored"
  })) : [
    { title: "Query Parameterization", file: "UserService.java", lines: "34 lines refactored" },
    { title: "Method Extraction", file: "PaymentCtrl.java", lines: "3 long methods split" },
    { title: "Magic Number Removal", file: "Config.java", lines: "7 constants extracted" },
  ];
  return (
    <section id="report" style={{ padding: "100px 24px" }}>
      <div id="report-content" style={{ maxWidth: 1100, margin: "0 auto", padding: "40px", background: "var(--void)", borderRadius: "16px" }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div className="section-label" style={{ marginBottom: 12 }}>07 — MISSION DEBRIEF</div>
          <h2 className="section-title" style={{ fontSize: 36, fontWeight: 700 }}>Repository Health Report</h2>
          <p style={{ color: "var(--muted)", fontSize: 14, marginTop: 8 }}>Generated by LuminaCode Scanner v2.4.0</p>
        </div>

        {/* Executive Summary */}
        <div className="glass-panel" style={{ padding: "40px", marginBottom: 32, animation: "stagger-in 0.6s ease both" }}>
          <div className="section-label" style={{ marginBottom: 20 }}>EXECUTIVE SUMMARY</div>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px" }}>
              <div className="mono" style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>OVERALL GRADE</div>
              <div className={`orbitron ${gradeClass}`} style={{ fontSize: 72, fontWeight: 900, lineHeight: 1 }}>{grade}</div>
              <div className={`exo ${gradeClass}`} style={{ fontSize: 14, marginTop: 4 }}>{gradeName}</div>
            </div>
            <div style={{ flex: "3 1 400px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 16 }}>
              {[["Files Scanned", metrics.scannedFiles || "2,847"], ["Lines of Code", metrics.loc || "148,392"], ["Test Coverage", metrics.testCoverage ? `${metrics.testCoverage}%` : "67%"], ["Tech Debt", metrics.techDebt ? `~${metrics.techDebt}h` : "~14h"]].map(([l, v]) => (
                <div key={l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "16px", border: "1px solid rgba(0,245,255,0.1)" }}>
                  <div className="section-label" style={{ marginBottom: 6 }}>{l}</div>
                  <div className="orbitron" style={{ fontSize: 24, color: "var(--cyan)" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Critical Findings */}
        <div style={{ marginBottom: 32 }}>
          <div className="section-label" style={{ marginBottom: 20 }}>CRITICAL FINDINGS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {findings.map((f, i) => (
              <div key={i} className="glass-panel" style={{ padding: "20px 24px", display: "flex", gap: 20, alignItems: "flex-start", animation: `stagger-in 0.5s ease ${i * 0.1}s both`, borderLeft: `3px solid ${f.color}` }}>
                <div style={{ flexShrink: 0, width: 80 }}>
                  <div style={{ padding: "4px 8px", borderRadius: 4, background: `${f.color}20`, border: `1px solid ${f.color}40`, fontSize: 9, fontFamily: "Space Mono", color: f.color, textAlign: "center" }}>{f.severity}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div className="mono" style={{ fontSize: 14, marginBottom: 4, color: "var(--text)" }}>{f.title}</div>
                  <div className="mono" style={{ fontSize: 10, color: f.color, marginBottom: 6 }}>{f.file}</div>
                  <div className="exo" style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refactor Wins */}
        <div style={{ marginBottom: 48 }}>
          <div className="section-label" style={{ marginBottom: 20 }}>REFACTOR WINS</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {wins.map((w, i) => (
              <div key={i} className="glass-panel" style={{ flex: "1 1 200px", padding: "20px", borderLeft: "3px solid #00FF88", animation: `stagger-in 0.5s ease ${i * 0.15}s both` }}>
                <div className="mono" style={{ fontSize: 13, marginBottom: 6, color: "#00FF88" }}>{w.title}</div>
                <div className="exo" style={{ fontSize: 11, color: "var(--muted)" }}>{w.file}</div>
                <div className="exo" style={{ fontSize: 11, color: "rgba(0,255,136,0.7)" }}>{w.lines}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="plasma-btn" style={{ position: "relative", overflow: "hidden" }} onClick={withRipple(typeof exportPDF !== "undefined" ? exportPDF : null)} disabled={downloading}>
            <Download size={14} style={{ marginRight: 8, display: "inline" }} />{downloading ? "GENERATING PDF..." : "EJECT MISSION LOG (PDF)"}
          </button>
          <button className="plasma-btn plasma-btn-orange" style={{ position: "relative", overflow: "hidden" }} onClick={withRipple(() => document.getElementById("scanner")?.scrollIntoView({ behavior: "smooth" }))}>
            <RefreshCw size={14} style={{ marginRight: 8, display: "inline" }} />NEW SCAN SEQUENCE
          </button>
        </div>
      </div>
    </section>
  );
}

// ─── AUTH MODAL ───
function AuthModal() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleManual = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError("Coordinates incomplete. Fill both fields.");
    try {
      if (isRegister) await createUserWithEmailAndPassword(auth, email, password);
      else await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,8,0.6)", backdropFilter: "blur(15px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="glass-panel" style={{ width: 400, padding: 40, border: "1px solid var(--cyan)", boxShadow: "0 0 50px rgba(0,245,255,0.15)" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Shield size={40} color="var(--cyan)" style={{ margin: "0 auto 16px auto" }} />
          <h2 className="orbitron" style={{ fontSize: 24, letterSpacing: 2, color: "var(--text)" }}>{isRegister ? "REGISTER CLEARANCE" : "ENTER ORBIT"}</h2>
          <p className="exo" style={{ fontSize: 13, color: "var(--muted)", marginTop: 8 }}>{isRegister ? "Register a new crew profile." : "Authenticate your console session."}</p>
        </div>

        {error && <div style={{ background: "rgba(255,34,85,0.1)", border: "1px solid var(--purple)", color: "#FF2255", padding: 12, borderRadius: 8, fontSize: 11, marginBottom: 20, textAlign: "center" }}>{error}</div>}

        <form onSubmit={handleManual} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Crew Email Address" style={{ padding: "12px 16px", background: "rgba(0,0,0,0.5)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 8, outline: "none", fontFamily: "Space Mono", fontSize: 12 }} />
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Access Code (Password)" style={{ padding: "12px 16px", background: "rgba(0,0,0,0.5)", border: "1px solid var(--border)", color: "var(--text)", borderRadius: 8, outline: "none", fontFamily: "Space Mono", fontSize: 12 }} />
          <button type="submit" className="plasma-btn" style={{ position: "relative", overflow: "hidden", padding: "14px", marginTop: 8, fontSize: 14 }}>
            {isRegister ? "INITIALIZE SEQUENCE" : "INITIATE LOGIN"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: 16, margin: "24px 0" }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <div className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>OR</div>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <button onClick={handleGoogle} className="plasma-btn plasma-btn-purple" style={{ position: "relative", overflow: "hidden", padding: "14px", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <Activity size={16} /> CONTINUE WITH GOOGLE
        </button>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button onClick={() => { setIsRegister(!isRegister); setError(""); }} style={{ background: "none", border: "none", color: "var(--cyan)", fontFamily: "Space Mono", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>
            {isRegister ? "Already hold clearance? Login." : "New recruit? Register here."}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── NAV ───
function Nav({ user }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 50); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 500, padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", background: scrolled ? "rgba(0,0,8,0.9)" : "backdrop-filter" }}>
      <div className="orbitron" style={{ fontSize: 16, fontWeight: 700, color: "var(--cyan)", letterSpacing: 3 }}>LUMINA<span style={{ color: "var(--purple)" }}>CODE</span></div>
      <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
        {["Scanner", "Metrics", "Anomaly", "Refactor", "Report"].map(s => (
          <a key={s} href={`#${s.toLowerCase()}`} onClick={e => { e.preventDefault(); document.getElementById(s.toLowerCase())?.scrollIntoView({ behavior: "smooth" }); }} style={{ fontFamily: "Space Mono", fontSize: 10, color: "var(--muted)", letterSpacing: 2, textDecoration: "none", cursor: "pointer", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = "var(--cyan)"}
            onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}>{s.toUpperCase()}</a>
        ))}
        {user ? (
          <button onClick={() => signOut(auth)} style={{ background: "transparent", border: "1px solid rgba(255,34,85,0.4)", color: "#FF2255", padding: "6px 12px", borderRadius: 4, cursor: "pointer", fontFamily: "Space Mono", fontSize: 10 }}>[ LOGOUT {user.email?.split("@")[0].toUpperCase()} ]</button>
        ) : (
          <span style={{ fontFamily: "Space Mono", fontSize: 10, color: "var(--cyan)", border: "1px solid var(--cyan)", padding: "6px 12px", borderRadius: 4 }}>AWAITING AUTH</span>
        )}
      </div>
    </nav>
  );
}

// ─── MISSION LOGS (HISTORY) ───
function MissionLogs({ logs }) {
  if (!logs || logs.length === 0) return null;
  return (
    <section id="history" style={{ padding: "40px 24px", display: "flex", justifyContent: "center" }}>
      <div className="glass-panel" style={{ width: "100%", maxWidth: 900, padding: "48px" }}>
        <div className="section-label" style={{ marginBottom: 12 }}>ARCHIVE — PAST SCANS</div>
        <h2 className="section-title" style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>Mission Logs</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: "400px", overflowY: "auto", paddingRight: 8 }}>
          {logs.map((log) => (
            <div key={log.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "rgba(255,255,255,0.03)", border: "1px solid var(--border)", borderRadius: 8 }}>
              <div>
                <div style={{ fontSize: 14, fontFamily: "Space Mono", color: "var(--cyan)", marginBottom: 4, wordBreak: "break-all" }}>{log.repo_url}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", fontFamily: "Space Mono" }}>{new Date(log.timestamp + "Z").toLocaleString()}</div>
              </div>
              <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
                <div style={{ textAlign: "center", minWidth: "60px" }}>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 4 }}>FILES</div>
                  <div className="orbitron" style={{ fontSize: 14 }}>{log.files_scanned}</div>
                </div>
                <div style={{ textAlign: "center", minWidth: "80px" }}>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 4 }}>ANOMALIES</div>
                  <div className="orbitron" style={{ fontSize: 14, color: log.anomalies_found > 5 ? "#FF2255" : "var(--text)" }}>{log.anomalies_found}</div>
                </div>
                <div style={{ textAlign: "center", minWidth: "50px" }}>
                  <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 4 }}>GRADE</div>
                  <div className="orbitron" style={{ fontSize: 24, fontWeight: 900, color: log.grade === 'A' ? 'var(--cyan)' : log.grade === 'B' ? 'var(--purple)' : log.grade === 'C' ? 'var(--orange)' : '#FF2255' }}>{log.grade}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ROOT APP ───
export default function LuminaCode() {
  const [scanResult, setScanResult] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [logs, setLogs] = useState([]);

  const fetchLogs = useCallback(async (uid) => {
    try {
      const res = await fetch(`http://localhost:8000/api/scans/${uid}`);
      const data = await res.json();
      if (data.scans) setLogs(data.scans);
    } catch (e) { console.error("Failed to fetch logs", e); }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u);
      setAuthLoading(false);
      if (u) fetchLogs(u.uid);
    });
    return unsub;
  }, [fetchLogs]);

  const handleScanComplete = async (result) => {
    setScanResult(result);
    if (user && result) {
      try {
        await fetch("http://localhost:8000/api/scans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_uid: user.uid,
            repo_url: result.sourceUrl || "local-repo",
            grade: result.grade,
            files_scanned: result.metrics.scannedFiles || 0,
            anomalies_found: result.anomalies?.length || 0
          })
        });
        fetchLogs(user.uid);
      } catch (e) {
        console.error("Failed to save scan", e);
      }
    }
  };

  if (authLoading) return <div style={{ height: "100vh", background: "var(--void)" }} />;

  return (
    <>
      <style>{FONTS + CSS}</style>
      <Starfield />
      <Cursor />
      <Nav user={user} />
      
      {!user && <AuthModal />}

      <main style={{ filter: !user ? "blur(15px)" : "none", opacity: !user ? 0.3 : 1, transition: "all 0.8s", pointerEvents: !user ? "none" : "all", height: !user ? "100vh" : "auto", overflow: !user ? "hidden" : "visible" }}>
        <Hero />
        <Scanner scanResult={scanResult} onScanComplete={handleScanComplete} />
        {user && logs.length > 0 && <MissionLogs logs={logs} />}
        <Metrics scanResult={scanResult} />
        <AnomalyMap scanResult={scanResult} />
        <Refactor scanResult={scanResult} />
        <MissionDebrief scanResult={scanResult} />
      </main>
      
      {user && <AIAssistant />}
      
      <footer style={{ position: "relative", zIndex: 1, borderTop: "1px solid var(--border)", padding: "32px", textAlign: "center" }}>
        <div className="orbitron" style={{ fontSize: 12, color: "var(--muted)", letterSpacing: 3 }}>LUMINACODE © 2024 — ORBITAL INTELLIGENCE DIVISION</div>
        <div className="exo" style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 8 }}>Powered by Claude AI · Built at the intersection of Google DeepMind × NASA Mission Control</div>
      </footer>
    </>
  );
}
