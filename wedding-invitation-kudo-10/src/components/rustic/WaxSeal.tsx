import { cn } from "@/lib/cn";

interface WaxSealProps {
  monogram?: string;
  size?: number;
  className?: string;
  variant?: "terracotta" | "olive" | "gold";
  showBranch?: boolean;
}

/**
 * Komponen Cap Lilin Fisik (Wax Seal) Tradisional
 * Memberikan sentuhan elegan, personal, dan rustic pada amplop / kartu undangan.
 */
export function WaxSeal({
  monogram = "W & C",
  size = 56,
  className,
  variant = "terracotta",
  showBranch = true,
}: WaxSealProps) {
  const bgStyles = {
    terracotta:
      "bg-gradient-to-br from-[#DD7A5D] via-[#C86D51] to-[#98442B] text-amber-100 shadow-[0_6px_16px_rgba(152,68,43,0.38),inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.3)]",
    olive:
      "bg-gradient-to-br from-[#7D8F6D] via-[#6B7A5C] to-[#414E36] text-emerald-100 shadow-[0_6px_16px_rgba(65,78,54,0.35),inset_0_2px_4px_rgba(255,255,255,0.35),inset_0_-2px_4px_rgba(0,0,0,0.3)]",
    gold:
      "bg-gradient-to-br from-[#DEC08A] via-[#C59B58] to-[#8C6928] text-amber-50 shadow-[0_6px_16px_rgba(140,105,40,0.4),inset_0_2px_4px_rgba(255,255,255,0.45),inset_0_-2px_4px_rgba(0,0,0,0.3)]",
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center rounded-full select-none transition-transform duration-300",
        bgStyles[variant],
        className,
      )}
      style={{
        width: size,
        height: size,
      }}
      aria-hidden="true"
    >
      {/* Bentuk lelehan lilin alami di pinggiran (Organic Dripped Rim) */}
      <div className="absolute inset-1 rounded-full border border-white/25 border-dashed" />

      {/* Cincin Dalam Emboss */}
      <div className="relative flex items-center justify-center rounded-full border-2 border-white/30 p-1 w-[80%] h-[80%] shadow-inner">
        {showBranch && (
          <svg
            viewBox="0 0 32 32"
            fill="none"
            className="absolute inset-0 w-full h-full opacity-35"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1" strokeDasharray="2 3" />
            <path d="M16 4 C14 10 14 22 16 28" stroke="currentColor" strokeWidth="0.8" />
            <ellipse cx="13" cy="10" rx="3" ry="1.8" transform="rotate(-30 13 10)" fill="currentColor" />
            <ellipse cx="19" cy="14" rx="3" ry="1.8" transform="rotate(25 19 14)" fill="currentColor" />
            <ellipse cx="13" cy="18" rx="3" ry="1.8" transform="rotate(-25 13 18)" fill="currentColor" />
            <ellipse cx="19" cy="22" rx="3" ry="1.8" transform="rotate(20 19 22)" fill="currentColor" />
          </svg>
        )}

        {/* Monogram Timbul */}
        <span
          className="relative z-10 font-serif font-bold tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]"
          style={{
            fontSize: `${Math.round(size * 0.28)}px`,
            lineHeight: 1,
          }}
        >
          {monogram}
        </span>
      </div>
    </div>
  );
}
