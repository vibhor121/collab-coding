export function getStoredUserName() {
  return localStorage.getItem('codecollab-username') || ''
}

export function getSessionUserName() {
  return sessionStorage.getItem('codecollab-session-name') || ''
}

export function getDefaultUserName() {
  const tabName = getSessionUserName()
  if (tabName) return tabName

  // Invite links in a new tab should not reuse the host's saved name.
  const params = new URLSearchParams(window.location.search)
  if (params.get('room')) {
    return `Guest-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
  }

  const savedName = getStoredUserName()
  if (savedName) return savedName

  return `Guest-${Math.random().toString(36).slice(2, 6).toUpperCase()}`
}

export function storeUserName(name) {
  sessionStorage.setItem('codecollab-session-name', name)
  localStorage.setItem('codecollab-username', name)
}

export function resolveUniqueDisplayName(baseName, awareness, selfClientId) {
  const usedNames = new Set()

  awareness.getStates().forEach((state, clientId) => {
    if (clientId !== selfClientId && state.user?.name) {
      usedNames.add(state.user.name)
    }
  })

  if (!usedNames.has(baseName)) return baseName

  let suffix = 2
  while (usedNames.has(`${baseName} (${suffix})`)) {
    suffix += 1
  }

  return `${baseName} (${suffix})`
}
