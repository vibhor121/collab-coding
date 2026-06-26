import { useState } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import HomeScreen from './components/HomeScreen'
import Workspace from './components/Workspace'
import {
  buildRoomUrl,
  getRoomFromUrl,
  getSessionUserName,
} from './utils/constants'

function getInitialSession() {
  const roomFromUrl = getRoomFromUrl()
  const storedName = getSessionUserName()

  if (roomFromUrl && storedName) {
    return {
      roomId: roomFromUrl,
      userName: storedName,
      inviteUrl: buildRoomUrl(roomFromUrl),
    }
  }

  return null
}

function App() {
  const [session, setSession] = useState(getInitialSession)

  const handleJoin = ({ roomId, userName }) => {
    const inviteUrl = buildRoomUrl(roomId)
    window.history.replaceState({}, '', inviteUrl)
    setSession({ roomId, userName, inviteUrl })
  }

  const handleLeave = () => {
    sessionStorage.removeItem('codecollab-session-name')
    window.history.replaceState({}, '', window.location.pathname)
    setSession(null)
  }

  return (
    <ErrorBoundary>
      {session ? (
        <Workspace
          roomId={session.roomId}
          userName={session.userName}
          inviteUrl={session.inviteUrl}
          onLeave={handleLeave}
        />
      ) : (
        <HomeScreen onJoin={handleJoin} />
      )}
    </ErrorBoundary>
  )
}

export default App
