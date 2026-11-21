/**
 * Main build script for the GTA 6 cover art maker.
 * 
 * This script is responsible for:
 * 1. Preparing the production output directory.
 * 2. Guarded copy of application files (`app/`) and screenshots (`screenshots/`) to the output destination.
 * 3. Constructing a project dossier using the vendor `makefun-app` library.
 * 
 * Usage:
 * Set the `MAKEFUN_OUTPUT_DIR` environment variable to define the destination directory.
 * Default output is 'out/'.
 */
import { buildDossier } from './vendor/makefun-app.js';
import * as fs from 'fs';
import * as path from 'path';

// Define the output directory from environment variable or default to 'out'
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || 'out';

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`Created output directory: ${outputDir}`);
}

/**
 * Recursively copies a directory from source to destination.
 * @param {string} src - The source directory path.
 * @param {string} dest - The destination directory path.
 */
const copyRecursive = (src: string, dest: string) => {
    if (!fs.existsSync(src)) {
        console.warn(`Source directory not found: ${src}, skipping copy.`);
        return;
    }
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyRecursive(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
    console.log(`Copied ${src} to ${dest}`);
};

// Execute copy operations, guarding the source directories
copyRecursive('app', path.join(outputDir, 'app'));
copyRecursive('screenshots', path.join(outputDir, 'screenshots'));

// Define technical capabilities and limits for the dossier
const caps = {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
};

// Generate the dossier using the vendor library
console.log('Building dossier...');
fs.writeFileSync(path.join(outputDir, 'dossier.json'), buildDossier(outputDir, caps));
console.log(`Build complete in ${outputDir}`);
