export interface AppContentProps {
  children?: React.ReactNode;
}

export function AppContent({ children }: AppContentProps) {
  return (
    <main className="flex-1 h-full overflow-auto p-5 bg-background-50">
      {children}
    </main>
  );
}
