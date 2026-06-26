import { useState } from 'react'
import {
  buildRoomUrl,
  generateRoomId,
  getDefaultUserName,
  getRoomFromUrl,
  getSessionUserName,
  storeUserName,
} from '../utils/constants'

function HomeScreen({ onJoin }) {
  const [userName, setUserName] = useState(getDefaultUserName())
  const [roomInput, setRoomInput] = useState(getRoomFromUrl())
  const [error, setError] = useState('')

  const handleCreateRoom = () => {
    const trimmedName = userName.trim()
    if (!trimmedName) {
      setError('Please enter your display name first.')
      return
    }

    const roomId = generateRoomId()
    storeUserName(trimmedName)
    onJoin({ roomId, userName: trimmedName })
  }

  const handleJoinRoom = () => {
    const trimmedName = userName.trim()
    const trimmedRoom = roomInput.trim().toUpperCase()

    if (!trimmedName) {
      setError('Please enter your display name.')
      return
    }

    if (!trimmedRoom) {
      setError('Please enter a room code to join.')
      return
    }

    storeUserName(trimmedName)
    onJoin({ roomId: trimmedRoom, userName: trimmedName })
  }

  const pendingRoom = getRoomFromUrl()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-4 py-10 sm:px-6">
        {pendingRoom ? (
          <div className="mx-auto mb-6 max-w-2xl rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-center text-sm text-cyan-100">
            You have an invite to room <strong>{pendingRoom}</strong>. Enter your name below and
            click <strong>Join room</strong>.
          </div>
        ) : null}

        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-lg font-bold text-slate-950 shadow-lg shadow-cyan-500/20">
            CC
          </div>
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">Coding Platform</p>
          <h1 className="mt-3 text-4xl font-semibold text-white sm:text-5xl">CodeCollab</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-400 sm:text-lg">
            Build and share code together in real time — like Google Docs, but for programming.
            Open two browser tabs or share a room link with friends.
          </p>
        </div>

        <div className="mx-auto grid w-full max-w-4xl gap-6 lg:grid-cols-2">
          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur">
            <h2 className="text-xl font-semibold text-white">Start coding together</h2>
            <p className="mt-2 text-sm text-slate-400">
              Create a new room, copy the invite link, and everyone edits the same file live.
            </p>

            <label className="mt-6 block text-sm text-slate-300">
              Your display name
              <input
                value={userName}
                onChange={(event) => {
                  setUserName(event.target.value)
                  setError('')
                }}
                placeholder="e.g. Rayan"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
              />
              <p className="mt-2 text-xs text-slate-500">
                Use a different name in each browser tab when testing on the same computer.
              </p>
            </label>

            {error ? <p className="mt-3 text-sm text-rose-400">{error}</p> : null}

            <button
              type="button"
              onClick={handleCreateRoom}
              className="mt-6 w-full rounded-2xl bg-gradient-to-r from-cyan-400 to-violet-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:opacity-90"
            >
              Create new room
            </button>
          </section>

          <section className="rounded-[2rem] border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur">
            <h2 className="text-xl font-semibold text-white">Join existing room</h2>
            <p className="mt-2 text-sm text-slate-400">
              Got a room code from a friend? Enter it here and jump into the session.
            </p>

            <label className="mt-6 block text-sm text-slate-300">
              Room code
              <input
                value={roomInput}
                onChange={(event) => {
                  setRoomInput(event.target.value.toUpperCase())
                  setError('')
                }}
                placeholder="e.g. ABC123"
                className="mt-2 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 uppercase tracking-[0.2em] text-white outline-none transition focus:border-violet-500"
              />
            </label>

            <button
              type="button"
              onClick={handleJoinRoom}
              className="mt-6 w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:border-slate-600"
            >
              Join room
            </button>
          </section>
        </div>

        <div className="mx-auto mt-10 grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          {[
            ['Real-time sync', 'When someone types, everyone sees it instantly.'],
            ['Same-line editing', 'Yjs merges changes smartly — no broken code.'],
            ['Live cursors', 'See where teammates are editing with colored cursors.'],
          ].map(([title, text]) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-sm text-slate-400"
            >
              <p className="font-medium text-white">{title}</p>
              <p className="mt-2">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomeScreen
