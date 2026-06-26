import { Component } from 'react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#020617',
            color: '#f8fafc',
            padding: '2rem',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Something went wrong</h1>
          <p style={{ color: '#94a3b8', marginBottom: '1rem' }}>
            The editor hit an error. This is usually a Monaco or sync setup issue.
          </p>
          <pre
            style={{
              background: '#0f172a',
              border: '1px solid #1e293b',
              borderRadius: '12px',
              padding: '1rem',
              overflow: 'auto',
              color: '#fda4af',
              fontSize: '0.85rem',
            }}
          >
            {this.state.error?.message || String(this.state.error)}
          </pre>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: '1rem',
              background: '#22d3ee',
              color: '#020617',
              border: 'none',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
