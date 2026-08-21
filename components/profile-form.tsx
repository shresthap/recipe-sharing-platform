"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/profile/actions";
import {
  AuthMessage,
  authButtonClassName,
  authInputClassName,
} from "@/components/auth/auth-message";

interface ProfileFormProps {
  username: string;
  fullName: string;
  bio: string;
  saved?: boolean;
}

export function ProfileForm({ username, fullName, bio, saved }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <AuthMessage
        error={state?.error}
        message={state?.error ? undefined : saved ? "Profile saved." : undefined}
      />

      <div>
        <label htmlFor="username" className="text-sm font-medium text-stone-700">
          Username
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          minLength={1}
          maxLength={64}
          pattern="[A-Za-z0-9._]+"
          defaultValue={username}
          autoComplete="username"
          className={authInputClassName}
        />
        <p className="mt-1 text-xs text-stone-400">
          Letters, numbers, periods, and underscores. Must be unique.
        </p>
      </div>

      <div>
        <label htmlFor="fullName" className="text-sm font-medium text-stone-700">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          maxLength={80}
          defaultValue={fullName}
          autoComplete="name"
          className={authInputClassName}
        />
      </div>

      <div>
        <label htmlFor="bio" className="text-sm font-medium text-stone-700">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          maxLength={300}
          rows={4}
          defaultValue={bio}
          placeholder="A short note about you and what you like to cook"
          className={`${authInputClassName} min-h-24 resize-y`}
        />
        <p className="mt-1 text-xs text-stone-400">Up to 300 characters.</p>
      </div>

      <button type="submit" disabled={isPending} className={authButtonClassName}>
        {isPending ? "Saving..." : "Save profile"}
      </button>
    </form>
  );
}
