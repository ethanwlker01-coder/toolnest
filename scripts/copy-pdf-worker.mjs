import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
const candidates = [resolve("node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs"), resolve("node_modules/pdfjs-dist/build/pdf.worker.min.mjs")];
const source = candidates.find(existsSync);
if (!source) { console.warn("PDF.js worker was not found; PDF rendering/OCR will show a setup error until pdfjs-dist is installed."); process.exit(0); }
const destination = resolve("public/pdf.worker.min.mjs"); mkdirSync(dirname(destination), { recursive: true }); copyFileSync(source, destination); console.log("Copied PDF.js worker to public/pdf.worker.min.mjs");
