import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', minHeight: '200px', padding: '2rem',
        textAlign: 'center', gap: '12px',
      }}>
        <span style={{ fontSize: '2.5rem' }}>⚠️</span>
        <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--green-800)' }}>
          Something went wrong
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '400px' }}>
          {this.state.error?.message || 'An unexpected error occurred.'}
        </p>
        <button
          onClick={() => this.setState({ hasError: false, error: null })}
          style={{
            background: 'var(--green-700)', color: '#fff',
            border: 'none', borderRadius: 'var(--radius-md)',
            padding: '8px 20px', fontSize: '14px', cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </div>
    )
  }
}
