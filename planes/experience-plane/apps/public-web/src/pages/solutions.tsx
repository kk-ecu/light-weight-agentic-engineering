import React, { useState } from 'react';
import { useAgentGateway } from '@agentic/api-client';

export const SolutionDiscoveryPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const { submitTask, response, isLoading } = useAgentGateway();

  const handleAsk = async () => {
    if (!query) return;
    await submitTask({
      agentId: 'website-concierge-agent',
      actionClass: 'read', // Enforces least privilege for public users
      prompt: query,
      contextScope: 'agentic-digital-solutions'
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-slate-900">Enterprise Enterprise AI Discovery</h1>
      <p className="text-slate-600 mt-2">Explore digital solutions grounded in verified Enterprise blueprints.</p>
      
      <div className="mt-6 flex gap-3">
        <input 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about Enterprise Smart Concierge, Edge AI, or Resorts IoT..."
          className="flex-1 border border-slate-300 rounded-lg p-3 text-sm"
        />
        <button 
          onClick={handleAsk}
          disabled={isLoading}
          className="bg-amber-600 text-white font-bold px-6 py-3 rounded-lg"
        >
          {isLoading ? 'Synthesizing...' : 'Discover'}
        </button>
      </div>

      {response && (
        <div className="mt-8 bg-slate-50 border border-slate-200 p-6 rounded-xl">
          <h3 className="font-bold text-slate-800">Recommendation</h3>
          <p className="text-slate-700 mt-2">{response.answer}</p>
          <div className="mt-4 flex gap-2">
            {response.citations?.map((cite, i) => (
              <span key={i} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">
                Ref: {cite.docTitle}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
