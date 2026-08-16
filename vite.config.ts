import { defineConfig, type PluginOption, type UserConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

// Plain Vite config (previously wrapped by @lovable.dev/vite-tanstack-config,
// removed now that this project is no longer connected to Lovable). Plugin
// order is preserved exactly as the old wrapper had it — tsConfigPaths before
// tanstackStart before viteReact matches TanStack Start's own documented
// quickstart order, and reordering risks JSX-transform/route-tree-generation
// issues.
export default defineConfig(async ({ command, mode }): Promise<UserConfig> => {
  const plugins: PluginOption[] = [
    // Dev-only devtools panel. Options match what the old Lovable wrapper
    // passed (not devtools()'s own defaults) so behavior doesn't change.
    ...(mode === "development"
      ? [
          devtools({
            logging: false,
            eventBusConfig: { enabled: false },
            enhancedLogs: { enabled: false },
            consolePiping: { enabled: false },
            removeDevtoolsOnBuild: false,
            injectSource: { enabled: true },
          }),
        ]
      : []),
    tailwindcss(),
    tsConfigPaths({ projects: ["./tsconfig.json"] }),
    tanstackStart({
      importProtection: {
        behavior: "error",
        client: { files: ["**/server/**"], specifiers: ["server-only"] },
      },
      // Redirect TanStack Start's bundled server entry to src/server.ts (our
      // SSR error wrapper) — nitro/vite builds from this. See src/server.ts.
      server: { entry: "server" },
    }),
  ];

  // Build-only, and lazily imported so a plain `vite dev` never needs to
  // resolve `nitro`. defaultPreset only matters when no platform is
  // auto-detected — there's no vercel.json here, so Vercel's own env vars
  // win via nitro's zero-config detection on the real deploy; this fallback
  // only fires for a from-scratch local build with no platform env vars set.
  if (command === "build") {
    const { nitro } = await import("nitro/vite");
    plugins.push(nitro({ defaultPreset: "cloudflare-module" }));
  }

  plugins.push(viteReact());

  return {
    plugins,
    css: { transformer: "lightningcss" },
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: ["react", "react-dom", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime"],
      ignoreOutdatedRequests: true,
    },
    server: { host: "::", port: 8080 },
  };
});
