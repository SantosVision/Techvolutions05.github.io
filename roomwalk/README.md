# Lumenstep (Willow Hall walkthrough)

A self-contained browser demo: walk a four-room sample home without apps, accounts, API keys, or paid 3D hosts.

Product name **Lumenstep** is original to this demo (not a trademark copy of commercial tour tools).

## What’s in the tour

- Landing page with pitch and **Enter the tour**
- Interactive Three.js walkthrough of Willow Hall: **living, kitchen, bedroom, bathroom**
- Click / tap doorway hotspots, the floor-plan minimap, or the room chips to change rooms
- Optional info pins on furniture
- Drag to look; WASD / arrows to walk; on-screen stick on phones

No bundler. No `npm`. Static HTML, CSS, and JavaScript plus a vendored [Three.js](https://threejs.org/) build (`vendor/three.min.js`, MIT).

## Open locally

From this folder:

```bash
cd roomwalk
python3 -m http.server 8765
```

Then open [http://127.0.0.1:8765/](http://127.0.0.1:8765/) for the landing page, or [http://127.0.0.1:8765/tour.html](http://127.0.0.1:8765/tour.html) for the walkthrough.

You can also serve the **site root** and visit `/roomwalk/`:

```bash
python3 -m http.server 8765
# open http://127.0.0.1:8765/roomwalk/
```

A local server is recommended (some browsers restrict `file://` for canvas / modules). Google Fonts load from the network if available; the tour still runs with system font fallbacks.

Deep links into a room:

- `tour.html#living`
- `tour.html#kitchen`
- `tour.html#bedroom`
- `tour.html#bathroom`

## GitHub Pages path (after merge)

This repo is a Jekyll GitHub Pages site. `roomwalk/` is plain static files (no Liquid), so Jekyll copies it through.

Once this branch is merged and Pages has rebuilt, the demo is at:

- **User / custom-domain site:** `https://<site-host>/roomwalk/`
- **This repository as a project site:** `https://santosvision.github.io/Techvolutions05.github.io/roomwalk/`

If the site uses the custom host from `_config.yml` (`TheFirstLayer.com`), the path is:

`https://thefirstlayer.com/roomwalk/`

Tour page: `.../roomwalk/tour.html`

## Layout

```
roomwalk/
  index.html          Landing (Lumenstep)
  tour.html           3D walkthrough
  css/landing.css
  css/tour.css
  js/tour.js
  vendor/three.min.js
  README.md
```

This folder is isolated from the rest of the Jekyll theme. It does not change posts, layouts, or site config.

## Credits

- [Three.js](https://threejs.org/) r160.1 (MIT)
- Fonts: [Fraunces](https://fonts.google.com/specimen/Fraunces) and [Outfit](https://fonts.google.com/specimen/Outfit) via Google Fonts
- Interiors are generated in the browser (procedural materials + simple furniture), not photographed scans
