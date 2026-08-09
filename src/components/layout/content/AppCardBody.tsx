export interface AppCardBodyProps {
  className?: string;
  children?: React.ReactNode;
}

export function AppCardBody({ className, children }: AppCardBodyProps) {
  return (
    <div className={className ?? "p-6"}>
      {children}
    </div>
  );
}
