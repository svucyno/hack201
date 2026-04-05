'use client';

import React, { useState, useEffect } from 'react';
import useStore from '../../shared/store';
import { exportToQiskit } from '../../shared/exportToQiskit';
import Toolbar from '../../components/Toolbar';
import Editor from '@monaco-editor/react';
import { Play, Terminal, FileCode, CheckCircle2 } from 'lucide-react';

export default function PlaygroundPage() {
  const { gates, numQubits } = useStore();
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Generate code from the visual circuit on load
    const qiskitCode = exportToQiskit(numQubits, gates);
    setCode(qiskitCode);
  }, [numQubits, gates]);

  const runCode = async () => {
    setLoading(true);
    try {
      const resp = await fetch('http://localhost:8000/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await resp.json();
      if (data.error) {
        setOutput(`Error: ${data.error}`);
      } else {
        setOutput(data.output || 'Code executed successfully. No output returned.');
      }
    } catch (err) {
      setOutput(`Service Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col h-screen bg-slate-950 text-slate-50">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden lg:flex-row flex-col">
        {/* Editor Side */}
        <div className="flex-1 border-r border-slate-800 relative z-10 flex flex-col h-full bg-slate-950">
           <div className="flex items-center justify-between gap-4 p-4 bg-slate-900/50 border-b border-slate-800">
               <div className="flex gap-4 items-center">
                  <FileCode size={20} className="text-blue-500" />
                  <div>
                    <h2 className="text-sm font-black text-slate-100 tracking-tight uppercase">Qiskit Code Playground</h2>
                    <span className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase p-1 bg-slate-800/50 rounded-md border border-slate-700/30">Synced from visual circuit</span>
                  </div>
               </div>
               <button 
                 onClick={runCode}
                 disabled={loading}
                 className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-black rounded-xl transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50 ring-2 ring-blue-500/10 active:ring-blue-500/30 group"
               >
                 <Play size={16} fill="currentColor" className="group-hover:animate-pulse" />
                 {loading ? 'Executing Engine...' : 'Run Lab Execution'}
               </button>
           </div>
           
           <div className="flex-1 overflow-hidden p-2">
              <Editor
                height="100%"
                defaultLanguage="python"
                theme="vs-dark"
                value={code}
                onChange={(v) => setCode(v)}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  padding: { top: 20 },
                  lineNumbers: 'on',
                  cursorBlinking: 'smooth',
                  fontFamily: 'JetBrains Mono, Fira Code, monospace',
                  smoothScrolling: true,
                  scrollbar: { vertical: 'hidden', horizontal: 'hidden' }
                }}
              />
           </div>
        </div>

        {/* Output Console Side */}
        <div className="w-full lg:w-96 flex flex-col bg-slate-900 relative z-0 h-full border-t lg:border-t-0 p-8 shadow-2xl shadow-black/40">
           <div className="flex items-center gap-4 mb-8">
              <Terminal size={20} className="text-emerald-400" />
              <h3 className="text-sm font-black text-slate-100 font-mono tracking-widest uppercase flex-1 border-b border-slate-800 pb-2">Execution Console</h3>
           </div>
           
           <div className="flex-1 bg-slate-950/80 p-8 rounded-3xl border border-slate-800 font-mono text-sm overflow-auto text-emerald-400 custom-scrollbar shadow-inner shadow-black/30 group-hover:border-slate-700 transition-all">
              {output ? (
                 <pre className="whitespace-pre-wrap leading-relaxed animate-in fade-in slide-in-from-bottom-2 duration-500">{output}</pre>
              ) : (
                 <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-700 opacity-50">
                    <CheckCircle2 size={32} className="stroke-slate-800" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Waiting for execution...</span>
                 </div>
              )}
           </div>
           
           <div className="mt-8 p-6 bg-slate-950/40 rounded-2xl border border-slate-800/30 text-[10px] text-slate-500 italic leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
              Output is captured directly from the AerSimulator running in your local QFlux Python engine.
           </div>
        </div>
      </div>
    </main>
  );
}
