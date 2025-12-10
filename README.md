# Muryo Memo

Muryo is a small full-stack demo project that integrates a dynamic "clutter" background (p5.js + matter-js) into a React front-end, alongside a simple product management API (Express + MongoDB) on the server.

This README summarizes how the repository is organized, how to run the project locally, key architectural details, and common troubleshooting steps.

[Experience Demo Live](http://157.230.93.251/)

### Frontend
- **Framework**: React (v19.2.0) with Create React App (react-scripts v5.0.1)
- **Visuals / Physics**: p5.js (v1.1.9, instance mode) and matter-js (v0.20.0)
- **Styling**: Plain CSS (global CSS files and component CSS)
- **Animations**: p5-driven rendering for the background + CSS keyframe transitions for UI

### Development Tools (server & client)
- **Client build**: Create React App (react-scripts) — development server and bundling
- **Server**: Node.js + Express (express v5.1.0)
- **Database**: MongoDB (access via Mongoose v8.20.1)
- **Utilities**: CORS, dotenv for env vars, nodemon for server auto-reload during development
- **Linting / Formatting**: ESLint (provided via react-scripts toolchain); add config as needed
- **Deployment**: Digital Ocean

## Project structure
```
- client/
  - package.json
  - public/
    - index.html
  - src/
    - index.js
    - App.js
    - pages/
      - homepage/
        - homepage.jsx
        - homepage.css
      - products/
        - products.jsx
    - components/
      - clutter_js/ (p5 + matter modular code)
        - sketch.js         // exports initBackground({ parent, P5, Matter }) -> API ({ newPalette, remove, getColors })
        - scripts/
          - textures.js     // texture generators (bound to a p5 instance via bindTextures)
          - m_grfx.js
          - m_cloud.js
          - m_ring.js
          - m_sphere.js
          - circ.js
          - update.js       // palette switching logic only
      - background.jsx     // React wrapper that mounts/manages the p5 instance
      - shuffle.jsx        // Shuffle button component that triggers palette change
      - sidebar/
        - sidebar.jsx
        - icons/*svg

- server/
  - package.json
  - src/
    - routes/products.js
    - models/product.js
    - server.js
```

## Quick start (local development)

Prerequisites: Node.js (v16+ recommended) and a running MongoDB instance (local or Atlas).

1) Start the server

```bash
cd server
npm install
# Create a .env file with MONGO_URI (e.g. MONGO_URI=mongodb://localhost:27017/muryo)
npm start
```

By default the server listens on port 5000 (check `server/server.js` for PORT).

2) Start the client

```bash
cd client
npm install
npm start
```

The front-end dev server usually runs at `http://localhost:3000`.

3) Open the app

Visit `http://localhost:3000` in your browser and try the UI (homepage, product listing, add product).

## Key architecture notes

- The animated background is a p5 sketch running in instance mode and driven by matter-js physics. The sketch code is modularized under `client/src/components/clutter_js`.
- The original website is [here](https://spacetypegenerator.com/clutter)

- `sketch.js` provides an initializer `initBackground({ parent, P5, Matter })` that mounts a p5 canvas into a DOM container and returns a small API object exposing:
  - `newPalette()` — switch to a new color palette and attempt to regenerate textures
  - `remove()` — remove the p5 instance and clean up runner/graphics
  - `getColors()` — return current palette colors in hex

- Texture generators in `textures.js` are designed to be bound to a p5 instance using `bindTextures(p, STATE)`. This avoids relying on a global `p5` and allows safe instance-level graphics creation with `p.createGraphics()`.

- For coordinating colors between the sketch and React components there are a couple of options already in the repo:
  - `window.__clutter_instance.getColors()` and `window.__clutter_getColors()` for quick console inspection
  - a React `ColorContext` that can receive updates when the sketch palette changes (see `background.jsx` which calls the initializer and reads colors)

- To avoid double-initializing p5 (React StrictMode or accidental remounts), the sketch includes a simple singleton guard (`window.__clutter_instance`) and attempts to remove orphaned canvases on init.

## API endpoints (server)

The server exposes a simple products API implemented in `server/src/routes/products.js`:

- `GET /api/products` — list all products
- `POST /api/products` — create a new product (JSON body with product fields)
- `DELETE /api/products/:id` — delete a product by id

Ensure your client uses the correct port when calling these endpoints (`http://localhost:5000/api/products` by default). If you see CORS or 403 errors, check server CORS configuration and the client URL.

## Troubleshooting (common issues)

- CORS errors when client calls the server
  - Verify `server.js` config includes `cors()` or an explicit origin list that allows `http://localhost:3000`.

- "Cannot find module './icons/*.svg'" webpack error
  - Ensure `client/src/components/sidebar/icons/` exists and contains the required SVGs or change imports to use a supported icon library.

- "A component is changing an uncontrolled input to be controlled"
  - Make sure every form input's `value` prop corresponds to a key initialized on the `formData` object (avoid `undefined` values). The products form expects keys like `imageURL` and `description`.

- Duplicate or overlapping canvases / multiple sketches
  - Inspect the DOM for multiple `<canvas>` elements (`document.querySelectorAll('canvas')`). The sketch uses a singleton guard and also tries to remove orphaned `defaultCanvas0` elements. If multiple instances persist, ensure `initBackground()` is called only once, or call the returned `remove()` before re-initializing.

- Palette change doesn't update textures
  - Textures created with `p.createGraphics()` are cached. `newPalette()` attempts to remove old graphics and clear `pg_grfx` to force regeneration. If you still see old colors, ensure `newPalette()` runs before re-creating graphics or explicitly removes old graphics' canvases.

## Development tips and future improvements

- Consider exposing a `forceNew` option for `initBackground({ forceNew: true })` to deliberately recreate the p5 instance (useful during HMR).

- Add a tiny smoke test that mounts and unmounts `initBackground` to catch runtime regressions in CI.

- Consolidate palette definitions into a single module (e.g. `manageColor.js`) and keep `update.js` as a simple trigger to switch palettes.

- Improve type-safety by adding TypeScript types for the public API of `initBackground` and the color objects.

## Where to look in the code

- `client/src/components/clutter_js/sketch.js` — the main p5 initializer and sketch logic
- `client/src/components/clutter_js/scripts/textures.js` — texture generator helpers
- `client/src/components/background.jsx` — React wrapper that mounts the sketch and shares colors via context
- `server/src/routes/products.js` — product REST API
