export const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'

export const USER_COLORS = [
  '#22d3ee',
  '#a78bfa',
  '#f472b6',
  '#34d399',
  '#fbbf24',
  '#fb7185',
  '#60a5fa',
  '#4ade80',
]

export const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'json', label: 'JSON' },
]

export function getUserColor(clientId) {
  return USER_COLORS[Math.abs(clientId) % USER_COLORS.length]
}

export function generateRoomId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export function getRoomFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get('room')?.trim().toUpperCase() || ''
}

export function buildRoomUrl(roomId) {
  const url = new URL(window.location.href)
  url.searchParams.set('room', roomId)
  return url.toString()
}

export {
  getStoredUserName,
  getSessionUserName,
  getDefaultUserName,
  storeUserName,
  resolveUniqueDisplayName,
} from './userName'
