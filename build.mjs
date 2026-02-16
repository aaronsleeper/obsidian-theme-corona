#!/usr/bin/env node

/**
 * Corona Theme — Build Script
 *
 * Concatenates CSS partials in dependency order into theme.css.
 * Optionally copies to the active Obsidian vault.
 *
 * Usage:
 *   node build.mjs          # build only
 *   node build.mjs --copy   # build + copy to vault
 */

import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cssDir = join(__dirname, 'css');
const outFile = join(__dirname, 'theme.css');

// Vault path for live preview (edit to match your setup)
const vaultThemeDir = '/Users/aaronsleeper/Desktop/Vaults/Stack Overflowed/.obsidian/themes/Corona';
const vaultThemePath = join(vaultThemeDir, 'theme.css');
const vaultManifestPath = join(vaultThemeDir, 'manifest.json');
const manifestPath = join(__dirname, 'manifest.json');

// Files in concatenation order (dependency order matters)
const files = [
	'variables.css',
	'color-choices.css',
	'color-decisions-light.css',
	'color-decisions-dark.css',
	'typography.css',
	'editor.css',
	'sidebar.css',
	'tabs.css',
	'status-bar.css',
	'modals.css',
	'search.css',
	'elements.css',
	'graph.css',
	'scrollbar.css',
	'caret.css',
];

// Font imports (placed at the top of the output)
const fontImports = [
	"@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');",
	"@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@300;400;500;600;700&display=swap');",
	"@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');",
];

// Build
const parts = [
	'/* Corona Theme — Built output. Do not edit directly. */',
	'',
	...fontImports,
	'',
];

for (const file of files) {
	const filePath = join(cssDir, file);
	if (!existsSync(filePath)) {
		console.warn(`  warning: ${file} not found, skipping`);
		continue;
	}
	parts.push(readFileSync(filePath, 'utf-8'));
}

const output = parts.join('\n');
writeFileSync(outFile, output, 'utf-8');
console.log(`  built → theme.css (${(output.length / 1024).toFixed(1)} KB)`);

// Copy to vault if --copy flag or if running via npm run build
if (process.argv.includes('--copy') || process.env.npm_lifecycle_event === 'build') {
	try {
		copyFileSync(outFile, vaultThemePath);
		copyFileSync(manifestPath, vaultManifestPath);
		console.log(`  copied → ${vaultThemeDir}/`);
	} catch (err) {
		console.warn(`  warning: could not copy to vault — ${err.message}`);
	}
}
