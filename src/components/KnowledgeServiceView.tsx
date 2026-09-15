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
  Sliders
} from 'lucide-react';

export const KnowledgeServiceView: React.FC = () => {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(KNOWLEDGE_BASE_SEED);
  const [searchQuery, setSearchQuery] = useState('how does local Ollama on Mac M2 work with Genting architecture?');
  const [similarityThreshold, setSimilarityThreshold] = useState(0.75);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    doc: KnowledgeDocument;
    score: number;
    matchType: 'vector' | 'hybrid';
  }[]>([
    { doc: KNOWLEDGE_BASE_SEED[0], score: 0.94, matchType: 'hybrid' },
    { doc: KNOWLEDGE_BASE_SEED[4], score: 0.91, matchType: 'vector' },
    { doc: KNOWLEDGE_BASE_SEED[1], score: 0.82, matchType: 'vector' }
  ]);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      const q = searchQuery.toLowerCase();
      const scored = documents.map(doc => {
        let score = 0.65;
        if (q.includes("m2") && (doc.tags.includes("MacM2") || doc.contentSnippet.includes("M2"))) score += 0.28;
        if (q.includes("ollama") && (doc.tags.includes("Ollama") || doc.contentSnippet.includes("Ollama"))) score += 0.26;
        if (q.includes("gateway") && doc.tags.includes("Gateways")) score += 0.25;
        if (q.includes("langgraph") && doc.tags.includes("LangGraph")) score += 0.29;
        return {
          doc,
          score: Math.min(0.98, score + Math.random() * 0.05),
          matchType: 'hybrid' as const
        };
      }).sort((a, b) => b.score - a.score);

      setSearchResults(scored.filter(s => s.score >= similarityThreshold));
      setIsSearching(false);
    }, 450);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <Database className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-white">Knowledge & Retrieval Service</h2>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/40">
                PostgreSQL + pgvector (HNSW Index)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-source ingestion, semantic chunking, and hybrid search (pgvector cosine + OpenSearch BM25 ranking).
            </p>
          </div>
          <div className="flex items-center space-x-2 font-mono text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <span>Embeddings:</span>
            <span className="text-emerald-400 font-semibold">1536-dim (Normalized)</span>
          </div>
        </div>
      </div>

      {/* Interactive Semantic Search Tester */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Search className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Hybrid Retrieval Tester (pgvector + BM25)</h3>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Query architecture specs, ADRs, or Genting CMS content..."
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center justify-center space-x-2"
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

        {/* Similarity Threshold Slider */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <span>Minimum Cosine Threshold:</span>
            <span className="font-mono text-amber-400 font-bold">{similarityThreshold}</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="0.95"
            step="0.05"
            value={similarityThreshold}
            onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searchResults.map(({ doc, score, matchType }, idx) => (
            <div key={doc.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-bold text-xs text-white line-clamp-1">{doc.title}</span>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0">
                    {(score * 100).toFixed(1)}% match
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-3">
                  {doc.contentSnippet}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {doc.tags.map(t => (
                    <span key={t} className="text-[10px] bg-slate-950 text-slate-400 px-1.5 py-0.5 rounded border border-slate-800">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex items-center justify-between">
                <span className="truncate max-w-[180px]">{doc.source}</span>
                <span>{doc.chunkCount} chunks</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
