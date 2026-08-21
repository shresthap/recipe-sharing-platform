import { Suspense } from "react";
import Link from "next/link";
import { RecipeCard } from "@/components/recipe-card";
import { HomePageSkeleton, RecipeGridSkeleton } from "@/components/skeletons";
import { getRecipeLikeStates } from "@/lib/likes";
import { browseCategories, isRecipeCategory } from "@/lib/recipe-constants";
import { getRecipes } from "@/lib/recipes";
import { createClient } from "@/lib/supabase/server";
import type { RecipeCategory } from "@/lib/supabase/types";

interface HomePageProps {
  searchParams: Promise<{ q?: string; category?: string }>;
}

function browseHref(query: string, category: string) {
  const params = new URLSearchParams();
  if (query) {
    params.set("q", query);
  }
  if (category) {
    params.set("category", category);
  }
  const search = params.toString();
  return search ? `/?${search}` : "/";
}

export default function Home({ searchParams }: HomePageProps) {
  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeContent searchParams={searchParams} />
    </Suspense>
  );
}

async function HomeContent({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category: categoryParam } = await searchParams;
  const query = q?.trim() ?? "";
  const category =
    categoryParam && isRecipeCategory(categoryParam) ? categoryParam : undefined;

  return (
    <>
      <section className="border-b border-stone-200 bg-gradient-to-b from-orange-50/80 to-stone-50">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Discover &amp; share recipes you love
            </h1>
            <p className="mt-3 text-base leading-relaxed text-stone-600 sm:text-lg">
              Browse community recipes, save your favorites, and upload your own
              creations — all in one place.
            </p>
          </div>

          <form className="mt-8 flex flex-col gap-3 sm:flex-row" action="/" method="get">
            {category ? <input type="hidden" name="category" value={category} /> : null}
            <div className="relative flex-1">
              <label htmlFor="search" className="sr-only">
                Search recipes
              </label>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">
                <SearchIcon />
              </span>
              <input
                id="search"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Search by title, description, or ingredient..."
                className="w-full rounded-xl border border-stone-200 bg-white py-3 pl-10 pr-4 text-sm text-stone-900 placeholder:text-stone-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-orange-600 sm:w-auto"
            >
              Search
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap gap-2">
          {browseCategories.map((item) => {
            const isActive = item === "All" ? !category : category === item;
            const href = browseHref(query, item === "All" ? "" : item);

            return (
              <Link
                key={item}
                href={href}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-stone-900 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {item}
              </Link>
            );
          })}
        </div>

        <Suspense
          key={`${query}-${category ?? "all"}`}
          fallback={<HomeRecipesFallback category={category} query={query} />}
        >
          <HomeRecipes query={query} category={category} />
        </Suspense>
      </section>
    </>
  );
}

function HomeRecipesFallback({
  category,
  query,
}: {
  category?: RecipeCategory;
  query: string;
}) {
  return (
    <>
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-stone-900">
          {category ?? (query ? "Search results" : "Latest recipes")}
        </h2>
        <p className="mt-1 text-sm text-stone-500">Loading recipes...</p>
      </div>
      <RecipeGridSkeleton />
    </>
  );
}

async function HomeRecipes({
  query,
  category,
}: {
  query: string;
  category?: RecipeCategory;
}) {
  const [recipes, supabase] = await Promise.all([
    getRecipes({ query, category }),
    createClient(),
  ]);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const likeStates = await getRecipeLikeStates(
    recipes.map((recipe) => recipe.id),
    user?.id,
  );
  const shareHref = user ? "/recipes/new" : "/login?next=/recipes/new";
  const hasFilters = Boolean(query || category);
  const emptyMessage = hasFilters
    ? "No recipes match that search. Try a different keyword or category."
    : "No recipes yet. Be the first to share one.";

  return (
    <>
      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-stone-900">
            {category ?? (query ? "Search results" : "Latest recipes")}
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
            {query ? ` matching “${query}”` : " from the community"}
          </p>
        </div>
        <Link
          href={shareHref}
          className="hidden rounded-lg border border-stone-200 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 sm:block"
        >
          Share a recipe
        </Link>
      </div>

      {recipes.length > 0 ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              likeCount={likeStates[recipe.id]?.likeCount ?? 0}
              isLiked={likeStates[recipe.id]?.isLiked ?? false}
              isSignedIn={Boolean(user)}
            />
          ))}
        </div>
      ) : (
        <p className="mt-8 rounded-xl border border-dashed border-stone-300 bg-white px-6 py-10 text-center text-sm text-stone-500">
          {emptyMessage}
        </p>
      )}

      <div className="mt-10 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-8 text-center">
        <p className="text-sm font-medium text-stone-700">Ready to share your cooking?</p>
        <p className="mt-1 text-sm text-stone-500">
          {user
            ? "Add a recipe with ingredients, steps, and an optional photo URL."
            : "Sign in to upload recipes with ingredients, steps, and photos."}
        </p>
        <Link
          href={user ? "/recipes/new" : "/signup"}
          className="mt-4 inline-block rounded-lg bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600"
        >
          {user ? "Share a recipe" : "Get started"}
        </Link>
      </div>
    </>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
