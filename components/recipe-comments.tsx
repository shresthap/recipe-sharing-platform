"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  addRecipeComment,
  deleteRecipeComment,
  updateRecipeComment,
} from "@/app/recipes/comment-actions";
import {
  AuthMessage,
  authButtonClassName,
  authInputClassName,
} from "@/components/auth/auth-message";
import type { RecipeComment } from "@/lib/comments";

interface RecipeCommentsProps {
  recipeId: string;
  comments: RecipeComment[];
  currentUserId?: string;
}

export function RecipeComments({
  recipeId,
  comments,
  currentUserId,
}: RecipeCommentsProps) {
  return (
    <section className="mt-10 border-t border-stone-200 pt-8">
      <h2 className="text-lg font-semibold text-stone-900">
        Comments
        <span className="ml-2 text-sm font-normal text-stone-500">
          ({comments.length})
        </span>
      </h2>

      {currentUserId ? (
        <CommentForm
          key={comments.at(-1)?.id ?? "empty"}
          recipeId={recipeId}
        />
      ) : (
        <p className="mt-4 text-sm text-stone-600">
          <Link
            href={`/login?next=/recipes/${recipeId}`}
            className="font-medium text-orange-700 hover:text-orange-800"
          >
            Log in
          </Link>{" "}
          to leave a comment.
        </p>
      )}

      {comments.length > 0 ? (
        <ul className="mt-6 space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={`${comment.id}-${comment.updatedAt}`}
              recipeId={recipeId}
              comment={comment}
              isAuthor={currentUserId === comment.userId}
            />
          ))}
        </ul>
      ) : (
        <p className="mt-6 text-sm text-stone-500">No comments yet.</p>
      )}
    </section>
  );
}

function CommentItem({
  recipeId,
  comment,
  isAuthor,
}: {
  recipeId: string;
  comment: RecipeComment;
  isAuthor: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-stone-900">{comment.authorName}</p>
          <p className="text-xs text-stone-500">
            {formatCommentDate(comment.createdAt)}
            {wasCommentEdited(comment) ? " · Edited" : ""}
          </p>
        </div>
        {isAuthor && !isEditing ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-xs font-medium text-orange-700 hover:text-orange-800"
            >
              Edit
            </button>
            <form action={deleteRecipeComment}>
              <input type="hidden" name="recipeId" value={recipeId} />
              <input type="hidden" name="commentId" value={comment.id} />
              <button
                type="submit"
                className="text-xs font-medium text-red-700 hover:text-red-800"
              >
                Delete
              </button>
            </form>
          </div>
        ) : null}
      </div>

      {isEditing ? (
        <EditCommentForm
          recipeId={recipeId}
          comment={comment}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-stone-800">
          {comment.body}
        </p>
      )}
    </li>
  );
}

function EditCommentForm({
  recipeId,
  comment,
  onCancel,
}: {
  recipeId: string;
  comment: RecipeComment;
  onCancel: () => void;
}) {
  const [state, formAction, isPending] = useActionState(updateRecipeComment, undefined);

  return (
    <form action={formAction} className="mt-3 flex flex-col gap-3">
      <input type="hidden" name="recipeId" value={recipeId} />
      <input type="hidden" name="commentId" value={comment.id} />
      <AuthMessage error={state?.error} />
      <label htmlFor={`edit-comment-${comment.id}`} className="sr-only">
        Edit comment
      </label>
      <textarea
        id={`edit-comment-${comment.id}`}
        name="body"
        required
        maxLength={1000}
        rows={3}
        defaultValue={comment.body}
        className={`${authInputClassName} min-h-20 resize-y`}
      />
      <div className="flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isPending}
          className={`${authButtonClassName} sm:w-auto`}
        >
          {isPending ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={isPending}
          className="rounded-lg border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function CommentForm({ recipeId }: { recipeId: string }) {
  const [state, formAction, isPending] = useActionState(addRecipeComment, undefined);

  return (
    <form action={formAction} className="mt-4 flex flex-col gap-3">
      <input type="hidden" name="recipeId" value={recipeId} />
      <AuthMessage error={state?.error} />
      <label htmlFor="comment-body" className="sr-only">
        Comment
      </label>
      <textarea
        id="comment-body"
        name="body"
        required
        maxLength={1000}
        rows={3}
        placeholder="Share a tip or ask a question..."
        className={`${authInputClassName} min-h-20 resize-y`}
      />
      <button
        type="submit"
        disabled={isPending}
        className={`${authButtonClassName} sm:w-auto`}
      >
        {isPending ? "Posting..." : "Post comment"}
      </button>
    </form>
  );
}

function formatCommentDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function wasCommentEdited(comment: RecipeComment) {
  return (
    new Date(comment.updatedAt).getTime() - new Date(comment.createdAt).getTime() >
    1000
  );
}
