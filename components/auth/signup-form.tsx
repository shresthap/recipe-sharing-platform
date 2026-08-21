"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/app/auth/actions";
import {
  AuthMessage,
  authButtonClassName,
  authInputClassName,
} from "@/components/auth/auth-message";

export function SignupForm() {
  const [state, formAction, isPending] = useActionState(signup, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <AuthMessage error={state?.error} message={state?.message} />

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
        <p className="mt-1 text-xs text-stone-400">
          Your username and full name start as the part before @. You can change them later.
        </p>
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium text-stone-700">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          className={authInputClassName}
        />
        <p className="mt-1 text-xs text-stone-400">At least 6 characters.</p>
      </div>

      <button type="submit" disabled={isPending} className={authButtonClassName}>
        {isPending ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-sm text-stone-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-orange-600 hover:text-orange-700">
          Log in
        </Link>
      </p>
    </form>
  );
}
