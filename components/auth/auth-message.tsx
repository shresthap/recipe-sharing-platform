interface AuthMessageProps {
  error?: string;
  message?: string;
}

export function AuthMessage({ error, message }: AuthMessageProps) {
  if (error) {
    return (
      <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
        {error}
      </p>
    );
  }

  if (message) {
    return (
      <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">
        {message}
      </p>
    );
  }

  return null;
}

export const authInputClassName =
  "mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/20";

export const authButtonClassName =
  "w-full rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60";
