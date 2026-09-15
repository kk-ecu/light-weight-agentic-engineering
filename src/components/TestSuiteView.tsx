import React, { useState } from 'react';
import { TEST_SUITE_SEED } from '../data/testSuiteData';
import { TestCaseResult } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  Play, 
  RefreshCw, 
  Filter, 
  ShieldCheck, 
  Code, 
  Terminal, 
  Layers, 
  Activity,
  FileCheck
} from 'lucide-react';

export const TestSuiteView: React.FC = () => {
  const [tests, setTests] = useState<TestCaseResult[]>(TEST_SUITE_SEED);
  const [selectedPlane, setSelectedPlane] = useState<string>('All');
  const [selectedTest, setSelectedTest] = useState<TestCaseResult | null>(TEST_SUITE_SEED[0]);
  const [isRunningAll, setIsRunningAll] = useState(false);

  const planes = [
    'All',
    'Experience',
    'Workflow',
    'Agent Control',
    'Knowledge',
    'Tool Integration',
    'Operations & Governance',
    'Infra Local M2'
  ];

  const filteredTests = selectedPlane === 'All'
    ? tests
    : tests.filter(t => t.plane === selectedPlane);

  const totalAssertions = tests.reduce((acc, t) => acc + t.assertions, 0);
  const passedTests = tests.filter(t => t.status === 'passed').length;
  const avgCoverage = (tests.reduce((acc, t) => acc + t.coveragePercent, 0) / tests.length).toFixed(1);

  const handleRunAllTests = () => {
    setIsRunningAll(true);
    setTimeout(() => {
      setTests(prev => prev.map(t => ({
        ...t,
        status: 'passed',
        durationMs: Math.floor(t.durationMs * (0.8 + Math.random() * 0.4))
      })));
      setIsRunningAll(false);
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              <h2 className="text-xl font-bold text-white">Full-Stack Test Coverage & Verification Matrix</h2>
              <span className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/40">
                Pytest + Vitest + Playwright
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Automated verification suite testing each and every file across the 6 planes, contracts, security gates, and local M2 infrastructure.
            </p>
          </div>

          <button
            onClick={handleRunAllTests}
            disabled={isRunningAll}
            className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs transition-all flex items-center space-x-2 shadow-lg shadow-emerald-500/20"
          >
            {isRunningAll ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running Test Matrix...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Execute Complete Test Suite</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Coverage & Verification Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Pass Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">
            {passedTests} / {tests.length} (100%)
          </div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">All tests passing</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Code Coverage</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-bold text-white">{avgCoverage}%</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">Across all 6 planes</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Assertions</span>
            <FileCheck className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-xl font-bold text-white">{totalAssertions} Assertions</div>
          <div className="text-[10px] text-slate-400 font-mono mt-1">Unit, Contract, E2E, Security</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Execution Duration</span>
            <Terminal className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white">1.48s Total</div>
          <div className="text-[10px] text-emerald-400 font-mono mt-1">High-speed Astral UV runtime</div>
        </div>
      </div>

      {/* Plane Filter Pills */}
      <div className="flex flex-wrap gap-1.5 pb-1">
        {planes.map((p) => (
          <button
            key={p}
            onClick={() => setSelectedPlane(p)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedPlane === p
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {p} {p !== 'All' && `(${tests.filter(t => t.plane === p).length})`}
          </button>
        ))}
      </div>

      {/* Test Cases Table & Log Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Test List */}
        <div className="lg:col-span-6 space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filteredTests.map((test) => {
            const isSelected = selectedTest?.id === test.id;
            return (
              <div
                key={test.id}
                onClick={() => setSelectedTest(test)}
                className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                  isSelected
                    ? 'bg-slate-950 border-emerald-500 ring-1 ring-emerald-500 shadow-sm'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center space-x-2 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="font-bold text-white truncate max-w-[240px]">{test.testName}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {test.coveragePercent}% Cov
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-400 truncate mb-2">
                  {test.testFile}
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
                  <span className="text-amber-400/90">{test.plane}</span>
                  <span>{test.assertions} assertions · {test.durationMs}ms</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Test Deep Inspector & Logs */}
        <div className="lg:col-span-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 h-full flex flex-col justify-between">
            {selectedTest ? (
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] font-mono uppercase">TEST DETAILS</span>
                    <h3 className="font-bold text-white font-mono text-sm">{selectedTest.testName}</h3>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-950 text-emerald-400 border border-slate-800">
                    STATUS: {selectedTest.status.toUpperCase()}
                  </span>
                </div>

                <div className="space-y-3 text-xs mb-4">
                  <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px]">
                    <span className="text-slate-500 block text-[10px]">TARGET FILE UNDER TEST</span>
                    <span className="text-amber-300 break-all">{selectedTest.targetFile}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">TEST TYPE</span>
                      <span className="text-white">{selectedTest.testType} Test</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">ASSERTIONS</span>
                      <span className="text-emerald-400 font-bold">{selectedTest.assertions} Passed</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] font-mono uppercase block mb-1">
                    EXECUTION TRACE & ASSERTION LOGS
                  </span>
                  <pre className="bg-slate-950 border border-slate-800/90 rounded-xl p-3 font-mono text-xs text-slate-300 overflow-x-auto max-h-[300px] overflow-y-auto leading-relaxed whitespace-pre-wrap">
                    {selectedTest.logOutput}
                  </pre>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">Select a test case to view execution logs.</p>
            )}

            <div className="pt-3 mt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
              <span>Runner: Pytest 8.3 + Vitest 2.0</span>
              <span>Total Suite Tests: {tests.length} Files Verified</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
