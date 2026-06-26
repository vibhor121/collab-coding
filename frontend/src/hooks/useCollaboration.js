import { useEffect, useRef, useState } from 'react'
import * as Y from 'yjs'
import { SocketIOProvider } from 'y-socket.io'
import { SERVER_URL, getUserColor, resolveUniqueDisplayName } from '../utils/constants'

export function useCollaboration({ roomId, userName }) {
  const [status, setStatus] = useState('connecting')
  const [synced, setSynced] = useState(false)
  const [users, setUsers] = useState([])
  const [displayName, setDisplayName] = useState(userName)
  const [collaboration, setCollaboration] = useState(null)
  const [connectionError, setConnectionError] = useState('')
  const baseNameRef = useRef(userName)

  useEffect(() => {
    baseNameRef.current = userName
    setDisplayName(userName)
  }, [userName])

  useEffect(() => {
    if (!roomId || !userName) return undefined

    let active = true
    const doc = new Y.Doc()
    const ytext = doc.getText('monaco')
    const provider = new SocketIOProvider(
      SERVER_URL,
      roomId,
      doc,
      { autoConnect: true },
      { transports: ['websocket', 'polling'] },
    )

    const localColor = getUserColor(doc.clientID)

    const applyDisplayName = () => {
      const uniqueName = resolveUniqueDisplayName(
        baseNameRef.current,
        provider.awareness,
        provider.awareness.clientID,
      )

      const currentName = provider.awareness.getLocalState()?.user?.name
      if (currentName === uniqueName) {
        if (active) setDisplayName(uniqueName)
        return
      }

      provider.awareness.setLocalStateField('user', {
        name: uniqueName,
        color: localColor,
      })

      if (active) {
        setDisplayName(uniqueName)
      }
    }

    const updateUsers = () => {
      if (!active) return

      applyDisplayName()

      const states = provider.awareness.getStates()
      const nextUsers = []

      states.forEach((state, clientId) => {
        if (!state.user) return
        nextUsers.push({
          clientId,
          name: state.user.name,
          color: state.user.color || getUserColor(clientId),
          isSelf: clientId === provider.awareness.clientID,
        })
      })

      nextUsers.sort((a, b) => {
        if (a.isSelf) return -1
        if (b.isSelf) return 1
        return a.name.localeCompare(b.name)
      })

      setUsers(nextUsers)
    }

    const onStatus = ({ status: nextStatus }) => {
      if (!active) return
      setStatus(nextStatus)
      if (nextStatus === 'connected') {
        setConnectionError('')
        updateUsers()
      }
    }

    const onSync = (isSynced) => {
      if (!active) return
      setSynced(isSynced)
      if (isSynced) {
        updateUsers()
      }
    }

    const onConnectionError = () => {
      if (!active) return
      setConnectionError(
        `Cannot reach server at ${SERVER_URL}. Start the backend with: cd backend && npm run dev`,
      )
      setStatus('disconnected')
    }

    applyDisplayName()
    provider.on('status', onStatus)
    provider.on('sync', onSync)
    provider.on('connection-error', onConnectionError)
    provider.awareness.on('update', updateUsers)

    updateUsers()
    setCollaboration({ doc, ytext, provider })

    return () => {
      active = false
      provider.off('status', onStatus)
      provider.off('sync', onSync)
      provider.off('connection-error', onConnectionError)
      provider.awareness.off('update', updateUsers)
      provider.destroy()
      doc.destroy()
      setCollaboration(null)
      setUsers([])
      setStatus('connecting')
      setSynced(false)
      setConnectionError('')
    }
  }, [roomId, userName])

  return {
    doc: collaboration?.doc,
    ytext: collaboration?.ytext,
    provider: collaboration?.provider,
    status,
    synced,
    users,
    displayName,
    connectionError,
  }
}
