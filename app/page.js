'use client';

import React from 'react';
import Link from 'next/link';
import { Play, Code } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
      {/* Background Grid Pattern - Subtle */}
      <div className="absolute inset-0 gate-grid-bg opacity-[0.05] pointer-events-none" />
      
      {/* Centered Content */}
      <div className="relative z-10 flex flex-col items-center max-w-4xl px-4 animate-fade-in">
        <h1 className="text-9xl font-black text-[#fafafa] tracking-tighter mb-8 shadow-2xl transition-transform hover:scale-[1.02] cursor-default">
           QFlux
        </h1>
        
        <p className="text-[#a1a1aa] text-lg font-medium mb-16 max-w-xl leading-relaxed tracking-tight opacity-70">
           The professional-grade quantum designer. 
           Synthesize, simulate, and analyze circuits with unmatched precision.
        </p>

        {/* Minimalist Rich Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-6">
           <Link 
             href="/circuit" 
             className="px-12 py-4 bg-[#fafafa] border border-[#fafafa] text-[#000000] font-black text-[12px] uppercase tracking-[0.2em] rounded-md transition-all hover:bg-transparent hover:text-[#fafafa] active:scale-95 shadow-2xl"
           >
             Start Simulation
           </Link>

           <Link 
             href="/playground" 
             className="px-12 py-4 bg-transparent border border-[#27272a] text-[#71717a] font-black text-[12px] uppercase tracking-[0.2em] rounded-md transition-all hover:bg-[#18181b] hover:text-[#fafafa] active:scale-95 shadow-lg"
           >
             Open Code Playground
           </Link>
        </div>
      </div>

      {/* Footer Minimal Status */}
      <div className="absolute bottom-12 flex items-center gap-8 opacity-20 text-[9px] font-black uppercase tracking-[0.3em] text-[#71717a]">
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#27272a] rounded-sm" />
            <span>Core v2.1.0</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#27272a] rounded-sm" />
            <span>Aer SDK Node</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#27272a] rounded-sm" />
            <span>State-Space Optimized</span>
         </div>
      </div>
    </main>
  );
}
