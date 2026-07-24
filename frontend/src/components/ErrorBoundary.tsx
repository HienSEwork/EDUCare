import React from "react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  resetKey?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Page rendering failed", error, info.componentStack);
  }

  componentDidUpdate(previousProps: ErrorBoundaryProps) {
    if (this.state.hasError && previousProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
          <div className="w-full max-w-lg rounded-[2rem] border border-pink-200 bg-white p-8 text-center shadow-[0_18px_50px_rgba(236,72,153,0.12)] dark:border-indigo-400/20 dark:bg-slate-900">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 text-2xl dark:bg-indigo-900">!</div>
            <h1 className="mt-5 text-2xl font-bold text-slate-900 dark:text-white">Trang này đang gặp sự cố</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
              Dữ liệu của bạn vẫn an toàn. Hãy thử tải lại trang hoặc quay về trang chủ.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button className="rounded-full bg-pink-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-pink-700" onClick={() => window.location.reload()}>
                Tải lại trang
              </button>
              <a className="rounded-full border border-pink-200 bg-white px-5 py-2.5 text-sm font-bold text-pink-700 hover:bg-pink-50 dark:border-indigo-500 dark:bg-slate-800 dark:text-indigo-200" href="/">
                Về trang chủ
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
