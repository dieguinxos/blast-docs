# Blast Docs

Public customer documentation portal for Blast scripts. Includes Blast Boombox 0.5.0 and the free Blast Camera 0.1.0 resource. English and Spanish. Static HTML, CSS and JavaScript; no build dependencies.

## Local preview

Run `python -m http.server 8782 --bind 127.0.0.1` from this folder and open `http://localhost:8782/`.

## GitHub Pages

Enable Settings → Pages → Deploy from a branch → `main` → `/ (root)`. GitHub's built-in Pages deployment publishes the static site whenever `main` changes. No custom workflow or build step is needed.

## Editing

- `content.js`: paired English/Spanish page content and customer examples.
- `camera.js`: paired English/Spanish Camera guides; installation, hosting, gameplay, integrations and administration.
- `portal.js`: general docs pages, product registry and scoped product routes.
- `app.js`: routing, navigation, search, copy buttons, language and inventory tabs.
- `styles.css`: layout and branding.
- `downloads/`: public inventory definitions and inventory images only.

Use relative paths for assets and hash routes so the site works below the repository path on GitHub Pages. Keep the resource source code, server configuration, private endpoints, keys, databases and customer data outside this repository.

This repository documents the product; it does not distribute the resource. Documentation issues belong in the issue tracker. Account, purchase or server-specific support should use the seller's support channel.

The bundled Inter fonts include their original license in `assets/fonts/LICENSE.txt`.
