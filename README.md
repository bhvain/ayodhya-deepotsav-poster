# 🪔 Ayodhya Deepotsav — The Living Interactive Poster

> **Sardar Patel Education Campus (SPEC) — Design Challenge Deliverable**  
> *"Tamaso Ma Jyotirgamaya — Lead from Darkness to Light"*

A museum-grade, full-viewport (`100vh` / `100vw`) living interactive poster celebrating the historical origin of Diwali: the triumphant homecoming of **Bhagwan Shri Ram to Ayodhya Dham**.

---

## ✨ Key Features

- 🏛️ **Royal Temple Arch & Jharokha Framing:** Classical carved golden Torana with Stambha pillars, filigree corner brackets, and hanging brass bells.
- 🔔 **Interactive Temple Bells (Ghanta):** Hanging bells with realistic pendulum swing physics and synthesized brass acoustic harmonic overtones.
- 🪔 **Progressive 5-Stage Awakening Ritual:** Starts in dark twilight (`ambient-brightness: 0.28`); lighting the 5 ceremonial Diyas (*Dharma, Satya, Mahadeep, Prema, Shaanti*) progressively illuminates Ayodhya Dham.
- 🎙️ **Microphone Hardware Trigger:** Blow or clap into your laptop microphone to ignite the central Mahadiya with a radial golden shockwave!
- 🎆 **Interactive Cracker & Celebration Dock:**
  - ✨ *Phuljhari (Golden Sparkler):* High-velocity magnesium sparks with gravity physics.
  - 🪔 *Sarayu River Diyas:* Float lamps on the sacred water with liquid ripple physics.
  - 🏮 *Aakash Kandil (Sky Lanterns):* Release glowing paper lanterns into the celestial night sky.
  - 🎇 *Royal Fireworks:* Multi-palette celebratory firework rockets bursting over the palace.
- 🏅 **The Judge Closer — Royal *Samman Patra*:** Real-time personalization with evaluator's name, Ayodhya *Raj-Mudra* golden seal, verification token, and 1-click 2x Retina PNG download (`html2canvas`).
- 🔊 **Zero-Dependency Procedural Web Audio:** All sounds (bells, firework booms, sparkler sizzles, diya whooshes) are synthesized mathematically in real-time—zero external `.mp3` files!

---

## 🚀 Quick Start (Zero Build Required)

This project uses a single-folder CDN architecture. No Node.js or `npm install` needed.

1. Clone or download this repository.
2. Double-click **`index.html`** to open in any modern web browser (Chrome, Edge, Brave, Firefox, Safari).
3. Press **F11** for the full-screen museum installation experience!

---

## 🛠️ Tech Stack

- **Layout & Typography:** HTML5, Tailwind CSS (CDN), Custom CSS3 3D Transforms, Google Fonts (`Cinzel Decorative`, `Rozha One`, `Yatra One`, `Plus Jakarta Sans`).
- **Canvas Physics & Simulation:** Dual HTML5 `<canvas>` 2D engines (`sky-canvas` for stars, ghat micro-diyas, and Sarayu river caustics; `fx-canvas` for particle physics).
- **Sound Synthesis:** Native Web Audio API (OscillatorNode, GainNode, AnalyserNode).
- **Hardware Integration:** MediaDevices API (`getUserMedia`) for blow/clap acoustic detection.
- **Exporting:** `html2canvas` for high-resolution keepsake minting.
