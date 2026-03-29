import React, { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';
import '../style/ErrorBoundary.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to console for debugging
    // You could also log to an error tracking service here (e.g., Sentry)
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container">
          <div className="error-boundary-content">
            <h1>Oops! Something went wrong</h1>
            <p>We encountered an unexpected error. Please try again or contact support if the problem persists.</p>
            {import.meta.env.DEV && (
              <details className="error-details">
                <summary>Error Details (Development Only)</summary>
                <pre>{this.state.error?.toString()}</pre>
              </details>
            )}
            <div className="error-actions">
              <button onClick={this.handleReset} className="error-button">
                Try Again
              </button>
              <a href="/Home" className="error-link">
                Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
