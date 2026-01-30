import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Play, Trash2, Terminal as TerminalIcon, Loader2 } from 'lucide-react';

const Sandbox = () => {
    const [code, setCode] = useState(`# Python Sandbox Environment
# Try writing some code and click Run!

def greet(name):
    return f"Hello, {name} from LuminaCode!"

print(greet("Developer"))
for i in range(3):
    print(f"Count: {i}")
`);
    const [output, setOutput] = useState('');
    const [isRunning, setIsRunning] = useState(false);

    const runCode = async () => {
        setIsRunning(true);
        setOutput("Executing...");
        try {
            const response = await fetch('http://localhost:8000/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code: code, filename: "sandbox.py" })
            });
            const data = await response.json();
            setOutput(data.output || "No output returned.");
        } catch (error) {
            setOutput(`Error: ${error.message} `);
        } finally {
            setIsRunning(false);
        }
    };

    return (
        <div className="p-8 h-[calc(100vh-2rem)] flex flex-col animate-in fade-in">
            <h1 className="text-3xl font-bold text-white mb-6">Lumina Sandbox</h1>

            <div className="flex-1 flex gap-6 min-h-0">
                <div className="flex-1 glass-panel flex flex-col relative overflow-hidden">
                    <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-slate-900/50">
                        <span className="text-sm font-mono text-lumina-text-secondary">script.py</span>
                        <div className="flex gap-2">
                            <button className="p-2 hover:bg-white/10 rounded transition-colors text-red-400" onClick={() => setCode('')} title="Clear Code">
                                <Trash2 size={16} />
                            </button>
                            <button
                                className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white text-xs font-bold rounded flex items-center gap-2 transition-colors disabled:opacity-50"
                                onClick={runCode}
                                disabled={isRunning}
                            >
                                {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
                                Run
                            </button>
                        </div>
                    </div>
                    <textarea
                        className="flex-1 bg-[#1e1e1e] text-transparent caret-white p-4 font-mono text-sm resize-none focus:outline-none absolute inset-0 top-12 z-10 opacity-50 focus:opacity-100 transition-opacity"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck="false"
                    />
                    <div className="absolute inset-0 top-12 z-0 p-4 bg-[#1e1e1e] overflow-hidden pointer-events-none">
                        <SyntaxHighlighter
                            language="python"
                            style={vscDarkPlus}
                            customStyle={{ margin: 0, padding: 0, background: 'transparent' }}
                            showLineNumbers={true}
                        >
                            {code || ' '}
                        </SyntaxHighlighter>
                    </div>
                </div>

                <div className="w-1/3 glass-panel flex flex-col">
                    <div className="h-12 border-b border-white/10 flex items-center gap-2 px-4 bg-slate-900/50">
                        <TerminalIcon size={16} className="text-lumina-text-secondary" />
                        <span className="text-sm font-bold text-white uppercase tracking-wider">Console Output</span>
                    </div>
                    <div className="flex-1 p-4 font-mono text-sm text-slate-300 whitespace-pre-wrap overflow-auto custom-scrollbar bg-slate-950/30">
                        {output || <span className="opacity-30 italic">// Output will appear here...</span>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sandbox;
