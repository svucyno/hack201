'use client';

import React, { useState, useEffect } from 'react';
import useStore from '../../shared/store';
import { exportToQiskit } from '../../shared/exportToQiskit';
import Toolbar from '../../components/Toolbar';
import Editor from '@monaco-editor/react';
import { 
  Play, 
  Terminal, 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  RotateCcw, 
  Trash2, 
  Sparkles,
  Cpu
} from 'lucide-react';
import { API_BASE_URL } from '../../shared/api';

export default function PlaygroundPage() {
  const { gates, numQubits } = useStore();
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [execTime, setExecTime] = useState(null);

  useEffect(() => {
    const qiskitCode = exportToQiskit(numQubits, gates);
    setCode(qiskitCode);
  }, [numQubits, gates]);

  const runCode = async () => {
    setLoading(true);
    const startTime = performance.now();
    try {
      const resp = await fetch(`${API_BASE_URL}/code/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const data = await resp.json();
      const endTime = performance.now();
      setExecTime((endTime - startTime).toFixed(1));

      if (data.error) {
        setOutput(`[ERROR] ${data.error}`);
      } else {
        setOutput(data.output || 'Code executed cleanly. (No stdout output)');
      }
    } catch (err) {
      setOutput(`[SERVICE ERROR] Could not reach backend: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPy = () => {
    const blob = new Blob([code], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qflux_circuit_${numQubits}q.py`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetToCircuit = () => {
    const qiskitCode = exportToQiskit(numQubits, gates);
    setCode(qiskitCode);
  };

  return (
    <main className="flex flex-col h-screen bg-[#030712] text-slate-100 overflow-hidden">
      <Toolbar />
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Monaco Python Code Editor Side */}
        <div className="flex-1 border-r border-white/10 flex flex-col bg-[#060b18]">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 h-14 bg-slate-950/90 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400">
                <FileCode size={16} />
              </div>
              <div>
                <h2 className="text-xs font-mono font-black text-white uppercase tracking-wider">
                  Qiskit Python Script
                </h2>
                <span className="text-[10px] font-mono text-slate-400">Auto-transpiled from circuit canvas</span>
              </div>
            </div>

            {/* Actions: Copy, Download, Reset, Run */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleResetToCircuit}
                className="p-2 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl transition-all border border-transparent hover:border-white/10"
                title="Reset to current circuit"
              >
                <RotateCcw size={14} />
              </button>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-xs font-mono text-slate-300 hover:text-white transition-all"
                title="Copy Script"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownloadPy}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-xs font-mono text-slate-300 hover:text-white transition-all"
                title="Download .py"
              >
                <Download size={14} />
                <span className="hidden sm:inline">Export .py</span>
              </button>

              <button 
                onClick={runCode}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-mono font-black uppercase tracking-wider rounded-xl transition-all active:scale-95 disabled:opacity-50 shadow-lg glow-emerald"
              >
                <Play size={14} fill="currentColor" stroke="none" />
                <span>{loading ? 'Executing...' : 'Run Script'}</span>
              </button>
            </div>
          </div>
          
          {/* Monaco Editor Container */}
          <div className="flex-1 overflow-hidden p-0">
            <Editor
              height="100%"
              defaultLanguage="python"
              theme="vs-dark"
              value={code}
              onChange={(v) => setCode(v || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                padding: { top: 16, bottom: 16 },
                lineNumbers: 'on',
                cursorBlinking: 'smooth',
                fontFamily: 'JetBrains Mono, Menlo, monospace',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                renderLineHighlight: 'all',
              }}
            />
          </div>
        </div>

        {/* Python Stdout Terminal Console Side */}
        <div className="h-64 sm:h-72 lg:h-full lg:w-[420px] xl:w-[460px] flex flex-col bg-slate-950 border-t lg:border-t-0 border-white/10 shrink-0">
          {/* Console Header */}
          <div className="flex items-center justify-between px-5 h-14 bg-slate-950 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2.5">
              <Terminal size={16} className="text-cyan-400" />
              <h3 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
                Execution Terminal
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {execTime && (
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-white/5">
                  {execTime}ms
                </span>
              )}
              {output && (
                <button
                  onClick={() => setOutput('')}
                  className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
                  title="Clear Console"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
          
          {/* Terminal Output Body */}
          <div className="flex-1 p-5 font-mono text-xs overflow-auto text-emerald-400 custom-scrollbar bg-[#02050e] leading-relaxed select-text">
            {output ? (
              <pre className="whitespace-pre-wrap font-mono animate-fade-in text-slate-200">
                {output.startsWith('[ERROR]') ? (
                  <span className="text-rose-400">{output}</span>
                ) : (
                  <span className="text-emerald-300">{output}</span>
                )}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-600">
                <Terminal size={28} className="opacity-40 mb-1" />
                <span className="text-xs uppercase font-mono font-bold tracking-widest text-slate-500">
                  Terminal Ready
                </span>
                <p className="text-[10px] text-slate-600 max-w-xs text-center font-mono">
                  Click 'Run Script' above to execute Qiskit code on AerSimulator engine.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
