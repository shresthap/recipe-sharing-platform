import { RecipeGridSkeleton } from "@/components/skeletons";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <Skeleton className="h-10 w-full max-w-md rounded-xl" />
      <Skeleton className="mt-8 h-8 w-48" />
      <Skeleton className="mt-2 h-4 w-64" />
      <RecipeGridSkeleton />
    </div>
  );
}
