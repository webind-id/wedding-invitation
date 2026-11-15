import { cn } from "@/lib/cn";

interface EarthyDividerProps {
  className?: string;
  variant?: "olive" | "terracotta" | "minimal";
}

/**
 * Pembatas Bagian (Section Divider) Bertema Daun Kering & Earthy
 */
export function EarthyDivider({ className, variant = "olive" }: EarthyDividerProps) {
  return (
    <div className={cn("flex items-center justify-center gap-3 py-4 select-none", className)} aria-hidden="true">
      <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent via-sand-deep to-terracotta/40" />

      {/* Ranting / Ornamen Tengah */}
      <div className="flex items-center gap-1.5 text-terracotta">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 12 C8 12 16 12 20 12" stroke="#6B7A5C" strokeWidth="1.2" strokeLinecap="round" />
          <ellipse cx="9" cy="8.5" rx="3" ry="1.8" transform="rotate(-30 9 8.5)" fill="#6B7A5C" fillOpacity="0.8" />
          <ellipse cx="15" cy="8.5" rx="3" ry="1.8" transform="rotate(30 15 8.5)" fill="#6B7A5C" fillOpacity="0.8" />
          <ellipse cx="9" cy="15.5" rx="3" ry="1.8" transform="rotate(30 9 15.5)" fill="#6B7A5C" fillOpacity="0.8" />
          <ellipse cx="15" cy="15.5" rx="3" ry="1.8" transform="rotate(-30 15 15.5)" fill="#6B7A5C" fillOpacity="0.8" />
          <circle cx="12" cy="12" r="2.5" fill="#C86D51" />
        </svg>
      </div>

      <span className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent via-sand-deep to-terracotta/40" />
    </div>
  );
}
