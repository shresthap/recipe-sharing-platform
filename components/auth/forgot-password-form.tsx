"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/app/auth/actions";
import {
  AuthMessage,
  authButtonClassName,
  authInputClassName,
} from "@/components/auth/auth-message";

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    undefined,
  );

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
      </div>

      <button type="submit" disabled={isPending} className={authButtonClassName}>
        {isPending ? "Sending link..." : "Send reset link"}
      </button>

      <p className="text-center text-sm text-stone-500">
        Remembered it?{" "}
        <Link href="/login" className="font-medium text-orange-600 hover:text-orange-700">
          Log in
        </Link>
      </p>
    </form>
  );
}
