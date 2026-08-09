import { Star } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

export function RatingBadge({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-sm",
        className,
      )}
    >
      <span className="flex" aria-hidden="true">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-accent text-accent" />
        ))}
      </span>
      <span className="font-semibold">{site.rating}</span>
      <span className="text-muted-foreground">from {site.reviewCount} reviews</span>
    </div>
  );
}
