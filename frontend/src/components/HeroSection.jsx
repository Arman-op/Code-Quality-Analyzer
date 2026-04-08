import React from 'react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative w-full flex flex-col justify-center items-center text-center z-10 glass-panel crystal-glass p-12 md:p-24 rounded-3xl max-w-4xl mx-auto mt-20 animate-levitate shadow-2xl shadow-gz-purple/20">
      
      {/* Decorative Particles */}
      <div className="absolute top-0 left-1/4 w-2 h-2 bg-gz-cyan rounded-full animate-ping opacity-50"></div>
      <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-gz-orange rounded-full animate-pulse opacity-50"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
      >
        <h1 className="text-5xl md:text-7xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-gz-cyan via-white to-gz-purple mb-6 drop-shadow-[0_0_15px_rgba(0,245,255,0.8)]">
          LUMINACODE
        </h1>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="text-xl md:text-2xl font-exo text-gray-300 max-w-2xl mx-auto mb-12 tracking-wide font-light"
      >
        Your Code. Unshackled from Gravity. Experience code quality analysis in a reimagined cosmic void.
      </motion.p>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: 'spring', stiffness: 200 }}
      >
        <button className="plasma-btn flex items-center justify-center gap-3 text-lg group cursor-pointer">
          <Rocket className="w-6 h-6 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
          <span>Launch Analysis</span>
        </button>
      </motion.div>
    </div>
  );
}
