'use client';
import React from 'react';

// Error tracking (can be connected to Sentry, LogRocket, etc.)
class ErrorTracker {
  private isProduction = process.env.NODE_ENV === 'production';

  captureException(error: Error, context?: Record<string, unknown>) {
    // Log to console in development
    if (!this.isProduction) {
      console.error('[ErrorBoundary]', error, context);
    }
    // In production, send to error tracking service
    // Example: Sentry.captureException(error, { extra: context });
  }
}

const errorTracker = new ErrorTracker();

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  { hasError: boolean; error: Error | null; errorId: string }
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorId: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.setState({ errorId });
    errorTracker.captureException(error, {
      errorId,
      componentStack: errorInfo.componentStack,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorId: '' });
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
            {this.state.errorId && (
              <p style={styles.errorId}>Error ID: {this.state.errorId}</p>
            )}
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

const styles: Record<string, React.CSSProperties> = {
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
  errorId: {
    fontSize: '0.75rem',
    color: 'var(--color-outline, #999)',
    marginBottom: '1.5rem',
    fontFamily: 'monospace',
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
