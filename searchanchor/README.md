# SearchAnchor Studio

A self-contained Flutter web demo: Material 3 **SearchBar** + **SearchAnchor** type-ahead over a hardcoded catalog of 36 Material widgets.

No accounts, no API keys, no network calls for search. Origin clone of the original Studio app was not available here, so this is an equivalent offline catalog built to the same spec (empty / popular / loading / suggestions / no-results / select / clear).

## What’s in the demo

- `SearchAnchor.bar` as the search field
- Type-ahead over ~36 Material widgets (buttons, navigation, inputs, pickers, …)
- **Empty** query shows recent searches (if any) and **popular** widgets
- Typing shows SearchAnchor’s **loading** indicator, then **suggestions** or **no-results**
- **Select** a hit (or a popular chip) to open a live preview
- **Clear** resets the query and the selection

## Open locally

Flutter SDK (stable, with web enabled):

```bash
cd searchanchor/app
flutter pub get
flutter run -d chrome
```

`flutter run` serves the app at the web root (`/`). Use that for development.

You can also serve the **built** Pages output, but this folder is compiled with a project-Pages `<base href>`. From a parent directory that exposes that path:

```bash
# Example: copy or symlink this folder to
#   <serve-root>/Techvolutions05.github.io/searchanchor/
python3 -m http.server 8765
# open http://127.0.0.1:8765/Techvolutions05.github.io/searchanchor/
```

## Rebuild the Pages bundle

From the Flutter project:

```bash
cd searchanchor/app
flutter build web --release \
  --base-href "/Techvolutions05.github.io/searchanchor/" \
  --no-web-resources-cdn
```

Then copy `app/build/web/` into `searchanchor/` (keep `app/` and this README). CanvasKit is bundled so the SPA does not need the gstatic CDN.

## GitHub Pages path (after merge)

This repo is a Jekyll GitHub Pages site. `searchanchor/` is a Flutter web SPA. `_config.yml` sets `layout: null` for this folder so the site-wide Beautiful Jekyll `layout: page` default does not wrap `index.html`. The folder itself is not excluded; only `searchanchor/app` (Dart source) is excluded so Jekyll does not publish the Flutter project tree.

Once this branch is merged and Pages has rebuilt, the demo is at:

- **This repository as a project site:** https://santosvision.github.io/Techvolutions05.github.io/searchanchor/

The Flutter `<base href>` is `/Techvolutions05.github.io/searchanchor/`, which matches that project-Pages URL. A custom-domain site rooted at `/` would need a rebuild with `--base-href "/searchanchor/"`.

## Layout

```
searchanchor/
  index.html              Flutter web entry (Pages)
  flutter.js
  flutter_bootstrap.js
  main.dart.js
  canvaskit/              bundled renderer
  assets/
  icons/
  app/                    Flutter source (not published)
    lib/main.dart
    lib/widget_catalog.dart
    web/
    pubspec.yaml
  README.md
```

This folder is isolated from the rest of the Jekyll theme. It does not change posts or layouts. Site config only adds a `searchanchor` defaults scope (`layout: null`).

## Credits

- [Flutter](https://flutter.dev/) Material 3 SearchBar / SearchAnchor
- Widget catalog is a static, in-app list (not the Flutter API docs site)
