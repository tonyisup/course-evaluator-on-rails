// esbuild.config.js

// This configuration file is used by the `jsbundling-rails` gem.
// It tells esbuild how to bundle your JavaScript/TypeScript assets.

const esbuild = require('esbuild');
const railsEnvironment = process.env.RAILS_ENV || 'development';

// Define the entry points. 'application' is the default name that
// `javascript_include_tag` looks for when no specific name is given.
const entryPoints = [
  'application.tsx', // Your main React entry point
  // Add other entry points here if you have them, e.g., 'controllers.ts' for Stimulus
];

// Define output directory. The `jsbundling-rails` gem typically expects
// compiled assets in `app/assets/builds/`.
const outdir = 'app/assets/builds/';

// Base configuration object
const baseConfig = {
  entryPoints: entryPoints,
  bundle: true, // Enables bundling
  outdir: outdir,
  // Use 'false' for production to ensure all code is bundled.
  // For development, you might use 'true' for source maps or other dev-specific options.
  sourcemap: railsEnvironment === 'development',
  // Define global variables or modules if needed
  // Define global objects if your code relies on them, like window.MyGlobalVar
  // global: { MyGlobalVar: 'someValue' },
  // Define how modules are resolved. 'node' is standard for npm packages.
  // Note: React 18+ uses new resolution strategies, ensure your tsconfig.json is correct.
  platform: 'browser', // Target browsers
  format: 'esm', // Use ES Modules format
  splitting: true, // Enable code splitting for better performance
  assetNames: '[name]-[hash]', // Name output files with hashes for cache busting
  chunkNames: ['chunks/[name]-[hash]'], // Name chunk files
  mainFields: ['module', 'main'], // Fields to look for in package.json
  // Preserve the original file names for entry points, rather than mangling them.
  // This ensures `application.js` is the output for `application.tsx`.
  // Note: `assetNames` with `[name]` might not always preserve the `.tsx` extension if not handled carefully.
  // Often, esbuild handles this by default or requires specific configurations.
  // For `jsbundling-rails`, the default is usually `[name]-[hash]` which works well with cache busting.
};

// If running in watch mode (e.g., during development with `rails server`)
// esbuild-rails handles this automatically via `bin/rails dev:record_build`
// and `bin/rails dev:web_console` which manage esbuild compilation.
// You generally don't need to add watch logic here directly unless you're
// running esbuild commands manually.

module.exports = baseConfig;