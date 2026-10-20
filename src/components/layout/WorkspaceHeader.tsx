import Image from "next/image";
import { AppIcon } from "@/components/ui/AppIcon";

type WorkspaceHeaderProps = {
  email?: string | null;
  isSigningOut?: boolean;
  onSignOut: () => void;
};

export function WorkspaceHeader({
  email,
  isSigningOut = false,
  onSignOut,
}: WorkspaceHeaderProps) {
  return (
    <>
      <header className="flex min-h-[69px] items-center justify-between gap-4 border-b border-border bg-card px-5 py-3 max-[600px]:min-h-[68px] max-[600px]:pt-[calc(12px+env(safe-area-inset-top,0px))] min-[601px]:px-[max(20px,calc(5vw+env(safe-area-inset-left,0px)))] min-[601px]:pr-[max(20px,calc(5vw+env(safe-area-inset-right,0px)))]">
        <a className="flex items-center gap-3 text-foreground no-underline" href="/" aria-label="My Work List home">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary" aria-hidden="true">
            <Image src="/figma-auth/zap.svg" alt="" width={21} height={21} />
          </span>
          <span className="text-base font-extrabold leading-6">My Work List</span>
        </a>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-2 rounded-full bg-background px-3 py-2 text-[13px] leading-5 text-t1-gray-500 max-[600px]:hidden">
            <AppIcon name="userRound" />
            <span className="max-w-[min(32vw,320px)] truncate">{email}</span>
          </span>
          <button
            className="min-h-11 rounded-xl border border-border bg-card px-4 text-sm font-bold text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-wait disabled:opacity-70"
            type="button"
            onClick={onSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? "Signing Out…" : "Sign Out"}
          </button>
        </div>
      </header>
      <div className="flex items-center gap-2 px-5 pt-3 text-[13px] leading-5 text-t1-gray-500 min-[601px]:hidden">
        <AppIcon name="userRound" />
        <span className="break-all">{email}</span>
      </div>
    </>
  );
}
