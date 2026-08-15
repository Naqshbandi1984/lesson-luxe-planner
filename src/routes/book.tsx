import { createFileRoute, Outlet } from "@tanstack/react-router";

// Thin layout only — /book (the form) and /book/success are independent
// full pages, not a shared parent+content layout, so this just passes
// through to whichever child route matched. All the actual page content
// lives in book.index.tsx and book.success.tsx.
export const Route = createFileRoute("/book")({
  component: () => <Outlet />,
});
