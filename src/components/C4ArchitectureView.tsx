import React, { useState } from 'react';
import { C4_DIAGRAMS } from '../data/c4DiagramData';
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
  Maximize2
} from 'lucide-react';

export const C4ArchitectureView: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<'level1' | 'level2' | 'level3' | 'level4'>('level2');
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);

  const currentDiagram = C4_DIAGRAMS[selectedLevel];
  const selectedElement = currentDiagram.elements.find(el => el.id === selectedElementId) || currentDiagram.elements[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Layers className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-white">C4 Enterprise Architecture & System Design</h2>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/40">
                Full C4 Model (Levels 1–4)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Hierarchical architectural representation depicting System Context, 6-Plane Containers, Gateway Components, and M2 Metal vs Cloud Deployments.
            </p>
          </div>

          {/* Level Switcher */}
          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['level1', 'level2', 'level3', 'level4'] as const).map((lvlKey) => (
              <button
                key={lvlKey}
                onClick={() => {
                  setSelectedLevel(lvlKey);
                  setSelectedElementId(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedLevel === lvlKey
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
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
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-amber-400 font-bold uppercase tracking-wider">{currentDiagram.level}</span>
          <h3 className="text-sm font-bold text-white mt-0.5">{currentDiagram.title}</h3>
          <p className="text-slate-400 mt-1">{currentDiagram.description}</p>
        </div>
        <div className="shrink-0 text-slate-400 font-mono text-[11px] bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          <span>Elements: {currentDiagram.elements.length}</span> · <span>Relationships: {currentDiagram.relationships.length}</span>
        </div>
      </div>

      {/* Interactive C4 Canvas & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual C4 Node Graph */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 text-xs">
            <span className="text-slate-400 font-mono">Interactive Topology Map (Click node to inspect)</span>
            <span className="text-[10px] text-amber-400/90 font-mono">Zoom: 100% · Layout: Orthogonal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
            {currentDiagram.elements.map((el) => {
              const isSelected = selectedElement?.id === el.id;
              return (
                <div
                  key={el.id}
                  onClick={() => setSelectedElementId(el.id)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-slate-950 border-amber-500 ring-2 ring-amber-500/40 shadow-lg'
                      : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {el.type === 'Person' && <User className="w-4 h-4 text-sky-400" />}
                      {el.type === 'System' && <Server className="w-4 h-4 text-purple-400" />}
                      {el.type === 'Container' && <Layers className="w-4 h-4 text-amber-400" />}
                      {el.type === 'Component' && <Cpu className="w-4 h-4 text-emerald-400" />}
                      {el.type === 'Database' && <Database className="w-4 h-4 text-amber-400" />}
                      {el.type === 'Queue' && <Workflow className="w-4 h-4 text-rose-400" />}
                      <span className="font-bold text-xs text-white truncate">{el.name}</span>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                      [{el.type}]
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {el.description}
                  </p>

                  {el.technology && (
                    <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-500">Tech:</span>
                      <span className="text-amber-400/90 truncate max-w-[170px]">{el.technology}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Relationships Stream */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Active Inter-Element Protocols & Data Flows:
            </h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {currentDiagram.relationships.map((rel, idx) => {
                const src = currentDiagram.elements.find(e => e.id === rel.sourceId)?.name || rel.sourceId;
                const tgt = currentDiagram.elements.find(e => e.id === rel.targetId)?.name || rel.targetId;
                return (
                  <div key={idx} className="bg-slate-950 p-2 rounded-lg border border-slate-800/80 text-[11px] flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-slate-300">
                      <span className="font-semibold text-white truncate max-w-[140px]">{src}</span>
                      <ArrowRight className="w-3 h-3 text-amber-400 shrink-0" />
                      <span className="font-semibold text-amber-300 truncate max-w-[140px]">{tgt}</span>
                      <span className="text-slate-500">· {rel.description}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                      {rel.protocol}
                    </span>
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
                    <span className="text-slate-200 font-mono">{selectedElement.technology}</span>
                  </div>
                )}

                <div>
                  <span className="text-slate-500 block text-[10px] font-mono">FUNCTIONAL DESCRIPTION</span>
                  <p className="text-slate-300 leading-relaxed mt-1">
                    {selectedElement.description}
                  </p>
                </div>

                {/* Related Connections */}
                <div className="pt-3 border-t border-slate-800">
                  <span className="text-slate-500 block text-[10px] font-mono mb-2">CONNECTED FLOWS</span>
                  <div className="space-y-1.5">
                    {currentDiagram.relationships
                      .filter(r => r.sourceId === selectedElement.id || r.targetId === selectedElement.id)
                      .map((r, i) => (
                        <div key={i} className="text-[11px] bg-slate-950 p-2 rounded border border-slate-800 text-slate-300">
                          <span className="text-amber-400 font-mono">
                            {r.sourceId === selectedElement.id ? 'OUTGOING → ' : 'INCOMING ← '}
                          </span>
                          <span>{r.description}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Select any element on the canvas to inspect architectural metadata.</p>
            )}
          </div>

          {/* C4 Notation Guide */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-[11px] text-slate-400 space-y-2">
            <span className="font-bold text-white block">C4 Model Standard Reference:</span>
            <ul className="list-disc pl-4 space-y-1 text-slate-400">
              <li><strong className="text-slate-200">Level 1 (Context)</strong>: Who uses it and what systems it connects to.</li>
              <li><strong className="text-slate-200">Level 2 (Containers)</strong>: The 6 decoupled planes and datastores.</li>
              <li><strong className="text-slate-200">Level 3 (Components)</strong>: Internal LangGraph and MCP brokers.</li>
              <li><strong className="text-slate-200">Level 4 (Deployment)</strong>: Apple Silicon M2 Metal vs Cloud Kubernetes.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
