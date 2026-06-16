'use client';
import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={styles.container}>
          <div style={styles.card}>
            <div style={styles.iconWrapper}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 style={styles.title}>Something went wrong</h2>
            <p style={styles.description}>
              We encountered an unexpected error. Please try again or refresh the page.
            </p>
            <div style={styles.actions}>
              <button onClick={this.handleReset} style={styles.retryBtn}>
                Try Again
              </button>
              <button onClick={() => window.location.reload()} style={styles.refreshBtn}>
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    padding: '2rem',
  },
  card: {
    textAlign: 'center',
    maxWidth: '420px',
    padding: '3rem 2rem',
  },
  iconWrapper: {
    color: 'var(--color-outline, #888)',
    marginBottom: '1.5rem',
    display: 'inline-block',
  },
  title: {
    fontFamily: 'var(--font-body, sans-serif)',
    fontSize: '1.25rem',
    fontWeight: 600,
    color: 'var(--color-on-surface, #1a1a1a)',
    marginBottom: '0.75rem',
  },
  description: {
    fontSize: '0.875rem',
    color: 'var(--color-outline, #666)',
    lineHeight: 1.6,
    marginBottom: '2rem',
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  retryBtn: {
    background: 'var(--color-on-surface, #1a1a1a)',
    color: 'var(--color-bg, #fff)',
    border: 'none',
    padding: '0.75rem 1.5rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'var(--font-body, sans-serif)',
  },
  refreshBtn: {
    background: 'transparent',
    color: 'var(--color-on-surface, #1a1a1a)',
    border: '1px solid var(--color-surface-high, #ddd)',
    padding: '0.75rem 1.5rem',
    fontSize: '0.75rem',
    fontWeight: 600,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontFamily: 'var(--font-body, sans-serif)',
  },
};
