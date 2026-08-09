// Launches the dev server (if needed), screenshots key routes at desktop + mobile
// viewports, and saves them to /screenshots. Run with: node scripts/screenshot.js
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PORT = 8080;
const BASE_URL = `http://localhost:${PORT}`;
const OUT_DIR = path.join(ROOT, "screenshots");

const ROUTES = ["/", "/pricing", "/about", "/reviews"];
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

async function isServerUp() {
  try {
    const res = await fetch(BASE_URL, { signal: AbortSignal.timeout(1500) });
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

async function waitForServer(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isServerUp()) return true;
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

async function startDevServer() {
  const [command, args] =
    process.platform === "win32"
      ? ["cmd.exe", ["/c", "npm", "run", "dev"]]
      : ["npm", ["run", "dev"]];
  const child = spawn(command, args, {
    cwd: ROOT,
    stdio: "ignore",
    detached: process.platform !== "win32",
    windowsHide: true,
  });
  child.unref();
  return child;
}

function routeToFilename(route) {
  return route === "/" ? "home" : route.replace(/^\//, "").replace(/\//g, "-");
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  let startedServer = false;
  if (!(await isServerUp())) {
    console.log(`Dev server not running on ${BASE_URL}, starting it...`);
    startDevServer();
    startedServer = true;
    const up = await waitForServer();
    if (!up) {
      console.error("Dev server did not become ready in time.");
      process.exit(1);
    }
  } else {
    console.log(`Dev server already running on ${BASE_URL}.`);
  }

  const browser = await chromium.launch();
  const results = [];

  try {
    for (const viewport of VIEWPORTS) {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();

      for (const route of ROUTES) {
        const url = `${BASE_URL}${route}`;
        await page.goto(url, { waitUntil: "networkidle" });
        await page.waitForTimeout(300); // settle animations/fonts

        const filename = `${routeToFilename(route)}-${viewport.name}.png`;
        const filePath = path.join(OUT_DIR, filename);
        await page.screenshot({ path: filePath, fullPage: true });
        results.push(filePath);
        console.log(`Saved ${filename}`);
      }

      await context.close();
    }
  } finally {
    await browser.close();
  }

  if (startedServer) {
    console.log(
      "Note: dev server was started by this script and is still running in the background."
    );
  }

  console.log(`\nDone. ${results.length} screenshots saved to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
