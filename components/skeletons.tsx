import { Skeleton } from "@/components/ui/skeleton";

export function HeaderSkeleton() {
  return (
    <div className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <Skeleton className="h-8 w-36" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  );
}

export function RecipeCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex justify-between pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

export function RecipeGridSkeleton() {
  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }, (_, index) => (
        <RecipeCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function HomePageSkeleton() {
  return (
    <>
      <section className="border-b border-stone-200 bg-gradient-to-b from-orange-50/80 to-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <Skeleton className="h-10 w-3/4 max-w-md" />
          <Skeleton className="mt-4 h-5 w-full max-w-lg" />
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Skeleton className="h-12 flex-1 rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl sm:w-28" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-8 w-24 rounded-full" />
          ))}
        </div>
        <div className="mt-8">
          <Skeleton className="h-7 w-40" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>
        <RecipeGridSkeleton />
      </section>
    </>
  );
}

export function RecipeDetailSkeleton() {
  return (
    <article className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-9 w-3/4" />
        <Skeleton className="mt-3 h-4 w-40" />
        <Skeleton className="mt-6 h-16 w-full" />
        <Skeleton className="mt-8 aspect-[2/1] w-full rounded-xl" />
        <Skeleton className="mt-10 h-6 w-32" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </article>
  );
}

export function FormPageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6 sm:py-12">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-3 h-4 w-72" />
      <div className="mt-8 space-y-4 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}

export function ProfilePageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-10 sm:py-12">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-7 w-28" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <Skeleton className="mt-8 h-10 w-full rounded-xl" />
      <div className="mt-6 space-y-4 rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    </div>
  );
}

export function AuthPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-12 sm:py-16">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-3 h-4 w-56" />
        <div className="mt-6 space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      </div>
    </div>
  );
}
