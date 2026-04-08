import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle2, TrendingUp, AlertOctagon } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const performanceData = [
  { name: 'Scan 1', health: 45 },
  { name: 'Scan 2', health: 52 },
  { name: 'Scan 3', health: 68 },
  { name: 'Scan 4', health: 81 },
  { name: 'Scan 5', health: 92 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

export default function MissionDebrief() {
  return (
    <div className="w-full relative py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold text-white mb-2">Mission Debrief</h2>
          <p className="font-space text-gz-cyan tracking-widest text-sm uppercase">End of Scan Report</p>
        </div>
        
        <button className="plasma-btn py-3 px-6 flex items-center gap-2 font-space text-sm" style={{ '--color-gz-cyan': '#BF00FF', '--color-gz-purple': '#FF6B00' }}>
          <Download className="w-4 h-4" />
          Eject Mission Log (PDF)
        </button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Executive Summary */}
        <motion.div variants={itemVariants} className="md:col-span-2 glass-panel p-6">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <FileText className="w-5 h-5 text-gz-cyan" />
            <h3 className="font-orbitron font-bold text-lg text-white">Executive Summary</h3>
          </div>
          <div className="h-48 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorHealth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00F5FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'Space Mono' }} />
                <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12, fontFamily: 'Space Mono' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,8,0.9)', borderColor: 'rgba(0,245,255,0.3)', borderRadius: '8px' }}
                  itemStyle={{ color: '#00F5FF', fontFamily: 'Orbitron' }}
                  labelStyle={{ color: 'white', fontFamily: 'Space Mono' }}
                />
                <Area type="monotone" dataKey="health" stroke="#00F5FF" fillOpacity={1} fill="url(#colorHealth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Critical Findings */}
        <motion.div variants={itemVariants} className="glass-panel p-6 border-t-4 border-t-[#FF0055]">
          <div className="flex items-center gap-3 mb-6">
            <AlertOctagon className="w-5 h-5 text-[#FF0055]" />
            <h3 className="font-orbitron font-bold text-lg text-white">Critical Findings</h3>
          </div>
          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF0055] mt-1.5 shrink-0 shadow-[0_0_8px_#FF0055]"></span>
              <div>
                <p className="font-exo font-bold text-white text-sm">AuthService SQL Injection</p>
                <p className="font-space text-xs text-gray-400 mt-1">High probability of data breach.</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] mt-1.5 shrink-0 shadow-[0_0_8px_#FF6B00]"></span>
              <div>
                <p className="font-exo font-bold text-white text-sm">Memory Leak in Parser</p>
                <p className="font-space text-xs text-gray-400 mt-1">Unmanaged references in loops.</p>
              </div>
            </li>
          </ul>
        </motion.div>

        {/* Refactor Wins */}
        <motion.div variants={itemVariants} className="glass-panel p-6 border-t-4 border-t-[#BF00FF]">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-gz-purple" />
            <h3 className="font-orbitron font-bold text-lg text-white">Refactor Wins</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
              <span className="font-space text-sm text-gray-300">God Classes Split</span>
              <span className="font-orbitron font-bold text-gz-purple">4</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
              <span className="font-space text-sm text-gray-300">Lines Removed</span>
              <span className="font-orbitron font-bold text-gz-purple">~1.2k</span>
            </div>
            <div className="flex justify-between items-center bg-white/5 p-3 rounded-lg border border-white/5">
              <span className="font-space text-sm text-gray-300">Perf Increase</span>
              <span className="font-orbitron font-bold text-gz-purple">+18%</span>
            </div>
          </div>
        </motion.div>

        {/* Next Steps */}
        <motion.div variants={itemVariants} className="md:col-span-2 glass-panel p-6 border-l-4 border-l-[#00F5FF]">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-5 h-5 text-gz-cyan" />
            <h3 className="font-orbitron font-bold text-lg text-white">Recommended Next Steps</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <p className="font-exo font-bold text-white mb-2">1. Apply Sandbox Fixes</p>
              <p className="font-space text-xs text-gray-400">Deploy the 3 approved refactors securely.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <p className="font-exo font-bold text-white mb-2">2. Re-Scan Sector 4</p>
              <p className="font-space text-xs text-gray-400">Validate memory leak patches.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
