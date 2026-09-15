import React, { useState } from 'react';
import { MONOREPO_FILES, FileCodeSnippet } from '../data/monorepoFiles';
import { 
  FolderTree, 
  FileCode, 
  Copy, 
  Check, 
  Terminal, 
  Download, 
  Layers, 
  Cpu, 
  FileText,
  ExternalLink
} from 'lucide-react';

export const CodebaseExplorerView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<FileCodeSnippet>(MONOREPO_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All', 
    'Root Config', 
    'Experience Plane', 
    'Workflow Plane', 
    'Agent Control Plane', 
    'Knowledge Plane', 
    'Tool Integration Plane', 
    'Governance Plane', 
    'Shared Core', 
    'Infrastructure', 
    'Tests & CI/CD'
  ];

  const filteredFiles = activeCategory === 'All' 
    ? MONOREPO_FILES 
    : MONOREPO_FILES.filter(f => f.category === activeCategory);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <FolderTree className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-white">6-Plane Monorepo & Mac M2 Quickstart</h2>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/40">
                light-weight-agentic-engineering/
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Production-ready 6-plane project structure, Docker compose stack for Apple Silicon, FastAPI services, Temporal workflows, and LangGraph agents.
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg border border-slate-700 transition-colors flex items-center space-x-2 shrink-0"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-amber-400" />}
            <span>{copied ? 'Copied File Content!' : 'Copy Current File'}</span>
          </button>
        </div>
      </div>

      {/* Mac M2 Apple Silicon 1-Minute Local Bootstrap Guide */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/30 border border-amber-500/40 rounded-2xl p-5">
        <div className="flex items-center space-x-2 mb-3">
          <Terminal className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Apple Silicon (Mac M2) 3-Step Setup Instructions</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
            <span className="text-amber-400 font-bold block mb-1">Step 1: Install UV & Deps</span>
            <code className="text-slate-300 block">curl -LsSf https://astral.sh/uv/install.sh | sh</code>
            <code className="text-slate-400 block mt-1">uv sync && pnpm install</code>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
            <span className="text-amber-400 font-bold block mb-1">Step 2: Boot M2 Metal Stack</span>
            <code className="text-slate-300 block">docker compose -f docker-compose.local.yml up -d</code>
            <span className="text-[10px] text-emerald-400 block mt-1">Ollama, Postgres+pgvector, Redis, Temporal</span>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl">
            <span className="text-amber-400 font-bold block mb-1">Step 3: Pull Local Models</span>
            <code className="text-slate-300 block">ollama pull llama3.2:3b</code>
            <code className="text-slate-300 block mt-1">ollama pull qwen2.5-coder:7b</code>
          </div>
        </div>
      </div>

      {/* Monorepo Codebase Browser */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* File Tree List */}
        <div className="lg:col-span-4 space-y-3">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[11px] px-2.5 py-1 rounded-md font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1.5 max-h-[640px] overflow-y-auto">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <div
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`p-3 rounded-xl cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-slate-950 border-amber-500 ring-1 ring-amber-500 shadow-sm'
                      : 'border-transparent hover:bg-slate-950/60 hover:border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FileCode className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span className="font-mono text-xs font-bold text-white truncate">{file.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {file.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>{file.category}</span>
                    <span className="uppercase text-amber-500/80">{file.language}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Code Viewer */}
        <div className="lg:col-span-8">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="font-mono text-xs font-bold text-white">{selectedFile.path}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-[10px] font-mono uppercase bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                    {selectedFile.language}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                    title="Copy snippet"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <pre className="bg-slate-950 border border-slate-800/90 rounded-xl p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-[540px] overflow-y-auto leading-relaxed">
                {selectedFile.content}
              </pre>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
              <span>Path: light-weight-agentic-engineering/{selectedFile.path}</span>
              <span>Lines: {selectedFile.content.split('\n').length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
