import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hello! I'm Lumina, your AI code assistant. How can I help you optimize your code today?", isBot: true }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = inputValue;
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setInputValue("");
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });

            const data = await response.json();

            setMessages(prev => [...prev, { text: data.response, isBot: true }]);
        } catch (error) {
            setMessages(prev => [...prev, { text: "I'm having trouble connecting to my neural core. Please try again later.", isBot: true }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
            {/* Chat Window */}
            {isOpen && (
                <div className="w-[350px] h-[500px] glass-panel flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.5)] border-lumina-accent-cyan/20 animate-in slide-in-from-bottom-5 fade-in duration-300">
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 flex justify-between items-center bg-slate-900/50 rounded-t-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-lumina-accent-cyan to-lumina-accent-blue flex items-center justify-center shadow-lg shadow-lumina-accent-cyan/20 relative overflow-hidden">
                                <Sparkles size={16} className="text-white relative z-10" />
                                <div className="absolute inset-0 bg-white/20 animate-pulse-slow" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Ask Lumina</h3>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] text-lumina-text-secondary uppercase tracking-wider font-medium">Online</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1.5 hover:bg-white/10 rounded-lg text-lumina-text-secondary hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={cn(
                                "flex gap-3 max-w-[85%]",
                                msg.isBot ? "self-start" : "self-end flex-row-reverse"
                            )}>
                                <div className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg border border-white/10",
                                    msg.isBot ? "bg-slate-800 text-lumina-accent-cyan" : "bg-lumina-accent-cyan text-white"
                                )}>
                                    {msg.isBot ? <Bot size={16} /> : <User size={16} />}
                                </div>
                                <div className={cn(
                                    "p-3 rounded-2xl text-sm leading-relaxed",
                                    msg.isBot
                                        ? "bg-slate-800/80 text-slate-200 rounded-tl-none border border-white/5"
                                        : "bg-lumina-accent-cyan/20 text-white rounded-tr-none border border-lumina-accent-cyan/20"
                                )}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 max-w-[85%]">
                                <div className="w-8 h-8 rounded-full bg-slate-800 text-lumina-accent-cyan flex items-center justify-center shrink-0 border border-white/10">
                                    <Bot size={16} />
                                </div>
                                <div className="bg-slate-800/80 p-3 rounded-2xl rounded-tl-none border border-white/5 flex items-center gap-2">
                                    <Loader2 size={16} className="animate-spin text-lumina-accent-cyan" />
                                    <span className="text-xs text-lumina-text-secondary animate-pulse">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-slate-900/30 rounded-b-2xl">
                        <div className="relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask about code quality..."
                                className="w-full bg-slate-950/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-lumina-accent-cyan/50 transition-colors placeholder:text-slate-600"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || isLoading}
                                className="absolute right-2 top-2 p-1.5 bg-lumina-accent-cyan hover:bg-lumina-accent-blue text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-lumina-accent-cyan/20"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-14 h-14 glass-panel rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-[0_0_30px_rgba(6,182,212,0.4)] border-lumina-accent-cyan/40 group bg-slate-900/80 backdrop-blur-md"
                >
                    <div className="absolute inset-0 rounded-full bg-lumina-accent-cyan/10 animate-ping opacity-20" />
                    <MessageSquare size={24} className="text-lumina-accent-cyan group-hover:text-white transition-colors relative z-10" />

                    {/* Tooltip */}
                    <div className="absolute right-full mr-4 bg-lumina-glass px-3 py-1.5 rounded-lg text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-lumina-accent-cyan/20 shadow-xl">
                        Ask Lumina
                    </div>
                </button>
            )}
        </div>
    );
};

export default Chatbot;
