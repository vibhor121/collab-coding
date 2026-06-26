import { useEffect } from 'react'
import { getUserColor } from '../utils/constants'

export function useRemoteCursorStyles(awareness) {
  useEffect(() => {
    if (!awareness) return undefined

    const styleEl = document.createElement('style')
    styleEl.setAttribute('data-remote-cursors', 'true')
    document.head.appendChild(styleEl)

    const updateStyles = () => {
      const states = awareness.getStates()
      let css = `
        .yRemoteSelection {
          opacity: 0.35;
        }
        .yRemoteSelectionHead {
          position: absolute;
          border-left: 2px solid;
          border-top: 2px solid;
          border-bottom: 2px solid;
          height: 100%;
          box-sizing: border-box;
        }
      `

      states.forEach((state, clientId) => {
        if (clientId === awareness.clientID) return
        const color = state.user?.color || getUserColor(clientId)
        css += `
          .yRemoteSelection-${clientId} {
            background-color: ${color}40;
          }
          .yRemoteSelectionHead-${clientId} {
            border-color: ${color};
          }
        `
      })

      styleEl.textContent = css
    }

    awareness.on('update', updateStyles)
    updateStyles()

    return () => {
      awareness.off('update', updateStyles)
      styleEl.remove()
    }
  }, [awareness])
}
