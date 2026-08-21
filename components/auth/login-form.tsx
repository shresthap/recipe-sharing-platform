"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/auth/actions";
import {
  AuthMessage,
  authButtonClassName,
  authInputClassName,
} from "@/components/auth/auth-message";

interface LoginFormProps {
  initialError?: string;
  nextPath?: string;
}

export function LoginForm({ initialError, nextPath }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <AuthMessage error={state?.error ?? initialError} message={state?.message} />
      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}

      <div>
        <label htmlFor="email" className="text-sm font-medium text-stone-700">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={authInputClassName}
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm font-medium text-stone-700">
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-orange-600 hover:text-orange-700"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={authInputClassName}
        />
      </div>

      <button type="submit" disabled={isPending} className={authButtonClassName}>
        {isPending ? "Signing in..." : "Log in"}
      </button>

      <p className="text-center text-sm text-stone-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-orange-600 hover:text-orange-700">
          Sign up
        </Link>
      </p>
    </form>
  );
}
