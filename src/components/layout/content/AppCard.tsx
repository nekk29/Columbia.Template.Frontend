import { cn } from "@/utils/cn";

export interface AppCardProps {
  className?: string;
  children?: React.ReactNode;
}

export function AppCard({ className, children }: AppCardProps) {
  return (
    <div className={cn("w-full mx-auto bg-background-100/50 rounded-lg shadow-md overflow-hidden border border-base-200", className ?? "")}>
      {children}
    </div>
  );
}
