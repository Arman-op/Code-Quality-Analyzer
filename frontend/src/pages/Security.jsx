import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Shield, Lock, AlertTriangle, CheckCircle } from 'lucide-react';

const Security = () => {
    const { projectData, analysisResults } = useProject();
    const smells = analysisResults?.smells?.filter(s => s.type === "Security") || [];

    return (
        <div className="p-8 h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar animate-in fade-in">
            <h1 className="text-3xl font-bold text-white mb-6">Security Audit & Vulnerabilities</h1>

            <div className="glass-panel p-6 mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white">Security Score</h2>
                    <p className="text-lumina-text-secondary">Based on automated static analysis</p>
                </div>
                <div className="text-4xl font-bold text-lumina-accent-violet">{projectData.security_score}/100</div>
            </div>

            <div className="space-y-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <AlertTriangle size={20} className="text-yellow-500" />
                    Identified Vulnerabilities
                </h3>

                {smells.length === 0 ? (
                    <div className="glass-panel p-8 flex flex-col items-center justify-center opacity-70">
                        <CheckCircle size={48} className="text-green-500 mb-4" />
                        <p className="text-white">No security vulnerabilities detected in current scan.</p>
                    </div>
                ) : (
                    smells.map((issue, idx) => (
                        <div key={idx} className="glass-panel p-6 border-l-4 border-l-red-500 flex gap-4">
                            <div className="p-3 bg-red-500/10 rounded-lg h-fit">
                                <Lock size={24} className="text-red-500" />
                            </div>
                            <div>
                                <h4 className="text-lg font-bold text-white mb-1">{issue.name}</h4>
                                <p className="text-slate-300 mb-2">{issue.description}</p>
                                <span className="text-xs uppercase font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded">Critical Severity</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Security;
