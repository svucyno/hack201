'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-6 md:p-12 text-center relative overflow-hidden group">
      {/* Interactive Background Grid - Subtle Highlight Under Cursor */}
      <div className="absolute inset-0 gate-grid-bg opacity-[0.05] pointer-events-none" />
      <div 
        className="absolute w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-500/10 blur-[100px] md:blur-[150px] rounded-full pointer-events-none transition-all duration-300 ease-out hidden group-hover:block"
        style={{ left: mousePos.x - 150, top: mousePos.y - 150 }}
      />
      
      {/* Centered Content - Responsive Title Scaling */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-4xl px-4 animate-fade-in">
        <h1 
          className="text-7xl sm:text-9xl md:text-[12rem] lg:text-[14rem] font-black text-[#fafafa] tracking-tighter mb-12 md:mb-24 transition-transform duration-500 cursor-default leading-none shadow-2xl"
          style={{ 
             transform: `perspective(1000px) rotateX(${(mousePos.y / Math.max(1, window.innerHeight) - 0.5) * -10}deg) rotateY(${(mousePos.x / Math.max(1, window.innerWidth) - 0.5) * 10}deg)` 
          }}
        >
           QFlux
        </h1>

        {/* Responsive Button Group - Stacks on Mobile */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 w-full sm:w-auto px-4">
           <Link 
             href="/circuit" 
             className="w-full sm:w-auto px-8 md:px-14 py-4 md:py-4.5 bg-[#fafafa] border border-[#fafafa] text-[#000000] font-black text-[11px] md:text-[12px] uppercase tracking-[0.2em] rounded-md transition-all duration-300 hover:tracking-[0.4em] hover:scale-105 active:scale-95 shadow-2xl text-center"
           >
             Start Simulation
           </Link>

           <Link 
             href="/playground" 
             className="w-full sm:w-auto px-8 md:px-14 py-4 md:py-4.5 bg-transparent border border-[#27272a] text-[#71717a] font-black text-[11px] md:text-[12px] uppercase tracking-[0.25em] rounded-md transition-all duration-300 hover:border-[#fafafa] hover:text-[#fafafa] hover:scale-105 active:scale-95 shadow-lg text-center"
           >
             Python Lab
           </Link>
        </div>
      </div>

      {/* Responsive Footer - Hides on Small Screens or Repositions */}
      <div className="absolute bottom-6 md:bottom-12 flex flex-col md:flex-row items-center gap-6 md:gap-12 opacity-10 text-[8px] md:text-[9px] font-black uppercase tracking-[0.4em] text-[#71717a]">
         <div className="flex items-center gap-3">
            <div className="w-1 h-1 bg-[#27272a] rounded-sm" />
            <span>Core v2.1.0</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="w-1 h-1 bg-[#27272a] rounded-sm" />
            <span>State Optimized Engine</span>
         </div>
      </div>
    </main>
  );
}
