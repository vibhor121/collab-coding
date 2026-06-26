function CollaboratorPanel({ users }) {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-950/80">
      <div className="border-b border-slate-800 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-slate-500">Live</p>
        <h2 className="mt-1 text-sm font-semibold text-white">Collaborators</h2>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto p-3">
        {users.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-800 px-3 py-4 text-center text-xs text-slate-500">
            Waiting for connections...
          </p>
        ) : (
          users.map((user) => (
            <div
              key={user.clientId}
              className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2.5"
            >
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-slate-950"
                style={{ backgroundColor: user.color }}
              >
                {user.name.slice(0, 1).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {user.name}
                  {user.isSelf ? ' (you)' : ''}
                </p>
                <p className="text-xs text-slate-500">
                  {user.isSelf ? 'Editing now' : 'Connected'}
                </p>
              </div>
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: user.color }}
              />
            </div>
          ))
        )}
      </div>

      <div className="border-t border-slate-800 p-4 text-xs leading-relaxed text-slate-500">
        Each person gets a colored cursor. Edits sync instantly — even on the same line.
      </div>
    </aside>
  )
}

export default CollaboratorPanel
