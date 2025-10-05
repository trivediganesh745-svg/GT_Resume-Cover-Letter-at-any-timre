import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertIcon } from "./icons/AlertIcon";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State;

  // FIX: Reverted to a standard constructor for state initialization.
  // Both class property initialization and a previous constructor implementation
  // were causing a type inference issue where 'this.props' was not being recognized.
  // A correctly implemented constructor with super(props) resolves this.
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center">
            <div className="text-center p-8 bg-white shadow-lg rounded-lg max-w-md mx-auto">
                <AlertIcon className="w-16 h-16 text-red-500 mx-auto mb-4"/>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Oops! Something went wrong.</h1>
                <p className="text-slate-600 mb-6">
                    An unexpected error occurred. Please try refreshing the page.
                </p>
                <button
                    onClick={this.handleReload}
                    className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Reload Page
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}
