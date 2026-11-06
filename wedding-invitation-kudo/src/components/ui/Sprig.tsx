import { cn } from "@/lib/cn";

/** Ranting daun garis tangan — ornamen botani yang dipakai di seluruh undangan. */
export function Sprig({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      aria-hidden
      className={cn("text-moss", className)}
    >
      <path d="M60 156C58 120 56 80 62 6" />
      <path d="M60 128c-14-4-26-14-30-30 14 2 26 12 30 30Z" />
      <path d="M61 112c14-6 24-18 26-34-14 4-24 16-26 34Z" />
      <path d="M59 88c-12-6-20-18-21-32 12 4 20 16 21 32Z" />
      <path d="M61 70c12-6 19-17 20-30-11 4-19 15-20 30Z" />
      <path d="M60 48c-9-5-15-14-15-25 9 4 15 13 15 25Z" />
      <path d="M62 30c7-4 11-11 11-19-7 3-11 10-11 19Z" />
      <circle cx="62" cy="6" r="2.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Garis pembatas kecil dengan titik di tengah. */
export function Divider({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center justify-center gap-3 text-clay", className)}>
      <span className="h-px w-10 bg-current opacity-40" />
      <span className="h-1.5 w-1.5 rotate-45 bg-current" />
      <span className="h-px w-10 bg-current opacity-40" />
    </div>
  );
}
