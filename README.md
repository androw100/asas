# ASAS — Luxury 3D Furniture & Architectural Living

A premium, responsive frontend-only showcase website for **ASAS**, featuring an interactive 3D furniture customizer built with **React**, **Three.js** (`@react-three/fiber`, `@react-three/drei`), **GSAP**, and **Vite**.

---

## ✦ Key Features

1. **Editorial Luxury Identity & Art Direction**:
   - Palette: Charcoal (`#171715`), Deep Surface (`#201F1B`), Warm Ivory (`#F1EEE7`), Muted Accent Bronze (`#C4A477`), and fine subtle borders (`rgba(241, 238, 231, 0.12)`).
   - Architectural typography: Manrope with support for Arabic typography (Alexandria).
   - Generous whitespace, refined dividers, and subtle transitions.

2. **Interactive 3D Product Viewer (`ProductViewer.jsx`)**:
   - Orbit controls: 360° drag-to-rotate with smooth damping.
   - Zoom with strict limits (`minDistance: 1.2`, `maxDistance: 6.5`) preventing clip-through.
   - Pitch limits (`maxPolarAngle`) preventing the camera from dipping beneath the floor.
   - Preset camera perspectives: **3/4 Perspective**, **Front View**, **Side View**, **Top View**.
   - One-click **Reset View** control.
   - Ground contact shadows (`ContactShadows`) and soft city environment reflections.

3. **Real-Time Finish & Material Customization (`FinishPicker.jsx` & `materialMapping.js`)**:
   - Switch finishes (Natural Oak, Dark Walnut, Charcoal Ebony, Raw Terracotta, Bleached Ash, etc.) in real time.
   - Deep scene and material cloning prevents mutation of shared Three.js cache.
   - Configurable keyword mapping per product targeting specific material groups (wood, upholstery, stone, metal).
   - Preserves base roughness, metalness, and texture maps.

4. **Resilient Loading & Fallback States**:
   - Pre-flight model availability check.
   - **Deliberate Fallback Card**: If a model is missing or WebGL is disabled, displays clear instructions on where to place `.glb` files.
   - **Local File Loader**: Instant drag-and-drop / file selector allows the project owner to test any local `.glb` model immediately in the browser.
   - **Procedural 3D Mockup Mode**: Allows complete testing of 3D orbit, zoom, camera presets, and finish swatches even before 3D model files are placed.
   - Architectural vector SVGs as thumbnails when render images are pending.

5. **GSAP Motion & Accessibility**:
   - Editorial hero entrance animations and scroll-triggered product reveals via `gsap.context()`.
   - Complete unmount cleanup preventing React Strict Mode duplication.
   - Full support for `prefers-reduced-motion` via `useReducedMotion()`.

6. **Page Routes**:
   - `/` — Editorial Home with Hero, Curated Collections, Brand Philosophy, and 3D Studio Banner.
   - `/collections` — Full catalog with responsive category filter pills (`All`, `Seating`, `Tables`, `Lounge`, `Decor`).
   - `/product/:id` — Immersive product detail, 3D customizer, specifications, and private inquiry action.
   - `*` — Refined 404 Not Found page with redirection back to catalog.

---

## ✦ Getting Started

### Development Server
```bash
npm install
npm run dev
```
Visit `http://localhost:5173` in your browser.

### Production Build & Preview
```bash
npm run build
npm run preview
```

### Linter Check
```bash
npm run lint
```

---

## ✦ 3D Models & Assets Structure

### Model Files:
Place `.glb` files inside `public/models/`:
- `public/models/chair.glb` (The Atelier Chair)
- `public/models/black-wood-cane-dining-chair.glb` (Black Wood Cane Dining Chair)
- `public/models/highback-windsor-chair.glb` (Highback Windsor Sculptural Chair)
- `public/models/table.glb` (The Monolith Dining Table)
- `public/models/sofa.glb` (Kanso Minimalist Daybed)
- `public/models/vessel.glb` (Kyoto Bronze Vessel)

### Imagery:
Place WebP or AVIF thumbnail renders in `public/images/`. If an image is missing, the site gracefully falls back to an architectural vector graphic.

---

## ✦ Project Architecture
```
src/
├── components/
│   ├── Navbar.jsx               # Sticky header with ASAS wordmark & mobile drawer
│   ├── Footer.jsx               # Minimalist editorial footer
│   ├── Hero.jsx                 # Editorial typography & GSAP entrance
│   ├── ProductCard.jsx          # Catalog card with architectural SVG fallback
│   ├── ProductGrid.jsx          # Responsive grid with GSAP ScrollTrigger
│   ├── ProductViewer.jsx        # Three.js Canvas, OrbitControls, Camera presets
│   ├── FinishPicker.jsx         # Swatch selection with accessible ARIA radio
│   ├── ProceduralFurniture.jsx  # Interactive procedural 3D preview
│   ├── LoadingState.jsx         # Luxury bronze spinner overlay
│   ├── ModelErrorState.jsx      # Fallback UI with local GLB loader & instructions
│   └── ThreeErrorBoundary.jsx   # Error boundary for WebGL / GLTF errors
├── data/
│   └── products.js              # Product metadata, camera defaults, finishes, mappings
├── hooks/
│   └── useReducedMotion.js      # Detects prefers-reduced-motion preference
├── utils/
│   └── materialMapping.js       # Target-specific material cloning & color application
├── styles/
│   ├── tokens.css               # Design tokens, color system, spacing, shadows
│   ├── global.css               # Base reset, typography, scrollbar, accessibility
│   ├── layout.css               # Containers, section spacing, badges
│   └── components.css           # Buttons, cards, viewer toolbar, swatches
├── pages/
│   ├── Home.jsx                 # Home landing page
│   ├── Collections.jsx          # Filterable catalog
│   ├── ProductDetails.jsx       # 3D studio & customizer view
│   └── NotFound.jsx             # 404 page
├── App.jsx                      # Router & code-split lazy routes
└── main.jsx                     # Entry point
```
