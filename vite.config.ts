import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api/agent': {
          target: process.env.VITE_AGENT_GATEWAY_URL || 'http://localhost:8000',
          changeOrigin: true,
          rewrite: (p: string) => p.replace(/^\/api\/agent/, '')
        },
        '/api/mcp': {
          target: process.env.VITE_MCP_GATEWAY_URL || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (p: string) => p.replace(/^\/api\/mcp/, '')
        },
        '/api/llm': {
          target: process.env.VITE_LLM_GATEWAY_URL || 'http://localhost:8002',
          changeOrigin: true,
          rewrite: (p: string) => p.replace(/^\/api\/llm/, '')
        },
        '/api/ollama': {
          target: process.env.VITE_OLLAMA_URL || 'http://localhost:11434',
          changeOrigin: true,
          rewrite: (p: string) => p.replace(/^\/api\/ollama/, '')
        }
      },
    },
  };
});
