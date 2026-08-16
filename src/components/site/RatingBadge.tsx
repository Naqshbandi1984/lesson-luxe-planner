import { Star } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function RatingBadge({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm",
        tone === "dark"
          ? "border-ink-foreground/20 bg-ink-foreground/10 text-ink-foreground"
          : "border-border bg-card",
        className,
      )}
    >
      <span className="flex" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-accent text-accent" />
        ))}
      </span>
      <span className="font-semibold">{site.rating}</span>
      <span className={tone === "dark" ? "text-ink-foreground/65" : "text-muted-foreground"}>
        from {site.reviewCountLabel}
      </span>
    </div>
  );
}
