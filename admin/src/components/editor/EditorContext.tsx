"use client";

import { createContext, useContext } from "react";
import type { Path } from "@/lib/immutable";
import type { InvitationContent } from "@/shared/contract";

export interface EditorContextValue {
  invitationId: string;
  content: InvitationContent;
  errors: Record<string, string>;
  /** Ganti nilai di path (immutable). */
  set: (path: Path, value: unknown) => void;
  /** Ganti nilai berdasarkan nilai terkini — aman untuk pembaruan async. */
  update: (path: Path, fn: (current: unknown) => unknown) => void;
}

export const EditorContext = createContext<EditorContextValue | null>(null);

export function useEditor(): EditorContextValue {
  const ctx = useContext(EditorContext);
  if (!ctx) throw new Error("useEditor harus dipakai di dalam <ContentEditor>.");
  return ctx;
}

/** Hitung error di bawah prefix tertentu (untuk badge di judul bagian). */
export function countErrors(errors: Record<string, string>, prefixes: string[]): number {
  return Object.keys(errors).filter((k) => prefixes.some((p) => k === p || k.startsWith(`${p}.`))).length;
}
