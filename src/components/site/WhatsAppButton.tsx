import { MessageCircle } from "lucide-react";
import { site } from "@/lib/site";

export function WhatsAppButton({ context }: { context?: string }) {
  const message = context
    ? `Hi, I'm interested in automatic driving lessons — ${context}`
    : "Hi, I'm interested in automatic driving lessons in Reading";

  return (
    <a
      href={`${site.whatsappHref}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-success px-4 py-3 text-sm font-semibold text-success-foreground shadow-lift transition-transform hover:-translate-y-0.5"
    >
      <MessageCircle className="h-5 w-5" aria-hidden="true" />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
}
