import React from 'react';
import { Activity, Shield, Zap, Bug, CheckCircle, Clock, GitGraph, ArrowUpRight, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useProject } from '../context/ProjectContext';

const MetricCard = ({ title, value, subtext, icon: Icon, color }) => (
    <div className="glass-panel p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
            <Icon size={80} />
        </div>
        <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-white/5 ${color}`}>
                    <Icon size={24} />
                </div>
                <h3 className="text-lumina-text-secondary font-medium tracking-wide text-sm uppercase">{title}</h3>
            </div>
            <div>
                <span className="text-4xl font-bold text-white tracking-tight">{value}</span>
                <p className="text-sm text-lumina-text-secondary mt-1 font-mono">{subtext}</p>
            </div>
        </div>
    </div>
);

const Gauge = ({ value, color, label }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center">
            <svg className="w-40 h-40 transform -rotate-90">
                <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-slate-800"
                />
                <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke={color}
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">{value}%</span>
                <span className="text-xs text-lumina-text-secondary uppercase tracking-wider mt-1">{label}</span>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { projectData, analysisResults, activeFilename } = useProject();

    if (!projectData) {
        return (
            <div className="p-8 h-[calc(100vh-2rem)] flex items-center justify-center">
                <Loader2 size={48} className="animate-spin text-lumina-accent-cyan" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Project Dashboard</h1>
                    <p className="text-lumina-text-secondary">Real-time overview of code quality and security metrics</p>
                </div>
                <div className="glass-panel px-4 py-2 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm font-mono text-green-400">System Online</span>
                </div>
            </div>

            {/* Top Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-8 flex items-center justify-center relative md:col-span-1">
                    <div className="text-center">
                        <h3 className="text-lumina-text-secondary uppercase text-sm font-semibold tracking-wider mb-6">Global Health Score</h3>
                        <Gauge value={projectData.global_health} color="#06b6d4" label="Excellent" />
                    </div>
                </div>

                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 flex flex-col items-center justify-center gap-4">
                        <div className="flex items-center gap-3">
                            <Shield size={20} className="text-lumina-accent-violet" />
                            <span className="text-lumina-text-secondary font-medium text-sm uppercase">Security Rating</span>
                        </div>
                        <Gauge value={projectData.security_score} color="#8b5cf6" label="Secure" />
                    </div>

                    <div className="glass-panel p-6 flex flex-col items-center justify-center gap-4">
                        <div className="flex items-center gap-3">
                            <Zap size={20} className="text-lumina-accent-blue" />
                            <span className="text-lumina-text-secondary font-medium text-sm uppercase">Maintainability</span>
                        </div>
                        <Gauge value={projectData.maintainability_score} color="#3b82f6" label="Good" />
                    </div>
                </div>
            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <MetricCard
                    title="Open Issues"
                    value={projectData.issues_open}
                    subtext="↗ 12% from yesterday"
                    icon={Bug}
                    color="text-yellow-400"
                />
                <MetricCard
                    title="Fixed (Today)"
                    value={projectData.issues_fixed}
                    subtext="↗ +5"
                    icon={CheckCircle}
                    color="text-green-400"
                />
                {/* New Time Complexity Logic */}
                <MetricCard
                    title="Time Complexity"
                    value={projectData.complexity || "O(1)"}
                    subtext="Est. Efficiency"
                    icon={Clock}
                    color="text-pink-500"
                />
                <MetricCard
                    title="Active Modules"
                    value="14"
                    subtext="Microservices"
                    icon={Activity}
                    color="text-lumina-accent-cyan"
                />
            </div>

            {/* Metrics Breakdown Pie Chart */}
            <div className="glass-panel p-1 border border-lumina-border overflow-hidden">
                <div className="bg-slate-900/50 p-4 border-b border-lumina-border flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="text-lumina-accent-cyan"><Activity size={18} /></div>
                        <span className="font-medium text-white text-sm">Metrics Breakdown</span>
                    </div>
                </div>
                <div className="h-64 w-full bg-slate-900/30 p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={[
                                    { name: 'Health', value: projectData.global_health, color: '#06b6d4' },
                                    { name: 'Security', value: projectData.security_score, color: '#8b5cf6' },
                                    { name: 'Maintainability', value: projectData.maintainability_score, color: '#3b82f6' },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                <Cell key="cell-0" fill="#06b6d4" />
                                <Cell key="cell-1" fill="#8b5cf6" />
                                <Cell key="cell-2" fill="#3b82f6" />
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend verticalAlign="middle" align="right" />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* AI Fixer Suggestions Preview */}
            <div className="glass-panel p-6">
                <div className="flex items-center gap-2 mb-6">
                    <Zap size={18} className="text-lumina-accent-violet" />
                    <h3 className="font-bold text-white">AI Fixer Suggestions</h3>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-lumina-accent-violet/50 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-lumina-accent-cyan font-mono text-xs">UserAuth.java</span>
                                <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded">High</span>
                            </div>
                            <p className="text-sm text-slate-300 group-hover:text-white transition-colors">Refactor huge method `validateSession` into smaller components.</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
