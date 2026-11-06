"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef, type ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

/** Modal di atas <dialog> bawaan browser: fokus terkunci, Esc menutup, fokus kembali ke pemicu. */
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby={titleId}
      className="w-[min(34rem,calc(100vw-2rem))] rounded-2xl border border-line bg-card p-0 text-ink shadow-2xl backdrop:bg-ink/40 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center justify-between border-b border-line px-6 py-4">
        <h2 id={titleId} className="font-display text-xl italic">
          {title}
        </h2>
        <button type="button" onClick={onClose} aria-label="Tutup" className="rounded-lg p-1.5 text-muted hover:bg-paper hover:text-ink">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="max-h-[75vh] overflow-y-auto px-6 py-5">{children}</div>
    </dialog>
  );
}
