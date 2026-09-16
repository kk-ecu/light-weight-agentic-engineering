import React, { useState } from 'react';
import { MCPServer, MCPTool } from '../types';
import { X, Copy, Check, Download, FileJson, Server, Terminal, ShieldCheck } from 'lucide-react';

interface McpExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  servers: MCPServer[];
  tools: MCPTool[];
}

export const McpExportModal: React.FC<McpExportModalProps> = ({
  isOpen,
  onClose,
  servers,
  tools
}) => {
  const [activeTab, setActiveTab] = useState<'claude' | 'mcp_spec' | 'docker'>('claude');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Generate Claude Desktop config schema
  const claudeDesktopConfig = {
    mcpServers: servers.reduce((acc, server) => {
      const serverKey = server.id.replace('server-', '') + '-adapter';
      acc[serverKey] = {
        command: server.transportMode === 'stdio' ? "uv" : "mcp-proxy",
        args: server.transportMode === 'stdio' 
          ? ["run", "python", "-m", `services.mcp_gateway.adapters.${server.category.toLowerCase()}`]
          : ["--sse-endpoint", `http://localhost:8080/v1/${server.category.toLowerCase()}/sse`],
        env: {
          AUTH_BROKER_TYPE: server.authType,
          MCP_GATEWAY_PORT: "8080",
          TLS_MODE: "mtls-strict"
        }
      };
      return acc;
    }, {} as Record<string, any>)
  };

  // Generate Open MCP standard manifest
  const openMcpManifest = {
    schemaVersion: "1.0.0",
    gatewayVersion: "1.4.0-mac-m2",
    enterpriseGateway: {
      url: "http://localhost:8080/v1",
      protocol: "JSON-RPC 2.0",
      authMechanisms: ["Secrets Broker (JIT)", "OAuth2 Bearer", "Zero-Trust Token"],
      activeServers: servers.map(s => ({
        id: s.id,
        name: s.name,
        category: s.category,
        endpoint: s.endpoint,
        transport: s.transportMode || 'sse',
        tls: s.tlsVersion || 'TLS 1.3',
        status: s.status,
        registeredTools: tools.filter(t => t.serverId === s.id).map(t => ({
          name: t.name,
          actionClass: t.actionClass,
          requiresApproval: t.requiresApproval,
          schemaParams: t.schemaParams
        }))
      }))
    }
  };

  // Generate Docker Compose snippet
  const dockerComposeSnippet = `# planes/tool-integration-plane/docker-compose.mcp.yml
version: "3.8"

services:
  mcp-gateway:
    image: ghcr.io/light-weight-agentic/mcp-gateway:v1.4.0-m2
    container_name: agentic-mcp-gateway
    ports:
      - "8080:8080"
    environment:
      - GATEWAY_HOST=0.0.0.0
      - GATEWAY_PORT=8080
      - TEMPORAL_GRPC_ENDPOINT=localhost:7233
      - ZERO_TRUST_POLICY_MODE=strict
      - JIT_SECRET_BROKER_TTL=300
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
      interval: 10s
      timeout: 5s
      retries: 3

${servers.map(s => `  ${s.id}:
    image: ghcr.io/light-weight-agentic/${s.category.toLowerCase()}-adapter:latest
    environment:
      - MCP_TRANSPORT=${s.transportMode || 'sse'}
      - AUTH_TYPE=${s.authType}
    networks:
      - agentic-internal-net`).join('\n\n')}

networks:
  agentic-internal-net:
    driver: bridge`;

  const getContent = () => {
    switch (activeTab) {
      case 'claude':
        return JSON.stringify(claudeDesktopConfig, null, 2);
      case 'mcp_spec':
        return JSON.stringify(openMcpManifest, null, 2);
      case 'docker':
        return dockerComposeSnippet;
    }
  };

  const currentContent = getContent();

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = activeTab === 'claude' 
      ? 'claude_desktop_config.json' 
      : activeTab === 'mcp_spec' 
        ? 'mcp-servers.json' 
        : 'docker-compose.mcp.yml';
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <FileJson className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Export MCP Server Configurations</h3>
              <p className="text-xs text-slate-400">Generate standard Claude Desktop configs or Docker deployments</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Format Selector Tabs */}
        <div className="px-6 pt-3 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('claude')}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center space-x-1.5 ${
                activeTab === 'claude'
                  ? 'border-sky-400 text-sky-300 bg-slate-850'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>claude_desktop_config.json</span>
            </button>
            <button
              onClick={() => setActiveTab('mcp_spec')}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center space-x-1.5 ${
                activeTab === 'mcp_spec'
                  ? 'border-sky-400 text-sky-300 bg-slate-850'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>mcp-servers.json (Open Spec)</span>
            </button>
            <button
              onClick={() => setActiveTab('docker')}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-all border-b-2 flex items-center space-x-1.5 ${
                activeTab === 'docker'
                  ? 'border-sky-400 text-sky-300 bg-slate-850'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>docker-compose.mcp.yml</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 pb-2">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 flex items-center space-x-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-2.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-lg flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Code Content View */}
        <div className="flex-1 p-4 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed">
          <pre className="p-2 whitespace-pre overflow-x-auto text-[11px] selection:bg-sky-500/30">
            {currentContent}
          </pre>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/70 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Target Directory: <code className="text-sky-300 font-mono">~/Library/Application Support/Claude/claude_desktop_config.json</code></span>
          <span className="text-emerald-400 font-medium">Ready for Local M2 Offline Execution</span>
        </div>
      </div>
    </div>
  );
};
