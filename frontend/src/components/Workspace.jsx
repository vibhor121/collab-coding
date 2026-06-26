import { useCallback, useEffect, useMemo, useState } from 'react'
import { LANGUAGES } from '../utils/constants'
import { canRunLanguage, runJavaScript } from '../utils/runCode'
import { useCollaboration } from '../hooks/useCollaboration'
import CollaboratorPanel from './CollaboratorPanel'
import CollaborativeEditor from './CollaborativeEditor'
import OutputPanel from './OutputPanel'

function StatusBadge({ status, synced }) {
  if (status === 'connected' && synced) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs text-emerald-300">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        Live
      </span>
    )
  }

  if (status === 'connected') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-2.5 py-1 text-xs text-amber-300">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
        Syncing
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 px-2.5 py-1 text-xs text-rose-300">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" />
      {status === 'connecting' ? 'Connecting' : 'Offline'}
    </span>
  )
}

function Workspace({ roomId, userName, inviteUrl, onLeave }) {
  const [language, setLanguage] = useState('javascript')
  const [copied, setCopied] = useState(false)
  const [output, setOutput] = useState('')
  const [runError, setRunError] = useState('')
  const [isRunning, setIsRunning] = useState(false)

  const { ytext, provider, status, synced, users, displayName, connectionError } =
    useCollaboration({
      roomId,
      userName,
    })

  const onlineCount = useMemo(() => users.length, [users])
  const runnable = canRunLanguage(language)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const handleRun = useCallback(() => {
    if (!ytext || !runnable) return

    setIsRunning(true)
    setRunError('')
    setOutput('')

    const code = ytext.toString()
    const result = runJavaScript(code)

    setOutput(result.output)
    setRunError(result.error || '')
    setIsRunning(false)
  }, [ytext, runnable])

  const handleClearOutput = () => {
    setOutput('')
    setRunError('')
  }

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault()
        handleRun()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [handleRun])

  return (
    <div
      className="flex flex-col overflow-hidden bg-slate-950 text-slate-100"
      style={{ minHeight: '100vh', height: '100vh' }}
    >
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-slate-800 bg-slate-900/95 px-4 backdrop-blur">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 text-sm font-bold text-slate-950">
            CC
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">CodeCollab</p>
            <p className="truncate text-xs text-slate-500">Room {roomId}</p>
          </div>
        </div>

        <div className="hidden items-center gap-2 sm:flex">
          <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5">
            <span className="text-xs text-slate-500">Invite</span>
            <code className="max-w-[220px] truncate text-xs text-cyan-300">{inviteUrl}</code>
            <button
              type="button"
              onClick={handleCopyLink}
              className="rounded-lg bg-slate-800 px-2 py-1 text-xs text-white transition hover:bg-slate-700"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <StatusBadge status={status} synced={synced} />
          <span className="hidden text-xs text-slate-500 md:inline">{onlineCount} online</span>
          <button
            type="button"
            onClick={onLeave}
            className="rounded-xl border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:border-slate-600 hover:text-white"
          >
            Leave
          </button>
        </div>
      </header>

      {connectionError ? (
        <div
          className="shrink-0 border-b border-rose-500/30 bg-rose-500/10 px-4 py-2 text-sm text-rose-200"
          style={{ background: 'rgba(244, 63, 94, 0.12)', color: '#fecdd3' }}
        >
          {connectionError}
        </div>
      ) : null}

      <div className="flex min-h-0 flex-1">
        <CollaboratorPanel users={users} />

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between gap-3 border-b border-slate-800 bg-[#1e1e1e] px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">main.js</span>
              <span className="text-xs text-slate-500">Shared document</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRun}
                disabled={!runnable || isRunning || !ytext}
                className="rounded-lg bg-emerald-500 px-3 py-1 text-xs font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50 sm:hidden"
              >
                ▶ Run
              </button>

              <label className="flex items-center gap-2 text-xs text-slate-400">
                Language
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white outline-none focus:border-cyan-500"
                >
                  {LANGUAGES.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1" style={{ minHeight: '280px' }}>
              {ytext && provider ? (
                <CollaborativeEditor ytext={ytext} provider={provider} language={language} />
              ) : (
                <div
                  className="flex h-full items-center justify-center bg-[#1e1e1e] text-sm text-slate-400"
                  style={{ minHeight: '280px', color: '#94a3b8' }}
                >
                  Connecting to your coding room...
                </div>
              )}
            </div>

            <OutputPanel
              output={output}
              error={runError}
              isRunning={isRunning}
              onRun={handleRun}
              onClear={handleClearOutput}
              canRun={runnable}
            />
          </div>

          <footer className="flex items-center justify-between border-t border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-500">
            <span>{displayName}</span>
            <span>Real-time sync powered by Yjs + Socket.io</span>
            <span className="sm:hidden">
              <button type="button" onClick={handleCopyLink} className="text-cyan-400">
                {copied ? 'Copied' : 'Copy invite'}
              </button>
            </span>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default Workspace
