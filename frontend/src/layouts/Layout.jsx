import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Code2, Activity, ShieldCheck, GitGraph, MessageSquare, Terminal, Sparkles } from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Code2, label: 'Code Analysis', path: '/analysis' },
        { icon: Activity, label: 'Health Scores', path: '/health' },
        { icon: ShieldCheck, label: 'Security', path: '/security' },
        { icon: GitGraph, label: 'Graph View', path: '/graph' },
        { icon: Terminal, label: 'Sandbox', path: '/sandbox' },
    ];

    return (
        <aside className="w-64 h-screen fixed left-0 top-0 glass-panel border-r-0 rounded-l-none rounded-r-2xl m-4 my-4 flex flex-col z-50">
            <div className="p-6 flex items-center gap-3 border-b border-lumina-border">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lumina-accent-cyan to-lumina-accent-blue flex items-center justify-center shadow-lg shadow-lumina-accent-cyan/20">
                    <span className="font-bold text-white text-lg">L</span>
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-lg tracking-tight text-white shadow-lumina-accent-cyan/50 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">LuminaCode</span>
                    <span className="text-[10px] text-lumina-accent-cyan uppercase tracking-widest font-semibold">Core Platform</span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                                isActive
                                    ? "bg-lumina-accent-cyan/10 text-lumina-accent-cyan shadow-[0_0_15px_rgba(6,182,212,0.2)] border border-lumina-accent-cyan/20"
                                    : "text-lumina-text-secondary hover:text-white hover:bg-white/5"
                            )
                        }
                    >
                        <item.icon size={20} className="transition-transform group-hover:scale-110" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-lumina-border">
                <div className="glass-panel p-4 flex items-center gap-3 bg-gradient-to-br from-lumina-bg to-slate-900/80">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
                    <div className="flex flex-col">
                        <span className="text-xs font-medium text-lumina-text-secondary">System Status</span>
                        <span className="text-xs font-bold text-green-400 tracking-wide">OPERATIONAL</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

import Chatbot from '../components/Chatbot';

const Layout = () => {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 ml-[18rem] mr-4 my-4 relative overflow-y-auto custom-scrollbar rounded-2xl">
                {/* Background ambient glows */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-lumina-accent-violet/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-lumina-accent-blue/10 rounded-full blur-[120px]" />
                </div>

                <Outlet />

                {/* Ask Lumina Chat Widget */}
                <Chatbot />
            </main>
        </div>
    );
};

export default Layout;
