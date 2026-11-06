"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { moveItem, removeItem, type Path } from "@/lib/immutable";
import { useEditor } from "./EditorContext";

interface ListEditorProps<T> {
  path: Path;
  items: T[];
  /** Nama satuan untuk label tombol, mis. "acara". */
  noun: string;
  max: number;
  min?: number;
  create: () => T;
  itemKey: (item: T, index: number) => string;
  title: (item: T, index: number) => string;
  children: (item: T, index: number) => ReactNode;
}

/** Daftar item yang bisa ditambah, dihapus, dan diurutkan ulang. */
export function ListEditor<T>({ path, items, noun, max, min = 0, create, itemKey, title, children }: ListEditorProps<T>) {
  const { set } = useEditor();

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={itemKey(item, i)} className="rounded-xl border border-line bg-paper/40">
          <div className="flex items-center gap-2 border-b border-line px-4 py-2">
            <p className="min-w-0 flex-1 truncate text-sm font-semibold">{title(item, i)}</p>
            <button type="button" onClick={() => set(path, moveItem(items, i, i - 1))} disabled={i === 0} aria-label={`Naikkan ${noun} ${i + 1}`} className="rounded-lg p-1.5 text-muted hover:bg-card hover:text-ink disabled:opacity-30">
              <ArrowUp className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => set(path, moveItem(items, i, i + 1))} disabled={i === items.length - 1} aria-label={`Turunkan ${noun} ${i + 1}`} className="rounded-lg p-1.5 text-muted hover:bg-card hover:text-ink disabled:opacity-30">
              <ArrowDown className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => set(path, removeItem(items, i))} disabled={items.length <= min} aria-label={`Hapus ${noun} ${i + 1}`} className="rounded-lg p-1.5 text-muted hover:bg-danger/10 hover:text-danger disabled:opacity-30">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-4 p-4">{children(item, i)}</div>
        </div>
      ))}
      <button type="button" onClick={() => set(path, [...items, create()])} disabled={items.length >= max} className="btn-outline btn-sm">
        <Plus className="h-3.5 w-3.5" aria-hidden /> Tambah {noun}
      </button>
    </div>
  );
}
