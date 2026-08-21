import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col px-4 py-12 sm:py-16">
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
          {title}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">
          {description}
        </p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}
