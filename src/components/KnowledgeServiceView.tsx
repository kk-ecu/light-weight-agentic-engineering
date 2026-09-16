import React, { useState } from 'react';
import { KNOWLEDGE_BASE_SEED } from '../data/mockData';
import { KnowledgeDocument } from '../types';
import { 
  Database, 
  Search, 
  Tag, 
  FileText, 
  Layers, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles,
  Sliders,
  BookOpen,
  FolderTree,
  ExternalLink,
  Clock,
  Cpu,
  ShieldCheck,
  X,
  Copy,
  Check
} from 'lucide-react';

export const KnowledgeServiceView: React.FC = () => {
  const [documents] = useState<KnowledgeDocument[]>(KNOWLEDGE_BASE_SEED);
  const [searchQuery, setSearchQuery] = useState('how does local Ollama on Mac M2 work with light-weight agentic architecture?');
  const [similarityThreshold, setSimilarityThreshold] = useState(0.70);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [activeDocModal, setActiveDocModal] = useState<KnowledgeDocument | null>(null);
  const [copiedDoc, setCopiedDoc] = useState(false);
  const [modalTab, setModalTab] = useState<'article' | 'metadata'>('article');

  const calculateScore = (doc: KnowledgeDocument, query: string) => {
    const q = query.toLowerCase().trim();
    if (!q) return 0.70;
    const tokens = q.split(/\s+/);
    let matches = 0;
    
    tokens.forEach(tok => {
      if (tok.length <= 2) return;
      if (doc.title.toLowerCase().includes(tok)) matches += 3;
      if (doc.contentSnippet.toLowerCase().includes(tok)) matches += 2;
      if (doc.tags.some(t => t.toLowerCase().includes(tok))) matches += 3;
      if (doc.source.toLowerCase().includes(tok)) matches += 2;
      if (doc.domain.toLowerCase().includes(tok)) matches += 2;
    });

    const baseScore = 0.55 + Math.min(0.40, matches * 0.08);
    return Math.min(0.98, parseFloat(baseScore.toFixed(2)));
  };

  const [searchResults, setSearchResults] = useState<{
    doc: KnowledgeDocument;
    score: number;
    matchType: 'vector' | 'hybrid';
  }[]>([
    { doc: KNOWLEDGE_BASE_SEED[0], score: 0.96, matchType: 'hybrid' },
    { doc: KNOWLEDGE_BASE_SEED[4], score: 0.93, matchType: 'vector' },
    { doc: KNOWLEDGE_BASE_SEED[7], score: 0.89, matchType: 'hybrid' },
    { doc: KNOWLEDGE_BASE_SEED[1], score: 0.84, matchType: 'vector' }
  ]);

  const handleSearch = (customQuery?: string) => {
    const q = customQuery !== undefined ? customQuery : searchQuery;
    if (customQuery !== undefined) setSearchQuery(customQuery);
    setIsSearching(true);

    setTimeout(() => {
      const scored = documents.map(doc => {
        const score = calculateScore(doc, q);
        return {
          doc,
          score,
          matchType: (score > 0.85 ? 'hybrid' : 'vector') as 'vector' | 'hybrid'
        };
      }).sort((a, b) => b.score - a.score);

      setSearchResults(scored.filter(s => s.score >= similarityThreshold));
      setIsSearching(false);
    }, 350);
  };

  const sampleQueries = [
    'Live Data & Mac M2 Setup Guide',
    'End-to-End Workflow & 3 Gateways Lifecycle',
    'Hands-On Workshop & Keynote Speech Blueprint',
    'How does local Ollama on Mac M2 work?',
    'What is Temporal Workflows durable execution & HITL?',
    'ADR-009 zero-trust MCP gateway isolation'
  ];

  const filteredDocs = selectedDomain === 'all' 
    ? documents 
    : documents.filter(d => d.domain === selectedDomain);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
                <Database className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white">Knowledge & Retrieval Service</h2>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2.5 py-0.5 rounded border border-amber-500/40">
                PostgreSQL + pgvector (HNSW Index)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-source ingestion, semantic chunking, and hybrid search (pgvector cosine + BM25 ranking) across architecture docs, ADRs, runbooks, and master training playbooks.
            </p>
          </div>
          <div className="flex items-center space-x-2 font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span>Embeddings:</span>
            <span className="text-emerald-400 font-semibold">1536-dim (Normalized)</span>
            <span>·</span>
            <span>Corpus:</span>
            <span className="text-amber-400 font-semibold">{documents.length} Docs Indexed</span>
          </div>
        </div>
      </div>

      {/* Interactive Semantic Search Tester */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Hybrid Retrieval Tester (pgvector + BM25)</h3>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">Port: 5432 (pgvector)</span>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Query architecture specs, ADRs, training playbooks, or Temporal runbooks..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={() => handleSearch()}
            disabled={isSearching || !searchQuery}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-2 shrink-0 shadow-md shadow-amber-500/10"
          >
            {isSearching ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Computing Cosine Distances...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Execute Hybrid Search</span>
              </>
            )}
          </button>
        </div>

        {/* Suggested Queries */}
        <div className="flex items-center space-x-2 text-xs flex-wrap gap-y-1.5 pt-1">
          <span className="text-slate-500 text-[11px] font-medium shrink-0">Sample Queries:</span>
          {sampleQueries.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSearch(sq)}
              className="text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-300 px-2.5 py-1 rounded-lg border border-slate-800 transition-colors"
            >
              "{sq}"
            </button>
          ))}
        </div>

        {/* Similarity Threshold Slider */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span>Minimum Cosine Threshold:</span>
            <span className="font-mono text-amber-400 font-bold">{similarityThreshold}</span>
            <span className="text-[10px] text-slate-500">(Scores above threshold are returned)</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="0.95"
            step="0.05"
            value={similarityThreshold}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setSimilarityThreshold(val);
              handleSearch();
            }}
            className="w-48 accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Search Results Display */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Ranked Retrieval Candidates ({searchResults.length} matches):
          </h3>
          <span className="text-xs text-slate-500 font-mono">HNSW Cosine Metric</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map(({ doc, score, matchType }) => (
            <div 
              key={doc.id} 
              onClick={() => setActiveDocModal(doc)}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 cursor-pointer rounded-xl p-4 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-bold text-xs text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {doc.title}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 border ${
                    score >= 0.90 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {(score * 100).toFixed(1)}% match
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-3">
                  {doc.contentSnippet}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  <span className="text-[10px] bg-amber-500/10 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30 uppercase font-semibold">
                    {doc.domain}
                  </span>
                  {doc.tags.slice(0, 3).map(t => (
                    <span key={t} className="text-[10px] bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span className="truncate max-w-[180px]">{doc.source}</span>
                <span className="text-amber-400 group-hover:underline">View Document ↗</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ingested Knowledge Base Corpus Explorer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">Ingested Corpus Knowledge Catalog</h3>
            <span className="text-xs text-slate-400 font-mono">({filteredDocs.length} documents)</span>
          </div>

          {/* Domain Filter */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto">
            {['all', 'architecture', 'adrs', 'training', 'runbooks', 'cms'].map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`px-2.5 py-1 rounded-lg capitalize whitespace-nowrap transition-colors ${
                  selectedDomain === dom
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {dom === 'all' ? 'All Domains' : dom}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-800/80">
          {filteredDocs.map((doc) => (
            <div 
              key={doc.id}
              onClick={() => setActiveDocModal(doc)}
              className="py-3 px-2 rounded-lg hover:bg-slate-950/60 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors"
            >
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center space-x-2 flex-wrap">
                  <span className="text-xs font-bold text-white hover:text-amber-300">{doc.title}</span>
                  <span className="text-[10px] bg-slate-950 text-amber-400 border border-slate-800 px-1.5 py-0.5 rounded font-mono uppercase">
                    {doc.domain}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1">{doc.contentSnippet}</p>
              </div>

              <div className="flex items-center space-x-4 text-[11px] font-mono text-slate-500 shrink-0">
                <span>{doc.chunkCount} Chunks</span>
                <span>{doc.vectorDimensions}d</span>
                <span className="text-slate-400">{doc.updatedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Detail Modal */}
      {activeDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-start justify-between gap-4 shrink-0 bg-slate-900">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                    {activeDocModal.domain}
                  </span>
                  <span className="text-xs text-slate-400 font-mono flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>{activeDocModal.source}</span>
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white leading-snug">{activeDocModal.title}</h3>
              </div>
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => {
                    const textToCopy = activeDocModal.fullContent || activeDocModal.contentSnippet;
                    navigator.clipboard.writeText(textToCopy);
                    setCopiedDoc(true);
                    setTimeout(() => setCopiedDoc(false), 2000);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg border border-slate-700 transition-colors flex items-center space-x-1.5"
                >
                  {copiedDoc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{copiedDoc ? 'Copied Markdown!' : 'Copy Markdown'}</span>
                </button>
                <button
                  onClick={() => setActiveDocModal(null)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800 border border-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="px-6 border-b border-slate-800 bg-slate-950/50 flex space-x-4 shrink-0">
              <button
                onClick={() => setModalTab('article')}
                className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
                  modalTab === 'article'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Full Markdown Document</span>
              </button>
              <button
                onClick={() => setModalTab('metadata')}
                className={`py-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
                  modalTab === 'metadata'
                    ? 'border-amber-400 text-amber-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Vector Metadata & Semantic Tags</span>
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto flex-1 space-y-5 text-slate-300">
              {modalTab === 'article' ? (
                <div className="space-y-4">
                  {activeDocModal.fullContent ? (
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                      {activeDocModal.fullContent}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 text-sm text-slate-300 leading-relaxed">
                        <div className="text-xs font-semibold text-amber-400 mb-2 font-mono uppercase">Abstract & Ingested Knowledge:</div>
                        <p>{activeDocModal.contentSnippet}</p>
                      </div>
                      <p className="text-xs text-slate-500 italic">
                        Full source document is indexed in pgvector at <code className="text-slate-400">{activeDocModal.source}</code>.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-300 leading-relaxed space-y-2">
                    <div className="font-semibold text-slate-200">Semantic Embedding Summary:</div>
                    <p>{activeDocModal.contentSnippet}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-slate-500 text-[10px]">Vector Dimensions</div>
                      <div className="text-amber-400 font-bold text-sm mt-0.5">{activeDocModal.vectorDimensions}d</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-slate-500 text-[10px]">Indexed Chunks</div>
                      <div className="text-emerald-400 font-bold text-sm mt-0.5">{activeDocModal.chunkCount}</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                      <div className="text-slate-500 text-[10px]">Last Synced</div>
                      <div className="text-sky-400 font-bold text-sm mt-0.5">{activeDocModal.updatedAt}</div>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <span className="text-xs text-slate-400 font-semibold block">Semantic Classification Tags:</span>
                    <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5">
                      {activeDocModal.tags.map(t => (
                        <span key={t} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between shrink-0">
              <div className="text-xs text-slate-500 font-mono">
                Source: <span className="text-slate-300">{activeDocModal.source}</span>
              </div>
              <button
                onClick={() => setActiveDocModal(null)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
