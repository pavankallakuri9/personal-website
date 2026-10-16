# Automatic Knowledge Library — Option C

This package adds auto-discovered resources to homepage sections AND a central searchable `/library.html`.

## Initial installation (one time)

Keep the existing GitHub `pavan-profile.png` and `leadership-atlas/index.html` intact.

Place these files in the **root** of the existing repository:
- `index.html` (replace existing homepage)
- `library.html`
- `resource-library.css`
- `resource-library.js`
- `package.json`
- `vercel.json`

Create `scripts/build-library.js` in the `scripts` folder.

Commit all the files. Vercel automatically runs the Node build defined by vercel.json and publishes `dist`. You do not need to upload the `dist` folder; it is generated at deployment.

NOTE: If Vercel project settings override Build Command or Output Directory, remove those project-level overrides or set Build Command to `node scripts/build-library.js` and Output Directory to `dist`. Framework Preset: Other.

## Adding resources after setup

Upload HTML into one of these folders in GitHub:
- `research/` → Research
- `sales-mastery/` → Sales Mastery School
- `leadership/` → Leadership

The current `leadership-atlas/index.html` is also automatically indexed as Leadership and keeps its existing URL. The script also detects nested HTML files, e.g. `research/market-study/index.html`.

Each commit triggers a new Vercel deployment which copies pages to `dist`, creates `resource-catalog.json`, and updates cards on the homepage and the searchable Knowledge Library. No future changes to homepage code are necessary.

Default display title is the HTML `<title>`, with `<h1>` and filename fallbacks. Set these tags in your HTML `<head>` for a more precise library card:

```html
<meta name="library-title" content="Nigeria Motorcycle Market — 2026">
<meta name="library-description" content="Market structure, competitor insights and key trends.">
```

To omit a file from library cards, use `<meta name="library-hide" content="true">`.

For multi-file HTML projects with local CSS, JS and images, upload the **entire project folder** under its category so relative asset paths continue to work. Avoid filenames with sensitive/private information because this is a public site. Only publish material you have permission to share.

## Testing locally (optional)

Run `node scripts/build-library.js` from repository root, then serve `dist` with a local HTTP server. Opening pages directly via file:// may block loading `resource-catalog.json`.

## Current project protection

The homepage photo path is unchanged (`pavan-profile.png`). All existing homepage sections and the featured Leadership Atlas link are retained. The existing atlas resource itself is not included in this package because it is already in GitHub.
