import { cn } from "@/lib/cn";
import type { InvitationStatus } from "@/lib/repo/invitations";

export function StatusBadge({ status }: { status: InvitationStatus }) {
  const isLive = status === "published";
  return (
    <span className={cn("badge", isLive ? "bg-moss/15 text-moss" : "bg-ink/5 text-muted")}>
      <span className={cn("h-1.5 w-1.5 rounded-full", isLive ? "bg-moss" : "bg-muted/60")} aria-hidden />
      {isLive ? "Terbit" : "Draft"}
    </span>
  );
}
