import React, { useState } from 'react';
import { C4_DIAGRAMS } from '../data/c4DiagramData';
import { ArchitectureView } from './ArchitectureView';
import { 
  Layers, 
  ArrowRight, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Workflow, 
  Server, 
  User, 
  HardDrive, 
  Share2, 
  Info,
  Maximize2,
  Lock,
  GitBranch,
  Terminal,
  Activity,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Boxes,
  Network,
  GitMerge,
  FileText
} from 'lucide-react';

interface C4ArchitectureViewProps {
  onNavigateDoc?: () => void;
}

export const C4ArchitectureView: React.FC<C4ArchitectureViewProps> = ({ onNavigateDoc }) => {
  const [architectureTab, setArchitectureTab] = useState<'c4-model' | 'sequence-flows'>('c4-model');
  const [selectedLevel, setSelectedLevel] = useState<'level1' | 'level2' | 'level3' | 'level4'>('level2');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const currentDiagram = C4_DIAGRAMS[selectedLevel];
  const selectedElement = currentDiagram.elements.find(el => el.id === selectedElementId) || currentDiagram.elements[0];

  if (architectureTab === 'sequence-flows') {
    return (
      <div className="space-y-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl w-fit">
            <button
              onClick={() => setArchitectureTab('c4-model')}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              C4 Structural Model (Levels 1–4)
            </button>
            <button
              onClick={() => setArchitectureTab('sequence-flows')}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 shadow-md font-bold transition-all"
            >
              Interactive Sequence Flows (11.1, 11.2, 11.3)
            </button>
          </div>
        </div>
        <ArchitectureView />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Architecture Navigation Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 p-1.5 rounded-xl w-fit">
          <button
            onClick={() => setArchitectureTab('c4-model')}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 text-slate-950 shadow-md font-bold transition-all"
          >
            C4 Structural Model (Levels 1–4)
          </button>
          <button
            onClick={() => setArchitectureTab('sequence-flows')}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Interactive Sequence Flows (11.1, 11.2, 11.3)
          </button>
        </div>

        {onNavigateDoc && (
          <button
            onClick={onNavigateDoc}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-amber-500/30 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Read 6-Step Field Manual & Architecture Spec</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <Layers className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-white">C4 Enterprise Architecture & System Design</h2>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2.5 py-0.5 rounded border border-amber-500/40">
                Full C4 Model (Levels 1–4)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Hierarchical architectural representation with pristine spacing, zero-overlap node layouts, container topologies, and physical Apple Silicon M2 runtime mappings.
            </p>
          </div>

          {/* Level Switcher */}
          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            {(['level1', 'level2', 'level3', 'level4'] as const).map((lvlKey) => (
              <button
                key={lvlKey}
                onClick={() => {
                  setSelectedLevel(lvlKey);
                  setSelectedElementId(null);
                }}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                  selectedLevel === lvlKey
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {lvlKey === 'level1' && 'Level 1: Context'}
                {lvlKey === 'level2' && 'Level 2: 6 Planes'}
                {lvlKey === 'level3' && 'Level 3: Components'}
                {lvlKey === 'level4' && 'Level 4: Deployment'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Diagram Info Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-amber-400 font-bold uppercase tracking-wider text-[11px]">{currentDiagram.level}</span>
          <h3 className="text-sm font-bold text-white mt-0.5">{currentDiagram.title}</h3>
          <p className="text-slate-400 mt-1 leading-relaxed">{currentDiagram.description}</p>
        </div>
        <div className="shrink-0 flex items-center space-x-2 text-slate-400 font-mono text-[11px] bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 self-start md:self-auto">
          <span>Nodes: <strong className="text-white">{currentDiagram.elements.length}</strong></span>
          <span>·</span>
          <span>Flows: <strong className="text-amber-300">{currentDiagram.relationships.length}</strong></span>
        </div>
      </div>

      {/* Main Grid: Visual Architectural Canvas + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Visual C4 Diagram Canvas */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center space-x-2">
              <Boxes className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300 font-medium">Visual Architectural Diagram (Click node to inspect metadata)</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Spacing: Anti-Overlap Optimized
            </span>
          </div>

          {/* LEVEL 1 SPECIFIC VISUAL LAYOUT: External Actors -> Core System -> SaaS */}
          {selectedLevel === 'level1' && (
            <div className="space-y-6">
              {/* Top Tier: External Actors */}
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-sky-400" />
                  <span>External Actors (People)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {currentDiagram.elements.filter(e => e.type === 'Person').map((el) => {
                    const isSelected = selectedElement?.id === el.id;
                    return (
                      <div
                        key={el.id}
                        onClick={() => setSelectedElementId(el.id)}
                        className={`p-3.5 rounded-xl cursor-pointer border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-slate-950 border-sky-500 ring-2 ring-sky-500/40 shadow-lg'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <User className="w-4 h-4 text-sky-400" />
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-800/60">
                              Actor
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-white line-clamp-1">{el.name}</h4>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{el.description}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-sky-400/90 font-mono flex items-center space-x-1">
                          <span>Out: HTTPS</span>
                          <ArrowRight className="w-3 h-3" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Directional Connector Down */}
              <div className="flex justify-center items-center my-1">
                <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 text-[10px] font-mono text-amber-400">
                  <span>▼ User Inquiries & Engineering Demands ▼</span>
                </div>
              </div>

              {/* Middle Tier: System Boundary */}
              {currentDiagram.elements.filter(e => e.id === 'system-agentic-platform').map((el) => {
                const isSelected = selectedElement?.id === el.id;
                return (
                  <div
                    key={el.id}
                    onClick={() => setSelectedElementId(el.id)}
                    className={`p-5 rounded-2xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30 border-amber-500 ring-2 ring-amber-500/40 shadow-xl'
                        : 'bg-gradient-to-br from-slate-950 to-slate-900 border-slate-700 hover:border-amber-500/60'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center space-x-2">
                        <Server className="w-5 h-5 text-amber-400" />
                        <h4 className="font-bold text-sm text-white">{el.name}</h4>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 self-start sm:self-auto">
                        Target System Boundary
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{el.description}</p>
                    <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                      <span className="text-slate-400">Infrastructure: <strong className="text-white">{el.technology}</strong></span>
                      <span className="text-emerald-400">Planes: Experience, Workflow, Agent, Knowledge, Tools, Governance</span>
                    </div>
                  </div>
                );
              })}

              {/* Directional Connector Down */}
              <div className="flex justify-center items-center my-1">
                <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 text-[10px] font-mono text-emerald-400">
                  <span>▼ Sandboxed MCP Tool Calls & Data Retrieval ▼</span>
                </div>
              </div>

              {/* Bottom Tier: External SaaS Systems */}
              <div>
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                  <Network className="w-3.5 h-3.5 text-purple-400" />
                  <span>External Enterprise SaaS & API Ecosystem</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {currentDiagram.elements.filter(e => e.type === 'System' && e.id !== 'system-agentic-platform').map((el) => {
                    const isSelected = selectedElement?.id === el.id;
                    return (
                      <div
                        key={el.id}
                        onClick={() => setSelectedElementId(el.id)}
                        className={`p-3.5 rounded-xl cursor-pointer border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-slate-950 border-purple-500 ring-2 ring-purple-500/40 shadow-lg'
                            : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <Server className="w-4 h-4 text-purple-400" />
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/60">
                              External
                            </span>
                          </div>
                          <h4 className="font-bold text-xs text-white line-clamp-1">{el.name}</h4>
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{el.description}</p>
                        </div>
                        <div className="mt-3 pt-2 border-t border-slate-800/80 text-[10px] text-purple-400 font-mono truncate">
                          {el.technology}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* LEVEL 2 SPECIFIC VISUAL LAYOUT: The 6 Decoupled Planes Grid + Dedicated Shared Infrastructure Tier */}
          {selectedLevel === 'level2' && (
            <div className="space-y-6">
              {/* Top Group: The 6 Autonomous Microservice Planes */}
              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-bold text-white">The 6 Autonomous Application Planes (Microservice Containers)</span>
                  </div>
                  <span className="text-amber-400 font-mono">Port-isolated microservices</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {currentDiagram.elements.filter(e => e.type === 'Container').map((el) => {
                    const isSelected = selectedElement?.id === el.id;
                    return (
                      <div
                        key={el.id}
                        onClick={() => setSelectedElementId(el.id)}
                        className={`p-4 rounded-xl cursor-pointer border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-slate-950 border-amber-500 ring-2 ring-amber-500/40 shadow-lg'
                            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Layers className="w-4 h-4 text-amber-400" />
                              <span className="font-bold text-xs text-white">{el.name}</span>
                            </div>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                              Plane
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                            {el.description}
                          </p>
                        </div>

                        {el.technology && (
                          <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                            <span className="text-slate-500">Tech:</span>
                            <span className="text-amber-300 font-semibold truncate max-w-[190px]">{el.technology}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Directional Connector Down to Persistence */}
              <div className="flex justify-center items-center my-1">
                <div className="flex items-center space-x-2 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 text-[10px] font-mono text-emerald-400">
                  <span>▼ State Persistence, Checkpointing, & Event Queuing ▼</span>
                </div>
              </div>

              {/* Bottom Group: Shared Infrastructure & Persistence Layer */}
              <div className="bg-slate-950/90 border border-emerald-500/30 rounded-2xl p-4.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-800/80">
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Shared Infrastructure & Persistence Tier (Underlying Foundation)
                    </h4>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400/90 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30 self-start sm:self-auto">
                    Docker Compose Stack (compose.yaml)
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mb-3">
                  These underlying stateful services run as persistent daemons outside the application planes. They provide durable vector search, event-sourced checkpointing, and in-memory pub/sub for all 6 planes.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {currentDiagram.elements.filter(e => e.type === 'Database' || e.type === 'Queue').map((el) => {
                    const isSelected = selectedElement?.id === el.id;
                    return (
                      <div
                        key={el.id}
                        onClick={() => setSelectedElementId(el.id)}
                        className={`p-4 rounded-xl cursor-pointer border transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/40 shadow-lg'
                            : 'bg-slate-900/70 border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {el.type === 'Database' && <Database className="w-4 h-4 text-emerald-400" />}
                              {el.type === 'Queue' && <Workflow className="w-4 h-4 text-purple-400" />}
                              <span className="font-bold text-xs text-white">{el.name}</span>
                            </div>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-emerald-500/30">
                              {el.type === 'Database' ? 'Vector & Checkpoint DB' : 'In-Memory Cache & Bus'}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                            {el.description}
                          </p>
                        </div>

                        {el.technology && (
                          <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
                            <span className="text-slate-500">Tech:</span>
                            <span className="text-emerald-300 font-semibold">{el.technology}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* LEVEL 3 SPECIFIC VISUAL LAYOUT: Component Internal Flow */}
          {selectedLevel === 'level3' && (
            <div className="space-y-4">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Agent Gateway & Tool Broker Components</span>
                <span className="text-sky-400">Zero-Trust LangGraph Pipeline</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentDiagram.elements.map((el) => {
                  const isSelected = selectedElement?.id === el.id;
                  return (
                    <div
                      key={el.id}
                      onClick={() => setSelectedElementId(el.id)}
                      className={`p-4 rounded-xl cursor-pointer border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-950 border-sky-500 ring-2 ring-sky-500/40 shadow-lg'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Cpu className="w-4 h-4 text-sky-400" />
                            <span className="font-bold text-xs text-white">{el.name}</span>
                          </div>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-800/60">
                            Component
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                          {el.description}
                        </p>
                      </div>

                      {el.technology && (
                        <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate-500">Tech:</span>
                          <span className="text-sky-300 font-semibold truncate max-w-[240px]">{el.technology}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LEVEL 4 SPECIFIC VISUAL LAYOUT: Physical Mac M2 Hardware vs Containers */}
          {selectedLevel === 'level4' && (
            <div className="space-y-4">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Apple Silicon M2 Deployment Topology</span>
                <span className="text-purple-400">16 GB Unified Memory Budget</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentDiagram.elements.map((el) => {
                  const isSelected = selectedElement?.id === el.id;
                  return (
                    <div
                      key={el.id}
                      onClick={() => setSelectedElementId(el.id)}
                      className={`p-4 rounded-xl cursor-pointer border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-slate-950 border-purple-500 ring-2 ring-purple-500/40 shadow-lg'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <HardDrive className="w-4 h-4 text-purple-400" />
                            <span className="font-bold text-xs text-white">{el.name}</span>
                          </div>
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/60">
                            Host / Container
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-relaxed mb-3">
                          {el.description}
                        </p>
                      </div>

                      {el.technology && (
                        <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                          <span className="text-slate-500">Allocation:</span>
                          <span className="text-purple-300 font-semibold truncate max-w-[240px]">{el.technology}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Relationships Stream - Formatted as Clean Cards to GUARANTEE ZERO OVERLAP */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Active Inter-Element Protocols & Execution Flows:</span>
              <span className="text-[10px] font-mono text-slate-500">({currentDiagram.relationships.length} defined routes)</span>
            </h4>
            
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1.5">
              {currentDiagram.relationships.map((rel, idx) => {
                const src = currentDiagram.elements.find(e => e.id === rel.sourceId)?.name || rel.sourceId;
                const tgt = currentDiagram.elements.find(e => e.id === rel.targetId)?.name || rel.targetId;
                return (
                  <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 text-xs space-y-1.5 hover:border-slate-700 transition-colors">
                    {/* Top Row: Source -> Target & Protocol Badge */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-[11px]">{src}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="font-bold text-amber-300 text-[11px]">{tgt}</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/60 self-start sm:self-auto shrink-0">
                        {rel.protocol}
                      </span>
                    </div>

                    {/* Bottom Row: Full Un-truncated Description */}
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {rel.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Element Detailed Inspector */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center space-x-2 pb-3 border-b border-slate-800 mb-3">
              <Info className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">C4 Architectural Node Inspector</h3>
            </div>

            {selectedElement ? (
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-500 block text-[10px] font-mono">ELEMENT NAME</span>
                  <span className="text-sm font-bold text-white">{selectedElement.name}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px] font-mono">TYPE</span>
                    <span className="text-amber-300 font-bold font-mono">{selectedElement.type}</span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px] font-mono">PLANE</span>
                    <span className="text-emerald-400 font-bold font-mono">{selectedElement.plane || 'External / Shared'}</span>
                  </div>
                </div>

                {selectedElement.technology && (
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-500 block text-[10px] font-mono">TECHNOLOGY STACK</span>
                    <span className="text-slate-200 font-mono text-[11px] leading-relaxed block mt-0.5">{selectedElement.technology}</span>
                  </div>
                )}

                <div>
                  <span className="text-slate-500 block text-[10px] font-mono">FUNCTIONAL DESCRIPTION</span>
                  <p className="text-slate-300 leading-relaxed mt-1 text-xs">
                    {selectedElement.description}
                  </p>
                </div>

                {/* Related Connections */}
                <div className="pt-3 border-t border-slate-800">
                  <span className="text-slate-500 block text-[10px] font-mono mb-2">CONNECTED FLOWS</span>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {currentDiagram.relationships
                      .filter(r => r.sourceId === selectedElement.id || r.targetId === selectedElement.id)
                      .map((r, i) => (
                        <div key={i} className="text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-slate-300 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-amber-400 font-mono font-semibold text-[10px]">
                              {r.sourceId === selectedElement.id ? 'OUTGOING → ' : 'INCOMING ← '}
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                              {r.protocol}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{r.description}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Select any element on the canvas to inspect architectural metadata.</p>
            )}
          </div>

          {/* C4 Notation Standard Reference */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-[11px] text-slate-400 space-y-2">
            <span className="font-bold text-white block">C4 Model Standard Reference:</span>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-start space-x-1.5">
                <span className="text-amber-400 font-bold">•</span>
                <span><strong className="text-slate-200">Level 1 (Context)</strong>: Who uses it and external software systems it connects to.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-emerald-400 font-bold">•</span>
                <span><strong className="text-slate-200">Level 2 (Containers)</strong>: The 6 decoupled planes, independent microservices, and databases.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-sky-400 font-bold">•</span>
                <span><strong className="text-slate-200">Level 3 (Components)</strong>: Internal LangGraph state nodes, policy hooks, and MCP secret brokers.</span>
              </li>
              <li className="flex items-start space-x-1.5">
                <span className="text-purple-400 font-bold">•</span>
                <span><strong className="text-slate-200">Level 4 (Deployment)</strong>: Apple Silicon M2 Metal GPU offload vs local Docker container memory allocation.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
