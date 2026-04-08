import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldAlert, BugOff, Zap } from 'lucide-react';

const metrics = [
  { id: 1, label: 'Code Health', value: '92', type: 'Score', icon: Activity, color: '#00F5FF', delay: 0 },
  { id: 2, label: 'Vulnerabilities', value: '3', type: 'Critical', icon: ShieldAlert, color: '#FF0055', delay: 0.2 },
  { id: 3, label: 'Code Smells', value: '47', type: 'Detected', icon: BugOff, color: '#FF6B00', delay: 0.4 },
  { id: 4, label: 'Auto-Refactor', value: '85', type: '% Success', icon: Zap, color: '#BF00FF', delay: 0.6 }
];

export default function MetricsRing() {
  return (
    <div className="w-full flex justify-center items-center py-20">
      
      {/* Central orbital indicator */}
      <div className="relative w-80 h-80 md:w-[600px] md:h-[600px] flex items-center justify-center">
        
        {/* Orbital Rings */}
        <div className="absolute inset-0 border border-white/5 rounded-full ring-1 ring-white/5 animate-[spin_60s_linear_infinite]"></div>
        <div className="absolute inset-8 border border-white/10 rounded-full border-t-gz-cyan/30 animate-[spin_40s_linear_infinite_reverse]"></div>
        <div className="absolute inset-16 border border-white/10 rounded-full border-b-gz-purple/30 animate-[spin_20s_linear_infinite]"></div>
        <div className="absolute inset-24 border border-white/5 rounded-full border-dashed animate-[spin_30s_linear_infinite_reverse]"></div>

        <div className="z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-orbitron font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">STELLAR</h2>
          <p className="text-gz-cyan tracking-[0.3em] font-space text-sm md:text-base mt-2">METRICS</p>
        </div>

        {/* Orbiting Metric Nodes */}
        {metrics.map((metric, index) => {
          // Calculate positions in a circle
          const angle = (index / metrics.length) * Math.PI * 2 - Math.PI / 2; // start from top
          const radius = window.innerWidth < 768 ? 140 : 280;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          return (
            <motion.div
              key={metric.id}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: metric.delay, type: 'spring', stiffness: 100 }}
              className="absolute group z-20"
              style={{
                top: `calc(50% + ${y}px)`,
                left: `calc(50% + ${x}px)`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {/* The orb itself */}
              <div 
                className="w-16 h-16 md:w-24 md:h-24 rounded-full flex flex-col items-center justify-center text-white cursor-pointer relative overflow-hidden transition-all duration-300"
                style={{ 
                  backgroundColor: 'rgba(0,0,8,0.8)',
                  border: `2px solid ${metric.color}`,
                  boxShadow: `0 0 20px -5px ${metric.color}`
                }}
              >
                {/* Internal pulsing glow */}
                <div 
                  className="absolute inset-0 opacity-20 animate-pulse bg-current" 
                  style={{ color: metric.color }}
                ></div>
                
                <span className="font-orbitron font-bold text-xl md:text-3xl z-10">{metric.value}</span>
                <span className="font-space text-[10px] md:text-xs z-10 opacity-70">{metric.type}</span>
              </div>

              {/* Hover tooltip */}
              <div className="absolute top-1/2 -translate-y-1/2 left-[120%] opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 glass-panel px-4 py-2 pointer-events-none whitespace-nowrap min-w-max hidden md:flex items-center gap-2">
                <metric.icon className="w-4 h-4" style={{ color: metric.color }} />
                <span className="font-exo font-bold text-white text-sm">{metric.label}</span>
              </div>
            </motion.div>
          );
        })}

      </div>
    </div>
  );
}
