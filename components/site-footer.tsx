export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-stone-500 sm:flex-row sm:px-6">
        <p>&copy; {new Date().getFullYear()} RecipeShare. Share what you cook.</p>
        <p className="text-stone-400">Built with Next.js &amp; Supabase</p>
      </div>
    </footer>
  );
}
