'use client';

import React, { useState, useEffect } from 'react';
import useStore from '../../shared/store';
import { exportToQiskit } from '../../shared/exportToQiskit';
import Toolbar from '../../components/Toolbar';
import Editor from '@monaco-editor/react';
import { Play, Terminal, FileCode } from 'lucide-react';

export default function PlaygroundPage() {
  const { gates, numQubits } = useStore();
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
    <main className="flex flex-col h-screen bg-[#0d1117] text-[#c9d1d9] overflow-hidden">
      <Toolbar />
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Editor Side */}
        <div className="flex-1 border-r border-[#30363d] flex flex-col bg-[#0d1117]">
           <div className="flex items-center justify-between px-4 h-12 bg-[#010409] border-b border-[#30363d] shrink-0">
               <div className="flex gap-2 sm:gap-3 items-center">
                  <FileCode size={16} className="text-[#2f81f7]" />
                  <h2 className="text-[10px] sm:text-xs font-bold text-[#c9d1d9] uppercase tracking-tighter">Qiskit Code Editor</h2>
               </div>
               <button 
                 onClick={runCode}
                 disabled={loading}
                 className="flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white text-[10px] sm:text-xs font-bold rounded-md transition-all active:scale-95 disabled:opacity-50"
               >
                 <Play size={14} fill="currentColor" stroke="none" />
                 {loading ? 'Running...' : 'Run Script'}
               </button>
           </div>
           
           <div className="flex-1 overflow-hidden p-0">
              <Editor
                height="100%"
                defaultLanguage="python"
                theme="vs-dark"
                value={code}
                onChange={(v) => setCode(v)}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  padding: { top: 12 },
                  lineNumbers: 'on',
                  cursorBlinking: 'smooth',
                  fontFamily: 'JetBrains Mono, Menlo, monospace',
                  backgroundColor: '#0d1117',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
           </div>
        </div>

        {/* Output Console Side - Stacks below editor on mobile */}
        <div className="h-48 sm:h-64 lg:h-full lg:w-96 flex flex-col bg-[#010409] shadow-2xl border-t lg:border-t-0 border-[#30363d] shrink-0">
           <div className="flex items-center gap-3 px-4 h-10 bg-[#0d1117] border-b border-[#30363d] shrink-0">
              <Terminal size={14} className="text-[#8b949e]" />
              <h3 className="text-[10px] font-bold text-[#8b949e] uppercase tracking-widest text-center">Output</h3>
           </div>
           
           <div className="flex-1 p-4 sm:p-6 font-mono text-[10px] sm:text-[11px] overflow-auto text-[#7ee787] custom-scrollbar bg-[#0d1117]/50">
              {output ? (
                 <pre className="whitespace-pre-wrap leading-relaxed animate-fade-in">{output}</pre>
              ) : (
                 <div className="flex flex-col items-center justify-center h-full gap-2 text-[#484f58]">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Console Ready</span>
                 </div>
              )}
           </div>
        </div>
      </div>
    </main>
  );
}
