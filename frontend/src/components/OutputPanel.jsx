function OutputPanel({ output, error, isRunning, onRun, onClear, canRun }) {
  return (
    <section className="flex min-h-0 flex-col border-t border-slate-800 bg-[#111827]">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Output</span>
          <span className="text-xs text-slate-600">console</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg border border-slate-700 px-3 py-1 text-xs text-slate-300 transition hover:border-slate-600 hover:text-white"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={onRun}
            disabled={!canRun || isRunning}
            className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRunning ? 'Running...' : '▶ Run'}
          </button>
        </div>
      </div>

      <div
        className="min-h-0 flex-1 overflow-auto px-4 py-3 font-mono text-sm"
        style={{ minHeight: '140px', maxHeight: '220px', color: '#e2e8f0' }}
      >
        {!canRun ? (
          <p style={{ color: '#94a3b8' }}>
            Run is available for JavaScript only. Switch language to JavaScript to execute code.
          </p>
        ) : error ? (
          <pre style={{ margin: 0, color: '#fda4af', whiteSpace: 'pre-wrap' }}>{error}</pre>
        ) : output ? (
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{output}</pre>
        ) : (
          <p style={{ color: '#64748b' }}>
            Click Run to execute your code. console.log() output appears here. Shortcut: Ctrl+Enter
          </p>
        )}
      </div>
    </section>
  )
}

export default OutputPanel
