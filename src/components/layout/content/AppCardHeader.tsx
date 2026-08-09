export interface AppCardHeaderProps {
  title: string;
  subTitle: string;
  children?: React.ReactNode;
}

export function AppCardHeader({ title, subTitle, children }: AppCardHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-base-200 bg-background-100/50 flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-xs text-gray-200 mt-0.5">{subTitle}</p>
      </div>
      {children}
    </div>
  );
}
