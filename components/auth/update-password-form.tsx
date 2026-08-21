"use client";

import { useActionState } from "react";
import { updatePassword } from "@/app/auth/actions";
import {
  AuthMessage,
  authButtonClassName,
  authInputClassName,
} from "@/components/auth/auth-message";

export function UpdatePasswordForm() {
  const [state, formAction, isPending] = useActionState(updatePassword, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <AuthMessage error={state?.error} message={state?.message} />

      <div>
        <label htmlFor="password" className="text-sm font-medium text-stone-700">
          New password
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
      </div>

      <div>
        <label htmlFor="confirmPassword" className="text-sm font-medium text-stone-700">
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          className={authInputClassName}
        />
      </div>

      <button type="submit" disabled={isPending} className={authButtonClassName}>
        {isPending ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
