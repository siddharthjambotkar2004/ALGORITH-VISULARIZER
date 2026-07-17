import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full p-8 text-center space-y-4 glass-dark rounded-[2.5rem] border border-white/10">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 text-3xl font-black">
            !
          </div>
          <h2 className="text-2xl font-black text-white">Visualization failed</h2>
          <p className="text-slate-400 max-w-md">
            Something went wrong while rendering the visualization. Please try a different input or algorithm.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-2 rounded-xl bg-primary/20 text-primary font-bold hover:bg-primary/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
