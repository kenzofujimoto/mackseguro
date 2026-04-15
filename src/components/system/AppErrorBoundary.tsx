import { Component, type ErrorInfo, type ReactNode } from "react";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export default class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  public constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[AppErrorBoundary] Unhandled UI error", error, errorInfo);
  }

  public render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <section className="bg-[var(--color-bg-surface)] px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
          Ocorreu um erro inesperado
        </h1>
        <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
          Recarregue a página para tentar novamente.
        </p>
        <button
          type="button"
          className="btn-dark btn-sm mt-6"
          onClick={() => window.location.reload()}
        >
          Recarregar página
        </button>
      </section>
    );
  }
}
