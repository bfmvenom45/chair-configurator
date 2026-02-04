# 🪑 Gaming Chair 3D Configurator

Interactive 3D gaming chair configurator built with React, TypeScript, and Three.js.

![Gaming Chair Configurator](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Three.js](https://img.shields.io/badge/Three.js-r158-green)

## ✨ Features

- **3D Visualization** — Real-time 3D rendering with Three.js
- **Color Customization** — Change colors for seat, backrest, and base independently
- **Material Options** — Switch between leather, fabric, and velvet
- **5 Color Presets** — Midnight, Arctic, Forest, Royal, Desert
- **Animated Transitions** — Smooth GSAP animations when changing presets
- **Intro Animation** — Epic entrance animation on page load
- **Auto-rotate Views** — Automatic camera rotation when idle
- **Multiple Camera Views** — Front, side, top, and detail views
- **Interactive Controls** — Orbit controls for manual rotation

## 🚀 Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠 Tech Stack

- **React 18** — UI framework
- **TypeScript** — Type safety
- **Three.js** — 3D rendering
- **@react-three/fiber** — React renderer for Three.js
- **@react-three/drei** — Useful helpers for R3F
- **GSAP** — Animations
- **Tailwind CSS** — Styling
- **Vite** — Build tool

## 📁 Project Structure

```
├── App.tsx                 # Main app with state management
├── Gaming_chair.jsx        # 3D model component
├── types.ts                # TypeScript interfaces & presets
├── components/
│   ├── Scene.tsx           # 3D scene with lighting & animations
│   ├── ChairModel.tsx      # Chair model wrapper
│   └── ConfiguratorUI.tsx  # UI controls panel
└── public/
    └── gaming_chair.glb    # 3D model file
```

## 📝 License

MIT

---

Made with ❤️ by [dev.bushko](https://github.com/bfmvenom45)
