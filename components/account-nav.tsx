import Link from "next/link";

interface AccountNavProps {
  active: "profile" | "saved";
}

export function AccountNav({ active }: AccountNavProps) {
  return (
    <nav className="flex gap-1 rounded-xl border border-stone-200 bg-stone-50 p-1">
      <Link
        href="/profile"
        className={accountNavLinkClassName(active === "profile")}
      >
        Profile
      </Link>
      <Link
        href="/profile/saved"
        className={accountNavLinkClassName(active === "saved")}
      >
        Saved
      </Link>
    </nav>
  );
}

function accountNavLinkClassName(isActive: boolean) {
  return `flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium transition-colors ${
    isActive
      ? "bg-white text-stone-900 shadow-sm"
      : "text-stone-600 hover:text-stone-900"
  }`;
}
