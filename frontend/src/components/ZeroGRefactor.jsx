import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, CheckCircle } from 'lucide-react';

const beforeCode = `function authenticateUser(req) {
  let pw = req.body.password;
  let user = db.query("SELECT * FROM users WHERE pass = '" + pw + "'");
  if(user) {
    return true;
  }
  return false;
}`;

const afterCode = `async function authenticateUser(req) {
  try {
    const { password } = req.body;
    const user = await db.query(
      "SELECT * FROM users WHERE pass = $1", 
      [password]
    );
    return !!user;
  } catch (error) {
    logger.error('Auth error', error);
    return false;
  }
}`;

export default function ZeroGRefactor() {
  const [isApplying, setIsApplying] = useState(false);
  const [fixed, setFixed] = useState(false);

  const applyFix = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setFixed(true);
    }, 3000);
  };

  return (
    <div className="w-full max-w-6xl glass-panel p-6 md:p-10 relative mt-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-orbitron font-bold text-white flex items-center gap-3">
            <Wrench className="w-8 h-8 text-gz-purple" />
            Zero-G Refactor
          </h2>
          <p className="font-space text-gray-400 mt-2">Self-healing engine sandboxing...</p>
        </div>
        <div className="px-4 py-2 bg-gz-cyan/10 border border-gz-cyan/30 rounded-full flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-gz-cyan" />
          <span className="font-space text-sm text-gz-cyan font-bold">85% Auto-Refactor Success Rate</span>
        </div>
      </div>

      <div className="relative flex flex-col md:flex-row gap-6 mb-8">
        
        {/* Repair Beam Animation Layer */}
        {isApplying && (
          <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center">
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '100%', opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: 1 }}
              className="h-2 bg-gradient-to-r from-transparent via-gz-cyan to-transparent shadow-[0_0_20px_#00F5FF_inset,0_0_30px_#00F5FF]"
            ></motion.div>
          </div>
        )}

        {/* Before Code */}
        <div className="flex-1 rounded-xl overflow-hidden border border-[#FF0055]/30 relative group">
          <div className="absolute top-0 w-full h-8 bg-[#FF0055]/20 border-b border-[#FF0055]/30 flex items-center px-4 font-space text-xs text-[#FF0055]">
            AuthService.js - Critical Vulnerability Detected
          </div>
          <pre className="p-6 pt-12 bg-[#000008] text-sm md:text-base text-gray-300 font-space overflow-x-auto h-full">
            <code>
              {beforeCode.split('\n').map((line, i) => (
                <div key={i} className={i === 2 ? 'bg-[#FF0055]/20 text-white' : ''}>
                  <span className="opacity-30 mr-4 select-none">{i + 1}</span>
                  {line}
                </div>
              ))}
            </code>
          </pre>
        </div>

        {/* Divider / Action trigger */}
        <div className="hidden md:flex flex-col items-center justify-center px-2">
          <div className="w-1 h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
        </div>

        {/* After Code */}
        <div className="flex-1 rounded-xl overflow-hidden border border-[#00F5FF]/30 relative transition-all duration-1000">
          <div className="absolute top-0 w-full h-8 bg-[#00F5FF]/20 border-b border-[#00F5FF]/30 flex items-center px-4 font-space text-xs text-[#00F5FF]">
            Optimized Trajectory - Sandbox Test Passing
          </div>
          <pre className={`p-6 pt-12 bg-[#000008] text-sm md:text-base font-space overflow-x-auto h-full transition-all duration-1000 ${fixed ? 'text-gray-300' : 'text-gray-300 blur-sm opacity-50'}`}>
            <code>
              {afterCode.split('\n').map((line, i) => (
                <div key={i} className={(i > 0 && i < 11) && fixed ? 'bg-[#00F5FF]/10 text-white' : ''}>
                  <span className="opacity-30 mr-4 select-none">{i + 1}</span>
                  {line}
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        {!fixed ? (
          <button 
            onClick={applyFix} 
            disabled={isApplying}
            className={`plasma-btn px-10 py-4 text-xl cursor-pointer ${isApplying ? 'opacity-50' : ''}`}
            style={{ '--color-gz-cyan': '#00F5FF', '--color-gz-purple': '#00F5FF' }}
          >
            {isApplying ? 'Re-aligning Gravity...' : 'Apply Fix'}
          </button>
        ) : (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="px-8 py-3 bg-gz-cyan/20 border border-gz-cyan text-gz-cyan rounded-xl font-orbitron font-bold flex items-center gap-3"
          >
            <CheckCircle className="w-6 h-6" />
            Vulnerability Patched
          </motion.div>
        )}
      </div>
    </div>
  );
}
