import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, TerminalSquare } from 'lucide-react';

export default function OrbitalIntelligence() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Orbital Intelligence online. How can I assist with your codebase trajectory?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    
    // Mock AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: 'Analyzing trajectory... The flagged Auth module contains a SQL injection vulnerability due to unparameterized queries. I recommend applying the Zero-G Refactor.' 
      }]);
    }, 1500);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-gz-cyan to-gz-purple shadow-[0_0_20px_#00F5FF] flex items-center justify-center text-white z-50 cursor-pointer overflow-hidden group"
          >
            {/* Spinning ring effect */}
            <div className="absolute inset-0 border-2 border-dashed border-white/50 rounded-full animate-[spin_4s_linear_infinite]"></div>
            <MessageSquare className="w-7 h-7 relative z-10 group-hover:scale-110 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] glass-panel z-50 flex flex-col border border-gz-cyan/30 shadow-[0_0_30px_rgba(0,245,255,0.15)] overflow-hidden"
          >
            {/* Header */}
            <div className="h-16 border-b border-gz-glass-border bg-black/40 flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gz-cyan/20 flex items-center justify-center text-gz-cyan">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-orbitron font-bold text-white text-sm">Orbital Intel</h3>
                  <div className="flex items-center gap-1 font-space text-[10px] text-gz-cyan">
                    <span className="w-1.5 h-1.5 rounded-full bg-gz-cyan animate-pulse"></span>
                    Response: {'<3s'} Warp Speed
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Health Card Embedded */}
            <div className="mx-4 mt-4 p-3 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <TerminalSquare className="w-4 h-4 text-gz-purple" />
                <span className="font-space text-xs">Overall Grade:</span>
              </div>
              <span className="font-orbitron font-bold text-gz-cyan text-sm">A - Neutron Star</span>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 design-scroll">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-xl font-exo text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-gz-purple/30 text-white rounded-br-none border border-gz-purple/30' 
                      : 'bg-black/40 text-gray-200 rounded-bl-none border border-white/10'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-gz-glass-border bg-black/20">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about your codebase..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-4 pr-12 py-2 text-sm text-white font-space focus:outline-none focus:border-gz-cyan focus:ring-1 focus:ring-gz-cyan transition-all"
                />
                <button 
                  type="submit"
                  disabled={!input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gz-cyan hover:text-white disabled:opacity-50 transition-colors p-1"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
