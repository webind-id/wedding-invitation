import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Divider } from "../klenteng/Ornaments";

interface SectionHeadingProps {
  id: string;
  title: string;
  /** script = Pinyon Script besar; display = Cinzel kapital berjarak lebar. */
  variant: "script" | "display";
  /** Teks pengantar di bawah pemisah. */
  lead?: ReactNode;
  /** Teks kecil (font sans) di bawah judul, tanpa pemisah. */
  note?: string;
  showDivider?: boolean;
  className?: string;
}

export function SectionHeading({ id, title, variant, lead, note, showDivider = true, className }: SectionHeadingProps) {
  return (
    <div data-reveal="up" className={className}>
      <h2 id={id} className={variant === "script" ? "script-title" : "display-title"}>
        {title}
      </h2>
      {note && <p className="small-ui mt-1.5">{note}</p>}
      {showDivider && <Divider />}
      {lead && <div className={cn("lead", !showDivider && "mt-3.5")}>{lead}</div>}
    </div>
  );
}
