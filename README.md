# 🪔 Ayodhya Deepotsav — The Living Interactive Poster

> **Sardar Patel Education Campus (SPEC) — Design Challenge Deliverable**  
> *"Tamaso Ma Jyotirgamaya — Lead from Darkness to Light"*
>
> 🌐 **Live Interactive Production:** [https://bhvain.github.io/ayodhya-deepotsav-poster/](https://bhvain.github.io/ayodhya-deepotsav-poster/)  
> 📁 **GitHub Repository:** [https://github.com/bhvain/ayodhya-deepotsav-poster](https://github.com/bhvain/ayodhya-deepotsav-poster)

A museum-grade, full-viewport (`100dvh` / `100vw`) living interactive poster celebrating the historical origin of Diwali: the triumphant homecoming of **Bhagwan Shri Ram to Ayodhya Dham**.

---

## ✨ Zero-to-Advanced Features & Architectural Innovations

### 1. 🏛️ Royal Mandir Architecture & Sacred Geometry
- **Rotating Surya Mandala / Sri Yantra:** Celestial gold geometric mandala rotating smoothly in the stratosphere, symbolizing the Solar Dynasty (*Suryavansh*).
- **Nagara Architecture Ram Mandir Silhouette:** Multi-tiered spires (*Shikharas*) with illuminated sacred sanctuary windows (*Jharokhas*).
- **Flapping Saffron Victory Dhwaja:** Dynamic waving flag atop the central sanctum sanctorum (*Garbhagriha*).
- **Torana Arch with 5 Ceremonial Hanging Bells:** Ornate brass temple bells with realistic clappers, suspended on chains with natural pendulum swing physics.

### 2. 🔔 Physical Acoustics & Procedural Audio Engine
- **6-Modal Bronze Bell Resonance:** Built with Web Audio API synthesizing 6 inharmonic vibrational modes (`[1.0, 2.0, 3.01, 4.15, 5.43, 6.78]`) with dual-rate decay and beating partial vibrato for real temple bell timbre.
- **Ambient Vedic Tanpura Drone:** Synthesizes a continuous ~136.1 Hz sacred Om fundamental with fifths, octaves, and subtle organic beating without requiring any external `.mp3` files.
- **Explosive Detonation Acoustics:** Realistic sub-bass kick + high-frequency transient burst for fireworks, ascending pitch whistle for rocket climbs, and pink-noise crackle for sparklers.

### 3. 🎇 Advanced 3D Particle Physics Engine
- **True 3D Spherical Fireworks:** Particles simulated with 3D spherical velocity coordinates (`x, y, z`), perspective scale attenuation, realistic air drag, weeping willow gravity drift, and atmospheric sky flash bloom (`skyFlashBloom`).
- **Branching Magnesium Sparkler Dendrites:** High-velocity golden sparklers with randomized sub-branching spark dendrites simulating genuine incandescent pyrotechnics.
- **Liquid Wave Caustics & Sarayu Diyas:** Floating earthen lamps creating dynamic expanding wake ripples atop the shimmering holy river Sarayu.
- **Thermal Buoyant Sky Lanterns (Aakash Kandil):** Atmospheric hot-air paper lanterns drifting gracefully into the celestial stars with gentle wind oscillation.

### 4. 📱 Mobile & Tablet Ultra-Smooth Optimization
- **GPU-Cached Diya Sprite System:** Eliminates `createRadialGradient()` CPU execution from the hot animation loop by pre-rendering a 32x32 offscreen radial sprite and blitting it via hardware-accelerated GPU `drawImage()`. Maintains locked 60 FPS on mobile chips!
- **Dynamic DPR Clamping:** Automatically limits Canvas DPR to `1.25` on mobile devices and `2.0` on desktop, preventing thermal throttling on high-resolution Retina displays.
- **Gyroscope 3D Parallax Tilt:** Uses native `DeviceOrientationEvent` (beta/gamma) to tilt the temple architecture, background mandala, and lighting layers in response to real physical phone movement.
- **`100dvh` & Safe Area Insets:** Prevents bottom buttons and altar diyas from being clipped by dynamic mobile address bars or home swipe gesture indicators.

### 5. 🎙️ Hardware Mic Awakening & The Judge Closer
- **Hardware Microphone Ignition:** Real-time Web Audio Analyser node detects claps or breath to trigger the golden radial shockwave, igniting all 5 diyas simultaneously with celebratory rocket salutes.
- **The Royal *Shri Raghav Samman Patra*:** Live personalization modal allowing the evaluating judge to enter their name, generating a personalized Sanskrit certificate of honour with a 24K gold Raj-Mudra seal, unique token, and 2x Retina PNG download via `html2canvas`.

---

## 🚀 Quick Start (Zero Build Required)

This project runs on a single-folder zero-build architecture. No Node.js or `npm install` needed.

1. Clone or download this repository.
2. Double-click **`index.html`** to open in any modern web browser (Chrome, Edge, Brave, Firefox, Safari).
3. Press **F11** for the full-screen interactive museum experience!

---

## 🛠️ Technology Stack

- **Markup & Styling:** HTML5, Tailwind CSS (CDN), Custom CSS3 3D Shaders, Google Fonts (`Cinzel Decorative`, `Rozha One`, `Yatra One`, `Plus Jakarta Sans`).
- **Canvas Physics & Simulation:** Dual HTML5 `<canvas>` 2D engines (`sky-canvas` for stars, ghat micro-diyas, and Sarayu river caustics; `fx-canvas` for particle physics).
- **Sound Synthesis:** Native Web Audio API (OscillatorNode, GainNode, BiquadFilterNode, AnalyserNode).
- **Hardware Integration:** MediaDevices API (`getUserMedia`) for blow/clap acoustic detection, DeviceOrientation API for mobile tilt parallax, Vibration API for haptic taps.
- **Exporting:** `html2canvas` for high-resolution keepsake minting.
