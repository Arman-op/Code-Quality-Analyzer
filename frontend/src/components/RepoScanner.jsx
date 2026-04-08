import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, FolderUp, ScanLine, Code2 } from 'lucide-react';

export default function RepoScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState('');

  const startScan = (e) => {
    e.preventDefault();
    setIsScanning(true);
    
    // Mock scan progress
    const steps = [
      "Entering Orbit...",
      "Initialize Gravity Well Detector...",
      "Analyzing Code Structure...",
      "Detecting Anomalies...",
      "Generating Report..."
    ];
    
    steps.forEach((_, index) => {
      setTimeout(() => {
        setScanStep(index);
        if (index === steps.length - 1) {
          setTimeout(() => setIsScanning(false), 2000);
        }
      }, index * 1000 + 500);
    });
  };

  return (
    <div className="w-full max-w-3xl glass-panel p-8 md:p-12 relative shadow-gz-cyan/10 shadow-2xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gz-cyan/20 blur-[100px] rounded-full pointer-events-none"></div>
      
      <div className="flex items-center gap-4 mb-8 text-gz-cyan">
        <ScanLine className="w-8 h-8" />
        <h2 className="text-2xl font-orbitron font-bold text-white">Gravity Well Detector</h2>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <span className="px-3 py-1 text-xs font-space rounded-full border border-gz-purple/50 bg-gz-purple/20 text-white shadow-[0_0_10px_rgba(191,0,255,0.4)]">Python</span>
        <span className="px-3 py-1 text-xs font-space rounded-full border border-[#f8981d]/50 bg-[#f8981d]/20 text-white shadow-[0_0_10px_rgba(248,152,29,0.4)]">Java</span>
        <span className="px-3 py-1 text-xs font-space rounded-full border border-[#00599C]/50 bg-[#00599C]/20 text-white shadow-[0_0_10px_rgba(0,89,156,0.4)]">C++</span>
      </div>

      <form onSubmit={startScan} className="space-y-6 relative border border-white/5 rounded-xl p-6 bg-black/40">
        
        {/* Glow behind form */}
        <div className="absolute inset-0 bg-gradient-to-r from-gz-cyan/5 to-gz-purple/5 pointer-events-none rounded-xl"></div>
        
        {isScanning && (
          <div className="absolute inset-0 z-20 rounded-xl overflow-hidden pointer-events-none border border-gz-cyan/50">
            <div className="absolute left-0 w-full h-[2px] bg-gz-cyan shadow-[0_0_15px_#00F5FF,0_0_30px_#00F5FF] animate-scan"></div>
            <div className="absolute inset-0 bg-gz-cyan/5 backdrop-blur-sm flex flex-col items-center justify-center">
               <motion.div
                 key={scanStep}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="font-space text-lg text-gz-cyan font-bold tracking-widest text-center"
               >
                 {["Entering Orbit...", "Initialize Gravity Well Detector...", "Analyzing Structure...", "Detecting Anomalies...", "Generating Report..."][scanStep]}
               </motion.div>
            </div>
          </div>
        )}

        <div className="relative z-10 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gz-cyan transition-colors">
              <Github className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              placeholder="Paste GitHub Repository URL..." 
              className="gravity-input pl-12"
              disabled={isScanning}
            />
          </div>
          
          <div className="flex items-center text-gray-500 font-exo font-bold text-sm">OR</div>
          
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={(e) => setFileName(e.target.files[0]?.name || '')} 
          />
          <button 
            type="button" 
            disabled={isScanning} 
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 border border-white/10 hover:border-gz-purple hover:bg-gz-purple/10 rounded-xl flex items-center justify-center gap-2 text-white font-space transition-all cursor-pointer truncate max-w-[200px]"
            title={fileName || "Upload File"}
          >
            <FolderUp className="w-5 h-5 shrink-0" />
            <span className="truncate">{fileName || "Upload File"}</span>
          </button>
        </div>

        <div className="flex justify-end relative z-10 mt-6">
          <button type="submit" disabled={isScanning} className="plasma-btn cursor-pointer py-2 px-8 flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            Engage Scanner
          </button>
        </div>
      </form>
    </div>
  );
}
