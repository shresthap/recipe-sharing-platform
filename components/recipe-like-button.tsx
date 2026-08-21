"use client";

import { useFormStatus } from "react-dom";
import Link from "next/link";
import { toggleRecipeLike } from "@/app/recipes/like-actions";

interface RecipeLikeButtonProps {
  recipeId: string;
  likeCount: number;
  isLiked: boolean;
  isSignedIn: boolean;
  variant?: "default" | "overlay";
}

export function RecipeLikeButton({
  recipeId,
  likeCount,
  isLiked,
  isSignedIn,
  variant = "default",
}: RecipeLikeButtonProps) {
  if (!isSignedIn) {
    return (
      <Link
        href={`/login?next=/recipes/${recipeId}`}
        className={likeControlClassName(variant, false)}
      >
        <HeartIcon filled={false} />
        <LikeCount likeCount={likeCount} pending={false} variant={variant} />
      </Link>
    );
  }

  return (
    <form action={toggleRecipeLike}>
      <input type="hidden" name="recipeId" value={recipeId} />
      <LikeSubmit likeCount={likeCount} isLiked={isLiked} variant={variant} />
    </form>
  );
}

function LikeSubmit({
  likeCount,
  isLiked,
  variant,
}: {
  likeCount: number;
  isLiked: boolean;
  variant: "default" | "overlay";
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-pressed={isLiked}
      aria-label={isLiked ? "Unlike recipe" : "Like recipe"}
      className={`${likeControlClassName(variant, isLiked)} disabled:opacity-60`}
    >
      <HeartIcon filled={isLiked} />
      <LikeCount likeCount={likeCount} pending={pending} variant={variant} />
    </button>
  );
}

function LikeCount({
  likeCount,
  pending,
  variant,
}: {
  likeCount: number;
  pending: boolean;
  variant: "default" | "overlay";
}) {
  if (variant === "overlay") {
    return <span>{pending ? "…" : likeCount}</span>;
  }

  return (
    <span>
      {pending ? "Saving..." : `${likeCount} ${likeCount === 1 ? "like" : "likes"}`}
    </span>
  );
}

function likeControlClassName(variant: "default" | "overlay", isLiked: boolean) {
  if (variant === "overlay") {
    return `inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur-sm transition-colors hover:bg-white ${
      isLiked ? "text-orange-700" : "text-stone-700"
    }`;
  }

  return `inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
    isLiked
      ? "border-orange-200 bg-orange-50 text-orange-800 hover:bg-orange-100"
      : "border-stone-200 text-stone-700 hover:bg-stone-50"
  }`;
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
