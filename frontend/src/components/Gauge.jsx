import React from 'react';

const Gauge = ({ value = 0, label, color = "#06b6d4", size = 200 }) => {
    const strokeWidth = 15;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = Math.min(Math.max(value, 0), 100);
    const offset = circumference - (progress / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90 drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]"
            >
                {/* Background Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(148, 163, 184, 0.1)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
                {/* Progress Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-white tracking-tighter drop-shadow-lg">{value}%</span>
                {label && <span className="text-xs uppercase tracking-widest text-lumina-text-secondary mt-1">{label}</span>}
            </div>
        </div>
    );
};

export default Gauge;
