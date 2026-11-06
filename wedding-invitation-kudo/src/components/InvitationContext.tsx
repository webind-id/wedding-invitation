"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { couplePair, TIME_ZONES, type InvitationContent, type Person } from "@/shared/contract";

export interface InvitationValue {
  content: InvitationContent;
  /** Slug undangan; null di mode demo (buku tamu dinonaktifkan). */
  slug: string | null;
  /** Pasangan sesuai urutan headline. */
  pair: [Person, Person];
  /** "Cahya & Wahyu" */
  coupleLabel: string;
  /** "NA" */
  monogram: string;
  timeZoneLabel: string;
}

const InvitationContext = createContext<InvitationValue | null>(null);

export function InvitationProvider({
  content,
  slug,
  children,
}: {
  content: InvitationContent;
  slug: string | null;
  children: ReactNode;
}) {
  const value = useMemo<InvitationValue>(() => {
    const pair = couplePair(content);
    return {
      content,
      slug,
      pair,
      coupleLabel: `${pair[0].nickname} & ${pair[1].nickname}`,
      monogram: `${pair[0].nickname[0] ?? ""}${pair[1].nickname[0] ?? ""}`,
      timeZoneLabel: TIME_ZONES[content.timeZone].label,
    };
  }, [content, slug]);

  return <InvitationContext.Provider value={value}>{children}</InvitationContext.Provider>;
}

export function useInvitation(): InvitationValue {
  const ctx = useContext(InvitationContext);
  if (!ctx) throw new Error("useInvitation harus dipakai di dalam <InvitationProvider>.");
  return ctx;
}
