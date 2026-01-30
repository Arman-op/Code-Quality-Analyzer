import React from 'react';
import { useProject } from '../context/ProjectContext';
import { Activity, Zap, Code2 } from 'lucide-react';

const HealthScores = () => {
    const { projectData } = useProject();

    return (
        <div className="p-8 h-[calc(100vh-2rem)] overflow-y-auto custom-scrollbar animate-in fade-in">
            <h1 className="text-3xl font-bold text-white mb-6">System Health Metrics</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="glass-panel p-6">
                    <Activity size={32} className="text-lumina-accent-cyan mb-4" />
                    <h3 className="text-slate-400 text-sm uppercase font-bold">Global Health</h3>
                    <span className="text-4xl font-bold text-white">{projectData.global_health}%</span>
                </div>
                <div className="glass-panel p-6">
                    <Zap size={32} className="text-lumina-accent-blue mb-4" />
                    <h3 className="text-slate-400 text-sm uppercase font-bold">Maintainability</h3>
                    <span className="text-4xl font-bold text-white">{projectData.maintainability_score}%</span>
                </div>
                <div className="glass-panel p-6">
                    <Code2 size={32} className="text-lumina-accent-violet mb-4" />
                    <h3 className="text-slate-400 text-sm uppercase font-bold">Issues Open</h3>
                    <span className="text-4xl font-bold text-white">{projectData.issues_open}</span>
                </div>
            </div>

            <div className="glass-panel p-8">
                <h3 className="text-white font-bold mb-4">Historical Trend</h3>
                <div className="h-64 flex items-end gap-2 px-4 border-b border-l border-white/10">
                    {[40, 60, 45, 70, 65, 80, projectData.global_health].map((val, i) => (
                        <div key={i} className="flex-1 bg-lumina-accent-cyan/20 hover:bg-lumina-accent-cyan/40 transition-colors rounded-t" style={{ height: `${val}%` }}></div>
                    ))}
                </div>
                <p className="text-center text-xs text-slate-500 mt-2">Last 7 Scans</p>
            </div>
        </div>
    );
};

export default HealthScores;
