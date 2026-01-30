import React, { useState, useEffect, useRef } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertTriangle, Bug, Code, FileCode, CheckCircle, Loader2, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useProject } from '../context/ProjectContext';

const Analysis = () => {
    const {
        runAnalysis,
        analysisResults,
        isAnalyzing,
        files,
        activeFilename,
        setActiveFilename,
        addFile,
        removeFile
    } = useProject();

    const [snippetCode, setSnippetCode] = useState('');
    const [snippetLang, setSnippetLang] = useState('text');
    const fileInputRef = useRef(null);
    const [showFix, setShowFix] = useState(null);

    // Sync local editor state when active file changes
    useEffect(() => {
        if (activeFilename && files[activeFilename]) {
            const file = files[activeFilename];
            setSnippetCode(file.code);
            setSnippetLang(file.language);
            setShowFix(null);
        } else if (!activeFilename) {
            setSnippetCode("// No file selected. Upload or select a file.");
            setSnippetLang("text");
        }
    }, [activeFilename, files]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = event.target.result;

            // Extension detection
            const ext = file.name.split('.').pop();
            const langMap = {
                'js': 'javascript', 'jsx': 'javascript', 'ts': 'typescript', 'tsx': 'typescript',
                'py': 'python', 'java': 'java', 'cpp': 'cpp', 'c': 'c', 'html': 'html', 'css': 'css'
            };

            const newFile = {
                filename: file.name,
                language: langMap[ext] || 'javascript',
                code: content
            };

            addFile(newFile);
            // Reset input
            e.target.value = null;
        };
        reader.readAsText(file);
    };

    const handleRescan = () => {
        setShowFix(null);
        if (activeFilename) {
            runAnalysis(snippetCode, activeFilename);
        }
    };

    return (
        <div className="p-8 h-[calc(100vh-2rem)] flex flex-col animate-in fade-in duration-700">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".java,.py,.js,.jsx,.ts,.tsx,.cpp,.c,.html,.css,.json"
            />

            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Code Analysis</h1>
                    <p className="text-lumina-text-secondary">Multi-language static analysis & security verification</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleUploadClick}
                        className="glass-btn flex items-center gap-2"
                    >
                        <FileCode size={16} />
                        <span>Upload File</span>
                    </button>
                    <button
                        className="glass-btn-primary flex items-center gap-2"
                        onClick={handleRescan}
                        disabled={isAnalyzing || !activeFilename}
                    >
                        {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <Code size={16} />}
                        <span>Rescan</span>
                    </button>
                </div>
            </div>

            <div className="flex-1 flex gap-6 min-h-0">

                {/* Left Panel: File List */}
                <div className="w-64 glass-panel p-4 flex flex-col gap-2">
                    <h3 className="text-xs uppercase font-bold text-lumina-text-secondary mb-2 tracking-wider">Active Files</h3>
                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2">
                        {Object.values(files).map((file) => (
                            <div
                                key={file.filename}
                                onClick={() => setActiveFilename(file.filename)}
                                className={cn(
                                    "p-3 rounded-lg flex items-center justify-between cursor-pointer transition-all border border-transparent group",
                                    activeFilename === file.filename
                                        ? "bg-lumina-accent-cyan/10 border-lumina-accent-cyan/30 text-white shadow-[0_0_10px_rgba(6,182,212,0.1)]"
                                        : "hover:bg-white/5 text-lumina-text-secondary"
                                )}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <Code size={18} className={activeFilename === file.filename ? "text-lumina-accent-cyan" : ""} />
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-medium truncate">{file.filename}</span>
                                        <span className="text-[10px] opacity-60 uppercase">{file.language}</span>
                                    </div>
                                </div>
                                <button
                                    className="p-1 opacity-0 group-hover:opacity-100 hover:text-red-400 transition-all"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeFile(file.filename);
                                    }}
                                    title="Delete File"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="mt-auto p-4 bg-slate-900/50 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle size={16} className="text-green-500" />
                            <span className="text-xs font-bold text-white">Analysis Status</span>
                        </div>
                        <p className="text-xs text-lumina-text-secondary">
                            {isAnalyzing ? "Scanning..." : `Found ${analysisResults?.smells?.length || 0} issues in current file.`}
                        </p>
                    </div>
                </div>

                {/* Center Panel: Code Editor View */}
                <div className="flex-1 glass-panel flex flex-col overflow-hidden relative border-lumina-accent-cyan/20 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
                    <div className="h-10 bg-slate-900/80 border-b border-lumina-border flex items-center px-4 justify-between">
                        <span className="text-xs font-mono text-lumina-text-secondary">{activeFilename || "No File"}</span>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                        </div>
                    </div>
                    {/* Make textarea editable for "Rescan" to make sense */}
                    <div className="flex-1 relative overflow-auto custom-scrollbar bg-[#1e1e1e]">
                        <textarea
                            className="absolute inset-0 w-full h-full bg-transparent text-transparent caret-white p-6 font-mono text-[14px] leading-relaxed resize-none focus:outline-none z-10"
                            value={snippetCode}
                            onChange={(e) => setSnippetCode(e.target.value)}
                            spellCheck="false"
                            disabled={!activeFilename}
                        />
                        <div className="absolute inset-0 w-full h-full pointer-events-none">
                            <SyntaxHighlighter
                                language={snippetLang}
                                style={vscDarkPlus}
                                customStyle={{ margin: 0, padding: '1.5rem', background: 'transparent' }}
                                showLineNumbers={true}
                                lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: '#64748b' }}
                            >
                                {snippetCode}
                            </SyntaxHighlighter>
                        </div>

                        {/* Scanning overlay */}
                        {isAnalyzing && (
                            <div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-20">
                                <div className="flex flex-col items-center gap-2 text-lumina-accent-cyan">
                                    <Loader2 size={32} className="animate-spin" />
                                    <span className="text-sm font-mono tracking-widest uppercase">Analyzing Codebase...</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel: Detected Issues */}
                <div className="w-80 glass-panel p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm uppercase font-bold text-white flex items-center gap-2">
                            <AlertTriangle size={16} className="text-lumina-accent-violet" />
                            Detected Issues
                        </h3>
                        {analysisResults && (
                            <span className="text-xs font-mono text-pink-400 border border-pink-500/30 bg-pink-500/10 px-2 py-0.5 rounded">
                                {analysisResults.complexity}
                            </span>
                        )}
                    </div>

                    <div className="space-y-4 overflow-y-auto custom-scrollbar pr-2">
                        {!isAnalyzing && analysisResults?.smells?.map((smell, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-lumina-accent-violet/50 transition-colors group animate-in slide-in-from-right-4 fade-in duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                <div className="flex justify-between items-start mb-2">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                                        smell.severity === 'critical' ? "bg-red-500/10 text-red-400 border-red-500/30" :
                                            smell.severity === 'high' ? "bg-orange-500/10 text-orange-400 border-orange-500/30" :
                                                "bg-blue-500/10 text-blue-400 border-blue-500/30"
                                    )}>
                                        {smell.severity}
                                    </span>
                                    <Bug size={14} className="text-lumina-text-secondary group-hover:text-white transition-colors" />
                                </div>
                                <h4 className="text-sm font-bold text-white mb-1">{smell.name}</h4>
                                <p className="text-xs text-lumina-text-secondary mb-3">{smell.description}</p>

                                {showFix === idx ? (
                                    <div className="mt-2 p-2 bg-green-500/10 border border-green-500/20 rounded animate-in fade-in zoom-in-95">
                                        <div className="flex items-center gap-1 mb-1">
                                            <CheckCircle size={12} className="text-green-500" />
                                            <span className="text-xs font-bold text-green-400">Suggestion</span>
                                        </div>
                                        <p className="text-[10px] text-slate-300">
                                            {smell.name === 'God Class' ? "Extract 'Email', 'Logger' into separate services." :
                                                smell.name === 'Hardcoded Secret' ? "Use Environment Variables (e.g. process.env.KEY)." :
                                                    smell.name === 'SQL Injection' ? "Use parameterized queries (PreparedStatements)." :
                                                        "Refactor logic to reduce complexity."}
                                        </p>
                                        <button className="mt-2 text-[10px] text-lumina-text-secondary hover:text-white" onClick={() => setShowFix(null)}>Close</button>
                                    </div>
                                ) : (
                                    <button
                                        className="w-full py-1.5 rounded bg-lumina-accent-violet/10 text-lumina-accent-violet text-xs font-medium hover:bg-lumina-accent-violet/20 transition-colors border border-lumina-accent-violet/20 cursor-pointer"
                                        onClick={() => setShowFix(idx)}
                                    >
                                        View Suggestion
                                    </button>
                                )}
                            </div>
                        ))}

                        {!isAnalyzing && (!analysisResults || analysisResults?.smells?.length === 0) && (
                            <div className="text-center py-10 opacity-50">
                                <CheckCircle size={32} className="mx-auto mb-2 text-green-500" />
                                <span className="text-sm">No issues detected</span>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Analysis;
