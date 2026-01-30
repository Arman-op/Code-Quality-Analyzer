import React, { useState } from 'react';
import { diffLines } from 'diff';
import { ArrowRight, Sparkles, Check, X, Code2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const sampleDiffs = {
    sqlInjection: {
        title: "Fix SQL Injection Vulnerability",
        description: "Replaced raw string concatenation with parameterized queries to prevent SQL injection attacks.",
        original: `String query = "SELECT * FROM users WHERE id = '" + userId + "'";
Statement stmt = connection.createStatement();
ResultSet rs = stmt.executeQuery(query);`,
        modified: `String query = "SELECT * FROM users WHERE id = ?";
PreparedStatement pstmt = connection.prepareStatement(query);
pstmt.setString(1, userId);
ResultSet rs = pstmt.executeQuery();`
    },
    godClass: {
        title: "Refactor God Class",
        description: "Extracted email logic into a separate EmailService class to improve cohesion.",
        original: `public class UserManager {
    public void register(User user) {
        db.save(user);
        // Email logic mixed in
        Properties props = new Properties();
        props.put("mail.smtp.host", "smtp.example.com");
        Session session = Session.getDefaultInstance(props);
        // ... sending email ...
    }
}`,
        modified: `public class UserManager {
    private EmailService emailService;

    public void register(User user) {
        db.save(user);
        emailService.sendWelcomeEmail(user);
    }
}`
    }
};

const Fixer = () => {
    const [activeFix, setActiveFix] = useState('sqlInjection');
    const [isApplying, setIsApplying] = useState(false);
    const [applied, setApplied] = useState(false);

    const context = sampleDiffs[activeFix];
    const diff = diffLines(context.original, context.modified);

    const handleApply = () => {
        setIsApplying(true);
        setTimeout(() => {
            setIsApplying(false);
            setApplied(true);
            setTimeout(() => setApplied(false), 3000);
        }, 2000);
    };

    return (
        <div className="p-8 h-[calc(100vh-2rem)] flex flex-col animate-in fade-in duration-700">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Sparkles className="text-lumina-accent-violet" />
                        AI Fixer
                    </h1>
                    <p className="text-lumina-text-secondary">Automated refactoring & security patching agent</p>
                </div>
            </div>

            <div className="flex-1 flex gap-6 min-h-0">
                {/* Left: Fix List */}
                <div className="w-80 glass-panel p-4 flex flex-col gap-3">
                    <h3 className="text-xs uppercase font-bold text-lumina-text-secondary mb-2 tracking-wider">Suggested Fixes</h3>
                    {Object.entries(sampleDiffs).map(([key, data]) => (
                        <div
                            key={key}
                            onClick={() => setActiveFix(key)}
                            className={cn(
                                "p-4 rounded-xl border cursor-pointer transition-all",
                                activeFix === key
                                    ? "bg-lumina-accent-violet/10 border-lumina-accent-violet/40 shadow-[0_0_15px_rgba(139,92,246,0.15)]"
                                    : "bg-slate-900/40 border-slate-800 hover:bg-white/5"
                            )}
                        >
                            <h4 className={cn("text-sm font-bold mb-1", activeFix === key ? "text-white" : "text-lumina-text-secondary")}>
                                {data.title}
                            </h4>
                            <p className="text-xs text-lumina-text-secondary line-clamp-2">{data.description}</p>
                        </div>
                    ))}
                </div>

                {/* Right: Diff View */}
                <div className="flex-1 glass-panel flex flex-col overflow-hidden">
                    <div className="h-14 border-b border-lumina-border flex items-center justify-between px-6 bg-slate-900/50">
                        <div className="flex gap-8 text-sm font-bold uppercase tracking-wider">
                            <span className="text-red-400">Original</span>
                            <span className="text-green-400">Refactored</span>
                        </div>

                        <button
                            onClick={handleApply}
                            disabled={isApplying}
                            className="bg-lumina-accent-violet text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-lumina-accent-violet/90 transition-all flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-lumina-accent-violet/20"
                        >
                            {isApplying ? <Sparkles size={16} className="animate-spin" /> : <Code2 size={16} />}
                            {isApplying ? 'Refactoring...' : 'Apply Fix'}
                        </button>
                    </div>

                    <div className="flex-1 overflow-auto bg-[#1e1e1e] p-6 font-mono text-sm">
                        {diff.map((part, index) => {
                            const color = part.added ? 'bg-green-900/30 text-green-100' : part.removed ? 'bg-red-900/30 text-red-100 opacity-60' : 'text-slate-400';
                            const preFix = part.added ? '+' : part.removed ? '-' : ' ';
                            if (part.removed && !part.value.trim()) return null; // Skip empty removals

                            return (
                                <div key={index} className={cn("flex", color)}>
                                    <div className="w-8 select-none opacity-30 text-right pr-4">{preFix}</div>
                                    <pre className="flex-1 whitespace-pre-wrap break-all font-mono">{part.value}</pre>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Success Notification Overlay */}
            {applied && (
                <div className="absolute top-10 right-10 glass-panel p-4 flex items-center gap-3 border-green-500/50 bg-green-900/20 text-green-400 animate-in slide-in-from-right fade-in">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500">
                        <Check size={14} />
                    </div>
                    <span className="font-bold">Refactoring Applied Successfully</span>
                </div>
            )}
        </div>
    );
};

export default Fixer;
