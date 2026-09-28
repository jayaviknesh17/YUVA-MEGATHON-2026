import React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-surface-950 text-surface-100">
          <div className="max-w-md w-full glass-panel rounded-2xl p-8 border border-rose-500/30 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-surface-50">Something went wrong</h2>
            <p className="text-xs text-surface-400">
              An unexpected UI runtime error occurred. You can reload the application to restore your session.
            </p>
            {this.state.error?.message && (
              <div className="p-3 bg-surface-900 rounded-lg text-left overflow-x-auto text-[11px] font-mono text-rose-300 border border-surface-800">
                {this.state.error.message}
              </div>
            )}
            <div className="pt-2">
              <Button variant="primary" onClick={this.handleReset} iconLeft={RotateCcw}>
                Reload Application
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
