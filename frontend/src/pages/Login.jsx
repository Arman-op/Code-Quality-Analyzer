import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, ScanLine, ArrowRight, Fingerprint } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate auth delay for effect
        setTimeout(() => {
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-slate-950">
                <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-lumina-accent-cyan/10 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-lumina-accent-violet/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Login Card */}
            <div className="w-full max-w-md p-8 glass-panel relative z-10 mx-4 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {/* Decorator Line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-lumina-accent-cyan to-transparent opacity-50" />
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-lumina-accent-violet to-transparent opacity-50" />

                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-lumina-accent-cyan/20 to-lumina-accent-blue/20 border border-lumina-accent-cyan/30 flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-lumina-accent-cyan/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <ShieldCheck size={32} className="text-lumina-accent-cyan relative z-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight mb-2 text-shadow-glow">LuminaCode<span className="text-lumina-accent-cyan">Core</span></h1>
                    <p className="text-lumina-text-secondary text-sm font-mono tracking-wide">SECURE ACCESS TERMINAL</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-lumina-accent-cyan uppercase tracking-wider ml-1">Identity Token</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-lumina-text-secondary group-focus-within:text-lumina-accent-cyan transition-colors">
                                <Fingerprint size={18} />
                            </div>
                            <input
                                type="email"
                                placeholder="analyst@luminacode.ai"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-lumina-accent-cyan/50 focus:ring-1 focus:ring-lumina-accent-cyan/50 transition-all shadow-inner"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-lumina-accent-cyan uppercase tracking-wider ml-1">Access Key</label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-lumina-text-secondary group-focus-within:text-lumina-accent-cyan transition-colors">
                                <Lock size={18} />
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-lumina-accent-cyan/50 focus:ring-1 focus:ring-lumina-accent-cyan/50 transition-all shadow-inner"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full group relative overflow-hidden rounded-lg bg-gradient-to-r from-lumina-accent-blue/80 to-lumina-accent-cyan/80 p-px font-semibold text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        <div className="relative h-full w-full rounded-md bg-slate-900/40 px-4 py-3 transition-colors group-hover:bg-transparent flex items-center justify-center gap-2">
                            {isLoading ? (
                                <>
                                    <ScanLine className="animate-spin" size={18} />
                                    <span>AUTHENTICATING...</span>
                                </>
                            ) : (
                                <>
                                    <span>INITIALIZE SESSION</span>
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </div>
                    </button>
                </form>

                <div className="mt-8 flex justify-between items-center text-xs text-lumina-text-secondary/60 font-mono">
                    <span>v2.4.0-RC1</span>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span>SYSTEM ONLINE</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
