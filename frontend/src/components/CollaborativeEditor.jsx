import { useEffect, useMemo, useRef } from 'react'
import Editor from '@monaco-editor/react'
import { MonacoBinding } from 'y-monaco'
import { useRemoteCursorStyles } from '../hooks/useRemoteCursorStyles'

function CollaborativeEditor({ ytext, provider, language }) {
  const bindingRef = useRef(null)

  useRemoteCursorStyles(provider?.awareness)

  const editorOptions = useMemo(
    () => ({
      fontSize: 14,
      fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
      minimap: { enabled: true },
      wordWrap: 'on',
      scrollBeyondLastLine: false,
      automaticLayout: true,
      formatOnType: true,
      tabSize: 2,
      padding: { top: 16 },
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      renderLineHighlight: 'all',
      bracketPairColorization: { enabled: true },
    }),
    [],
  )

  const handleMount = (editor) => {
    if (!ytext || !provider) return

    const model = editor.getModel()
    if (!model) return

    try {
      bindingRef.current?.destroy()
      bindingRef.current = new MonacoBinding(
        ytext,
        model,
        new Set([editor]),
        provider.awareness,
      )
    } catch (error) {
      console.error('Failed to bind collaborative editor:', error)
    }
  }

  useEffect(() => {
    return () => {
      bindingRef.current?.destroy()
      bindingRef.current = null
    }
  }, [ytext, provider])

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      language={language}
      theme="vs-dark"
      onMount={handleMount}
      options={editorOptions}
      loading={
        <div
          style={{
            height: '100%',
            minHeight: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#1e1e1e',
            color: '#94a3b8',
            fontSize: '14px',
          }}
        >
          Loading editor...
        </div>
      }
    />
  )
}

export default CollaborativeEditor
