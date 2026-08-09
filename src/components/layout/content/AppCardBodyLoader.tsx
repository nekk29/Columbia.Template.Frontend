import { Skeleton } from "@/components/tailgrids/core/skeleton";

export function AppCardBodyLoader() {
  return (
    <div className="space-y-12">
      <div className="w-full flex flex-wrap justify-center p-2">
        <Skeleton className="h-1 w-1/2" />
      </div>
    </div>
  );
}
