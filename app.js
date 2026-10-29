/**
 * Ayodhya Deepotsav — Interactive Web Poster Core Script
 * Step 2 Foundation + Step 3 Ram ki Paidi Ghat & Sarayu Canvas Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  const fxCanvas = document.getElementById('fx-canvas');
  const skyCanvas = document.getElementById('sky-canvas');
  const posterStage = document.getElementById('poster-stage');
  const personalizeBtn = document.getElementById('personalize-btn');
  const personalizeModal = document.getElementById('personalize-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const applyNameBtn = document.getElementById('apply-name-btn');
  const exportPngBtn = document.getElementById('export-png-btn');
  const judgeNameInput = document.getElementById('judge-name-input');
  const judgeDeptInput = document.getElementById('judge-dept-input');

  let stageWidth = 0;
  let stageHeight = 0;
  let skyCtx = null;
  let fxCtx = null;

  // =========================================================================
  // STEP 3: SKY & SARAYU WATER & GHAT MICRO-DIYA ENGINE (MOBILE-OPTIMIZED)
  // =========================================================================
  const stars = [];
  const ghatMicroDiyas = [];
  const distantLanterns = [];
  let waterWaveTime = 0;
  let diyaGlowSprite = null;

  // Pre-render glowing diya sprite on an offscreen canvas to eliminate
  // thousands of createRadialGradient() CPU allocations every frame
  function initDiyaSprite() {
    diyaGlowSprite = document.createElement('canvas');
    diyaGlowSprite.width = 32;
    diyaGlowSprite.height = 32;
    const sCtx = diyaGlowSprite.getContext('2d');
    const grad = sCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255, 180, 0, 0.95)');
    grad.addColorStop(0.35, 'rgba(255, 110, 0, 0.4)');
    grad.addColorStop(0.7, 'rgba(255, 60, 0, 0.12)');
    grad.addColorStop(1, 'transparent');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 32, 32);
  }
  initDiyaSprite();

  function initAtmosphere() {
    stars.length = 0;
    ghatMicroDiyas.length = 0;
    distantLanterns.length = 0;

    const isMobile = stageWidth < 640;
    const starCount = isMobile ? 45 : 85;
    const diyaCount = isMobile ? 48 : 120;
    const lanternCount = isMobile ? 6 : 12;

    // 1. Twinkling Starlight Points in Upper Atmosphere
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * stageWidth,
        y: Math.random() * (stageHeight * 0.52),
        radius: Math.random() * 1.4 + 0.4,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 0.03 + 0.01,
        phase: Math.random() * Math.PI * 2,
        color: Math.random() > 0.4 ? '#fff4d1' : (Math.random() > 0.5 ? '#ffd700' : '#d2f3fc')
      });
    }

    // 2. Micro-Diyas placed along the Ram ki Paidi Ghat steps
    const ghatTopY = stageHeight * 0.72;
    for (let i = 0; i < diyaCount; i++) {
      const stepTier = Math.floor(Math.random() * 4);
      const yPos = ghatTopY + (stepTier * (stageHeight * 0.065)) + (Math.random() * 8);
      ghatMicroDiyas.push({
        x: Math.random() * stageWidth,
        y: yPos,
        baseRadius: Math.random() * 1.6 + 1.0,
        flickerSpeed: Math.random() * 0.08 + 0.03,
        phase: Math.random() * Math.PI * 2,
        hue: Math.random() > 0.3 ? '#ff9900' : '#ffd700'
      });
    }

    // 3. Ambient Drifting Distant Sky Lanterns (Aakash Kandil)
    for (let i = 0; i < lanternCount; i++) {
      distantLanterns.push({
        x: Math.random() * stageWidth,
        y: Math.random() * stageHeight,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.35 + 0.15),
        size: Math.random() * 4 + 3,
        alpha: Math.random() * 0.6 + 0.25,
        flicker: Math.random() * Math.PI
      });
    }
  }

  function renderSkyAndWater() {
    if (!skyCtx || stageWidth === 0) return;

    skyCtx.clearRect(0, 0, stageWidth, stageHeight);

    // --- A. Render Twinkling Celestial Stars ---
    for (let star of stars) {
      star.phase += star.twinkleSpeed;
      const currentAlpha = star.alpha + Math.sin(star.phase) * 0.25;
      skyCtx.fillStyle = star.color;
      skyCtx.globalAlpha = Math.max(0.1, Math.min(1, currentAlpha));
      skyCtx.beginPath();
      skyCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      skyCtx.fill();
    }

    // --- B. Render Distant Drifting Lanterns ---
    for (let lantern of distantLanterns) {
      lantern.x += lantern.vx;
      lantern.y += lantern.vy;
      lantern.flicker += 0.05;

      // Wrap around top/sides
      if (lantern.y < -20) {
        lantern.y = stageHeight + 10;
        lantern.x = Math.random() * stageWidth;
      }
      if (lantern.x < -20) lantern.x = stageWidth + 20;
      if (lantern.x > stageWidth + 20) lantern.x = -20;

      const lanternGlow = Math.sin(lantern.flicker) * 0.15 + 0.85;
      skyCtx.save();
      skyCtx.globalAlpha = lantern.alpha * lanternGlow;
      skyCtx.fillStyle = '#ffb703';
      
      // Mini lantern rectangle body
      skyCtx.fillRect(lantern.x, lantern.y, lantern.size, lantern.size * 1.3);
      // Flame core dot
      skyCtx.fillStyle = '#fffdf0';
      skyCtx.beginPath();
      skyCtx.arc(lantern.x + lantern.size / 2, lantern.y + lantern.size * 0.7, lantern.size * 0.25, 0, Math.PI * 2);
      skyCtx.fill();
      skyCtx.restore();
    }

    // --- C. Render Sarayu River Liquid Shimmer & Reflections (Lower 28%) ---
    const riverY = stageHeight * 0.72;
    const riverHeight = stageHeight - riverY;
    waterWaveTime += 0.035;

    // River dark deep water base
    const riverGrad = skyCtx.createLinearGradient(0, riverY, 0, stageHeight);
    riverGrad.addColorStop(0, 'rgba(11, 27, 61, 0.6)');
    riverGrad.addColorStop(0.5, 'rgba(6, 16, 38, 0.85)');
    riverGrad.addColorStop(1, 'rgba(3, 8, 20, 0.98)');
    skyCtx.fillStyle = riverGrad;
    skyCtx.globalAlpha = 1.0;
    skyCtx.fillRect(0, riverY, stageWidth, riverHeight);

    // Sarayu Golden Wave Caustics (Fewer wave passes on mobile for 60fps)
    const isMobile = stageWidth < 640;
    const waveRows = isMobile ? 8 : 16;
    skyCtx.lineWidth = 1.2;

    for (let row = 0; row < waveRows; row++) {
      const currentY = riverY + (row / waveRows) * riverHeight;
      const perspectiveScale = (row / waveRows);
      const waveAmplitude = 1.5 + perspectiveScale * 3.2;
      const speed = 0.8 + perspectiveScale * 0.4;
      
      skyCtx.beginPath();
      skyCtx.moveTo(0, currentY);

      const stepSize = isMobile ? 35 : 25;
      for (let x = 0; x <= stageWidth; x += stepSize) {
        const wave = Math.sin((x * 0.02) + (waterWaveTime * speed) + row) * waveAmplitude;
        skyCtx.lineTo(x, currentY + wave);
      }

      const rowAlpha = (0.08 + Math.sin(waterWaveTime + row * 0.5) * 0.04) * (1 - perspectiveScale * 0.3);
      skyCtx.strokeStyle = `rgba(255, 200, 80, ${rowAlpha})`;
      skyCtx.stroke();
    }

    // --- D. Render Micro-Diyas on Ram ki Paidi Ghat Steps (Using Fast Cached Sprite) ---
    skyCtx.globalAlpha = 1.0;
    for (let diya of ghatMicroDiyas) {
      diya.phase += diya.flickerSpeed;
      const flickerFactor = 0.75 + Math.sin(diya.phase) * 0.25;
      const radius = diya.baseRadius * flickerFactor;

      // Ultra-fast GPU drawImage from pre-rendered sprite
      if (diyaGlowSprite) {
        const glowDim = radius * 7;
        skyCtx.drawImage(diyaGlowSprite, diya.x - glowDim / 2, diya.y - glowDim / 2, glowDim, glowDim);
      }

      // Diya Core
      skyCtx.fillStyle = diya.hue;
      skyCtx.beginPath();
      skyCtx.arc(diya.x, diya.y, radius, 0, Math.PI * 2);
      skyCtx.fill();

      // Subtle water reflection under diya
      if (diya.y > riverY - 10) {
        skyCtx.fillStyle = 'rgba(255, 170, 0, 0.12)';
        skyCtx.fillRect(diya.x - 2, diya.y + 3, 4, 6);
      }
    }

    requestAnimationFrame(renderSkyAndWater);
  }

  // Handle High-DPI Canvas Resizing with Mobile DPI Clamping
  function resizeCanvases() {
    if (!fxCanvas || !skyCanvas || !posterStage) return;
    const rect = posterStage.getBoundingClientRect();
    
    // Clamp DPR to 1.25 on mobile to avoid 4K pixel fill-rate lag, 2 on desktop
    const isMobile = window.innerWidth < 768;
    const dpr = isMobile ? Math.min(window.devicePixelRatio || 1, 1.25) : Math.min(window.devicePixelRatio || 1, 2);

    stageWidth = rect.width;
    stageHeight = rect.height;

    fxCanvas.width = stageWidth * dpr;
    fxCanvas.height = stageHeight * dpr;
    skyCanvas.width = stageWidth * dpr;
    skyCanvas.height = stageHeight * dpr;

    fxCtx = fxCanvas.getContext('2d');
    skyCtx = skyCanvas.getContext('2d');
    fxCtx.scale(dpr, dpr);
    skyCtx.scale(dpr, dpr);

    initAtmosphere();
  }

  window.addEventListener('resize', resizeCanvases);
  resizeCanvases();
  requestAnimationFrame(renderSkyAndWater);
  requestAnimationFrame(renderFX);

  // =========================================================================
  // RESPONSIVE 3D PARALLAX, GYROSCOPE & AMBIENT ROAMING LIGHT
  // =========================================================================
  let lastUserInteraction = 0;
  let hasGyroscope = false;

  // Auto-roaming ambient light when device is idle
  function updateAmbientLivingLight() {
    if (Date.now() - lastUserInteraction > 1600 && !hasGyroscope) {
      const t = Date.now();
      const ambX = 50 + Math.sin(t * 0.00075) * 24;
      const ambY = 46 + Math.cos(t * 0.00055) * 18;
      posterStage.style.setProperty('--light-x', `${ambX.toFixed(1)}%`);
      posterStage.style.setProperty('--light-y', `${ambY.toFixed(1)}%`);
    }
    requestAnimationFrame(updateAmbientLivingLight);
  }
  requestAnimationFrame(updateAmbientLivingLight);

  // Desktop Mouse Parallax Tilt & Raycast Light
  posterStage.addEventListener('mousemove', (e) => {
    lastUserInteraction = Date.now();
    const rect = posterStage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltX = ((y - centerY) / centerY) * -6; // max 6 deg tilt
    const tiltY = ((x - centerX) / centerX) * 6;

    posterStage.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    
    // Update CSS variables for dynamic raycast spotlight
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;
    posterStage.style.setProperty('--light-x', `${pctX}%`);
    posterStage.style.setProperty('--light-y', `${pctY}%`);
  });

  posterStage.addEventListener('mouseleave', () => {
    posterStage.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg)`;
  });

  // Mobile & Tablet Gyroscope (DeviceOrientation) Parallax
  function handleDeviceOrientation(event) {
    if (event.gamma === null || event.beta === null) return;
    hasGyroscope = true;
    lastUserInteraction = Date.now();

    // gamma: left-to-right tilt [-90, 90]
    // beta: front-to-back tilt [-180, 180]
    const gamma = Math.max(-45, Math.min(45, event.gamma));
    const beta = Math.max(10, Math.min(75, event.beta)); // Normal handheld angle ~45 deg

    const tiltY = (gamma / 45) * 8; // max 8 deg tilt
    const tiltX = ((beta - 45) / 30) * -8;

    posterStage.style.transform = `perspective(1200px) rotateX(${tiltX.toFixed(1)}deg) rotateY(${tiltY.toFixed(1)}deg)`;

    const lightX = 50 + (gamma / 45) * 35;
    const lightY = 45 + ((beta - 45) / 30) * 30;
    posterStage.style.setProperty('--light-x', `${lightX.toFixed(1)}%`);
    posterStage.style.setProperty('--light-y', `${lightY.toFixed(1)}%`);
  }

  // Request Gyroscope permissions (iOS 13+ support)
  function initMobileGyroscope() {
    if (typeof DeviceOrientationEvent !== 'undefined') {
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(permissionState => {
            if (permissionState === 'granted') {
              window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
            }
          })
          .catch(console.warn);
      } else {
        window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
      }
    }
  }

  // Unlock mobile audio and gyroscope on very first screen tap
  function unlockMobileEnvironment() {
    getAudioContext();
    initMobileGyroscope();
    window.removeEventListener('touchstart', unlockMobileEnvironment);
    window.removeEventListener('pointerdown', unlockMobileEnvironment);
  }
  window.addEventListener('touchstart', unlockMobileEnvironment, { passive: true });
  window.addEventListener('pointerdown', unlockMobileEnvironment, { passive: true });

  // =========================================================================
  // STEP 4: INTERACTIVE PHYSICS ENGINE (THE GRAND CELEBRATION ARSENAL)
  // =========================================================================
  let currentToolMode = 'sparkler'; // 'sparkler', 'river-diya', 'lantern', 'firework'
  const dockButtons = document.querySelectorAll('.dock-btn[data-mode]');

  // Particle Collections
  const sparklerParticles = [];
  const floatingRiverDiyas = [];
  const activeLanterns = [];
  const rockets = [];
  const fireworkParticles = [];
  const riverRipples = [];

  // Dock button switching
  dockButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dockButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentToolMode = btn.getAttribute('data-mode');
      updateCursorMode();
    });
  });

  function updateCursorMode() {
    if (currentToolMode === 'sparkler') {
      posterStage.style.cursor = 'crosshair';
    } else if (currentToolMode === 'river-diya') {
      posterStage.style.cursor = 'pointer';
    } else if (currentToolMode === 'lantern') {
      posterStage.style.cursor = 'grab';
    } else if (currentToolMode === 'firework') {
      posterStage.style.cursor = 'cell';
    }
  }
  updateCursorMode();

  // --- 1. SPARKLES (PHULJHARI WITH BRANCHING DENDRITES) ---
  function spawnSparkler(x, y, count = 6, canBranch = true) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4.6 + 1.2;
      sparklerParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed + 0.4,
        alpha: 1.0,
        decay: Math.random() * 0.032 + 0.018,
        size: Math.random() * 2.2 + 0.9,
        color: Math.random() > 0.3 ? '#ffd700' : (Math.random() > 0.5 ? '#ffffff' : '#ff9900'),
        canBranch: canBranch && Math.random() < 0.22,
        hasBranched: false
      });
    }
  }

  // --- 2. FLOATING RIVER DIYAS ---
  function spawnRiverDiya(x, y) {
    const riverY = stageHeight * 0.72;
    // If clicked above river, place at river surface with initial ripple
    const targetY = Math.max(riverY + 15, Math.min(stageHeight - 25, y));
    floatingRiverDiyas.push({
      x: x,
      y: targetY,
      vx: (Math.random() - 0.5) * 0.4 + 0.15, // Gentle Sarayu current drift
      flicker: Math.random() * Math.PI,
      alpha: 1.0,
      life: 0,
      scale: 1.0
    });

    // Initial water splash ripple
    spawnRipple(x, targetY);
  }

  function spawnRipple(x, y) {
    riverRipples.push({
      x: x,
      y: y,
      radius: 4,
      maxRadius: Math.random() * 24 + 16,
      alpha: 0.8,
      speed: Math.random() * 0.5 + 0.4
    });
  }

  // --- 3. AAKASH KANDIL (SKY LANTERNS) ---
  function spawnSkyLantern(x, y) {
    activeLanterns.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -(Math.random() * 0.9 + 0.7), // Ascending buoyancy
      swayPhase: Math.random() * Math.PI * 2,
      size: Math.random() * 12 + 16,
      alpha: 1.0,
      flicker: Math.random() * Math.PI
    });
  }

  // --- 4. ROYAL PALACE FIREWORKS (AUTHENTIC 3D DEPTH & WILLOW TRAILS) ---
  const fireworkPalettes = [
    ['#ffd700', '#fff3a8', '#ff8800', '#ffffff'], // 24K Royal Gold & Willow
    ['#ff2a85', '#ff7700', '#ffd700', '#fff5cc'], // Festive Vermillion & Amber
    ['#00f5d4', '#7000ff', '#ffd700', '#ffffff'], // Peacock Cyan & Imperial Violet
    ['#ff3b30', '#ff9500', '#ffcc00', '#ffffff']  // Deep Sunset Flame
  ];

  let skyFlashBloom = 0;
  let skyFlashX = 0;
  let skyFlashY = 0;
  let skyFlashColor = '#ffd700';

  function launchFirework(targetX, targetY) {
    const startX = targetX + (Math.random() - 0.5) * 40;
    const startY = stageHeight - 5;
    const dy = targetY - startY;
    const dx = targetX - startX;
    const steps = 42;

    playRocketWhistle();
    
    rockets.push({
      x: startX,
      y: startY,
      vx: dx / steps,
      vy: dy / steps,
      targetY: targetY,
      trail: [],
      palette: fireworkPalettes[Math.floor(Math.random() * fireworkPalettes.length)]
    });
  }

  function explodeFirework(x, y, palette) {
    // 1. Trigger Atmospheric Sky Bloom
    skyFlashBloom = 0.5;
    skyFlashX = x;
    skyFlashY = y;
    skyFlashColor = palette[0];

    // 2. Play Realistic Deep Detonation Sound
    playFireworkSound();

    // 3. 3D Spherical Particles (True Physical Depth)
    const isMobile = stageWidth < 640;
    const particleCount = isMobile ? 55 : 85;

    for (let i = 0; i < particleCount; i++) {
      // Uniform 3D sphere velocity distribution
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = Math.random() * 4.8 + 1.6;

      const vx = Math.sin(phi) * Math.cos(theta) * speed;
      const vy = Math.sin(phi) * Math.sin(theta) * speed;
      const vz = Math.cos(phi) * (speed * 20); // 3D depth velocity

      const color = palette[Math.floor(Math.random() * palette.length)];
      
      fireworkParticles.push({
        x: x,
        y: y,
        z: 0,
        vx: vx,
        vy: vy,
        vz: vz,
        gravity: 0.055,
        friction: 0.965,
        alpha: 1.0,
        decay: Math.random() * 0.015 + 0.010,
        size: Math.random() * 2.4 + 1.2,
        color: color,
        trail: [],
        sparkle: Math.random() > 0.35,
        canCrackle: Math.random() > 0.65
      });
    }

    // 4. Secondary Golden Willow Core Ring
    const coreCount = isMobile ? 16 : 28;
    for (let i = 0; i < coreCount; i++) {
      const angle = (i / coreCount) * Math.PI * 2;
      const speed = Math.random() * 2.0 + 0.8;
      fireworkParticles.push({
        x: x,
        y: y,
        z: (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        vz: (Math.random() - 0.5) * 10,
        gravity: 0.035,
        friction: 0.955,
        alpha: 1.0,
        decay: 0.018,
        size: 1.6,
        color: '#ffd700',
        trail: [],
        sparkle: true,
        canCrackle: false
      });
    }
  }

  // Handle Poster Clicks / Touches according to Active Tool
  function handlePosterInteraction(clientX, clientY) {
    const rect = posterStage.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (x < 0 || x > rect.width || y < 0 || y > rect.height) return;

    if (currentToolMode === 'sparkler') {
      spawnSparkler(x, y, 22);
    } else if (currentToolMode === 'river-diya') {
      spawnRiverDiya(x, y);
    } else if (currentToolMode === 'lantern') {
      spawnSkyLantern(x, y);
    } else if (currentToolMode === 'firework') {
      launchFirework(x, Math.max(50, Math.min(y, stageHeight * 0.65)));
    }
  }

  posterStage.addEventListener('click', (e) => {
    // Avoid triggering when clicking buttons or modals
    if (e.target.closest('#interactive-dock') || e.target.closest('#personalize-modal') || e.target.closest('#temple-bells-container') || e.target.closest('#diya-altar')) {
      return;
    }
    handlePosterInteraction(e.clientX, e.clientY);
  });

  // Dragging / Moving interactions
  let isPointerDown = false;
  posterStage.addEventListener('mousedown', (e) => {
    if (!e.target.closest('#interactive-dock') && !e.target.closest('#personalize-modal')) {
      isPointerDown = true;
    }
  });
  window.addEventListener('mouseup', () => { isPointerDown = false; });

  posterStage.addEventListener('mousemove', (e) => {
    const rect = posterStage.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Phuljhari sparks trail while moving
    if (currentToolMode === 'sparkler' && (isPointerDown || Math.random() > 0.35)) {
      spawnSparkler(x, y, isPointerDown ? 6 : 2);
    }
  });

  // Mobile & Tablet Touch Support with Active Light Follow & Haptic Feedback
  posterStage.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      lastUserInteraction = Date.now();
      if (!e.target.closest('#interactive-dock') && !e.target.closest('#personalize-modal') && !e.target.closest('#temple-bells-container') && !e.target.closest('#diya-altar')) {
        handlePosterInteraction(touch.clientX, touch.clientY);
        const rect = posterStage.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        posterStage.style.setProperty('--light-x', `${(x / rect.width * 100).toFixed(1)}%`);
        posterStage.style.setProperty('--light-y', `${(y / rect.height * 100).toFixed(1)}%`);
      }
    }
  }, { passive: true });

  posterStage.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0];
      lastUserInteraction = Date.now();
      const rect = posterStage.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      if (!e.target.closest('#interactive-dock') && !e.target.closest('#personalize-modal')) {
        e.preventDefault(); // Stop mobile elastic bouncing / pulling while painting sparks
        posterStage.style.setProperty('--light-x', `${(x / rect.width * 100).toFixed(1)}%`);
        posterStage.style.setProperty('--light-y', `${(y / rect.height * 100).toFixed(1)}%`);

        if (currentToolMode === 'sparkler') {
          spawnSparkler(x, y, 5);
        }
      }
    }
  }, { passive: false });

  // Main FX Animation Loop (60 FPS on fx-canvas)
  function renderFX() {
    if (!fxCtx || stageWidth === 0) return;

    fxCtx.clearRect(0, 0, stageWidth, stageHeight);
    fxCtx.save();
    fxCtx.globalCompositeOperation = 'lighter';

    // Detonation Atmospheric Sky Bloom (Simulates real firework flash across Ayodhya)
    if (skyFlashBloom > 0.02) {
      const flashGrad = fxCtx.createRadialGradient(skyFlashX, skyFlashY, 10, skyFlashX, skyFlashY, stageWidth * 0.75);
      flashGrad.addColorStop(0, skyFlashColor);
      flashGrad.addColorStop(0.4, 'rgba(255, 180, 50, 0.2)');
      flashGrad.addColorStop(1, 'transparent');
      fxCtx.save();
      fxCtx.globalAlpha = skyFlashBloom;
      fxCtx.fillStyle = flashGrad;
      fxCtx.fillRect(0, 0, stageWidth, stageHeight);
      fxCtx.restore();
      skyFlashBloom *= 0.85;
    }

    // --- A. Render Sparkler Particles ---
    for (let i = sparklerParticles.length - 1; i >= 0; i--) {
      const p = sparklerParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08; // gravity
      p.alpha -= p.decay;

      // Realistic Magnesium Branching (Spitting out micro-sparks)
      if (p.canBranch && !p.hasBranched && p.alpha < 0.6) {
        p.hasBranched = true;
        spawnSparkler(p.x, p.y, 2, false);
      }

      if (p.alpha <= 0) {
        sparklerParticles.splice(i, 1);
        continue;
      }

      fxCtx.fillStyle = p.color;
      fxCtx.globalAlpha = p.alpha;
      fxCtx.beginPath();
      fxCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      fxCtx.fill();
    }

    // --- B. Render Rockets in Flight ---
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      r.x += r.vx;
      r.y += r.vy;

      // Rocket tail spark
      r.trail.push({ x: r.x, y: r.y, alpha: 1.0 });
      if (r.trail.length > 8) r.trail.shift();

      for (let t of r.trail) {
        t.alpha -= 0.12;
        fxCtx.fillStyle = '#ffe082';
        fxCtx.globalAlpha = Math.max(0, t.alpha);
        fxCtx.beginPath();
        fxCtx.arc(t.x, t.y, 2, 0, Math.PI * 2);
        fxCtx.fill();
      }

      // Detonate upon reaching target altitude
      if (r.y <= r.targetY) {
        explodeFirework(r.x, r.y, r.palette);
        if (navigator.vibrate) navigator.vibrate(25);
        rockets.splice(i, 1);
      }
    }

    // --- C. Render Exploded Firework Particles (3D Perspective Depth & Willow Trails) ---
    for (let i = fireworkParticles.length - 1; i >= 0; i--) {
      const p = fireworkParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.z = (p.z || 0) + (p.vz || 0);
      p.vx *= p.friction;
      p.vy *= p.friction;
      if (p.vz) p.vz *= p.friction;
      p.vy += p.gravity;
      p.alpha -= p.decay;

      // Record weeping willow trail history
      p.trail.push({ x: p.x, y: p.y });
      if (p.trail.length > 4) p.trail.shift();

      if (p.alpha <= 0) {
        // Crackling Chrysanthemum pop at end of life
        if (p.canCrackle && Math.random() > 0.65) {
          spawnSparkler(p.x, p.y, 3);
        }
        fireworkParticles.splice(i, 1);
        continue;
      }

      // 3D Perspective Scaling based on Z-depth
      const depthScale = Math.max(0.4, Math.min(1.75, (260 + p.z) / 260));
      const renderSize = (p.sparkle && Math.random() > 0.4 ? p.size * 1.4 : p.size) * depthScale;
      const renderAlpha = Math.max(0, Math.min(1.0, p.alpha * (p.z > 0 ? 1.0 : 0.75)));

      // Render Weeping Willow Trail
      if (p.trail.length > 1) {
        fxCtx.beginPath();
        fxCtx.moveTo(p.trail[0].x, p.trail[0].y);
        for (let t = 1; t < p.trail.length; t++) {
          fxCtx.lineTo(p.trail[t].x, p.trail[t].y);
        }
        fxCtx.strokeStyle = p.color;
        fxCtx.lineWidth = Math.max(0.7, renderSize * 0.7);
        fxCtx.globalAlpha = renderAlpha * 0.45;
        fxCtx.stroke();
      }

      // Head Spark
      fxCtx.fillStyle = (p.sparkle && Math.random() > 0.6) ? '#ffffff' : p.color;
      fxCtx.globalAlpha = renderAlpha;
      fxCtx.beginPath();
      fxCtx.arc(p.x, p.y, renderSize, 0, Math.PI * 2);
      fxCtx.fill();
    }

    // --- D. Render Floating Sarayu Diyas & Water Ripples ---
    fxCtx.globalCompositeOperation = 'source-over';

    // Ripples
    for (let i = riverRipples.length - 1; i >= 0; i--) {
      const rip = riverRipples[i];
      rip.radius += rip.speed;
      rip.alpha -= 0.015;

      if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
        riverRipples.splice(i, 1);
        continue;
      }

      fxCtx.save();
      fxCtx.strokeStyle = `rgba(255, 215, 0, ${rip.alpha * 0.4})`;
      fxCtx.lineWidth = 1.2;
      fxCtx.beginPath();
      fxCtx.ellipse(rip.x, rip.y, rip.radius * 2, rip.radius * 0.6, 0, 0, Math.PI * 2);
      fxCtx.stroke();
      fxCtx.restore();
    }

    // Floating Diyas
    for (let i = floatingRiverDiyas.length - 1; i >= 0; i--) {
      const d = floatingRiverDiyas[i];
      d.x += d.vx;
      d.flicker += 0.08;
      d.life++;

      // Periodic ripple creation
      if (d.life % 45 === 0) {
        spawnRipple(d.x, d.y + 4);
      }

      // Remove if drifts far out
      if (d.x > stageWidth + 40 || d.x < -40) {
        floatingRiverDiyas.splice(i, 1);
        continue;
      }

      fxCtx.save();
      const flickerScale = 0.85 + Math.sin(d.flicker) * 0.2;

      // Outer golden halo
      const diyaGlow = fxCtx.createRadialGradient(d.x, d.y - 4, 0, d.x, d.y - 4, 28 * flickerScale);
      diyaGlow.addColorStop(0, 'rgba(255, 170, 0, 0.7)');
      diyaGlow.addColorStop(0.5, 'rgba(255, 90, 0, 0.25)');
      diyaGlow.addColorStop(1, 'transparent');
      fxCtx.fillStyle = diyaGlow;
      fxCtx.beginPath();
      fxCtx.arc(d.x, d.y - 4, 28 * flickerScale, 0, Math.PI * 2);
      fxCtx.fill();

      // Clay Diya Cup
      fxCtx.fillStyle = '#8b4513';
      fxCtx.beginPath();
      fxCtx.ellipse(d.x, d.y, 14, 5, 0, 0, Math.PI);
      fxCtx.fill();

      // Diya Rim
      fxCtx.fillStyle = '#d4af37';
      fxCtx.beginPath();
      fxCtx.ellipse(d.x, d.y, 14, 3, 0, 0, Math.PI * 2);
      fxCtx.fill();

      // Dancing Flame
      fxCtx.fillStyle = '#fff7c2';
      fxCtx.beginPath();
      fxCtx.moveTo(d.x - 3, d.y - 1);
      fxCtx.quadraticCurveTo(d.x, d.y - 14 * flickerScale, d.x + 3, d.y - 1);
      fxCtx.fill();

      // Water Reflection
      fxCtx.fillStyle = 'rgba(255, 170, 0, 0.25)';
      fxCtx.fillRect(d.x - 6, d.y + 4, 12, 10);
      fxCtx.restore();
    }

    // --- E. Render Active Sky Lanterns (Aakash Kandil) ---
    for (let i = activeLanterns.length - 1; i >= 0; i--) {
      const l = activeLanterns[i];
      l.swayPhase += 0.04;
      l.x += l.vx + Math.sin(l.swayPhase) * 0.45;
      l.y += l.vy;
      l.flicker += 0.07;
      l.size = Math.max(8, l.size * 0.999); // Shrink slightly into distance

      if (l.y < -40) {
        activeLanterns.splice(i, 1);
        continue;
      }

      fxCtx.save();
      const glowFactor = 0.85 + Math.sin(l.flicker) * 0.15;

      // Soft ambient lantern aura
      const lanternGlow = fxCtx.createRadialGradient(l.x + l.size / 2, l.y + l.size / 2, 0, l.x + l.size / 2, l.y + l.size / 2, l.size * 2);
      lanternGlow.addColorStop(0, `rgba(255, 160, 20, ${0.65 * glowFactor})`);
      lanternGlow.addColorStop(0.6, `rgba(255, 90, 0, ${0.2 * glowFactor})`);
      lanternGlow.addColorStop(1, 'transparent');
      fxCtx.fillStyle = lanternGlow;
      fxCtx.beginPath();
      fxCtx.arc(l.x + l.size / 2, l.y + l.size / 2, l.size * 2, 0, Math.PI * 2);
      fxCtx.fill();

      // Paper Lantern Trapezoid Body
      fxCtx.fillStyle = '#ff9e00';
      fxCtx.beginPath();
      fxCtx.moveTo(l.x + l.size * 0.15, l.y);
      fxCtx.lineTo(l.x + l.size * 0.85, l.y);
      fxCtx.lineTo(l.x + l.size, l.y + l.size * 1.3);
      fxCtx.lineTo(l.x, l.y + l.size * 1.3);
      fxCtx.closePath();
      fxCtx.fill();

      // Wooden Rib Borders
      fxCtx.strokeStyle = '#994d00';
      fxCtx.lineWidth = 1;
      fxCtx.stroke();

      // Inner Burning Flame Core
      fxCtx.fillStyle = '#fffdf0';
      fxCtx.beginPath();
      fxCtx.arc(l.x + l.size / 2, l.y + l.size * 0.9, l.size * 0.22 * glowFactor, 0, Math.PI * 2);
      fxCtx.fill();
      fxCtx.restore();
    }

    fxCtx.restore();
    requestAnimationFrame(renderFX);
  }
  // =========================================================================
  // STEP 5 & 6: PROCEDURAL WEB AUDIO ENGINE & AWAKENING CEREMONY
  // =========================================================================
  let audioCtx = null;
  let isSoundEnabled = true;

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  // --- Sound 1: 6-Modal Resonant Bronze Temple Bell (Acoustic Physical Modeling) ---
  function playBellChime(freq = 392.0) {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const duration = 3.6;

    // 1. Strike transient (bright high-frequency metallic contact chime)
    const strikeOsc = ctx.createOscillator();
    const strikeGain = ctx.createGain();
    strikeOsc.type = 'triangle';
    strikeOsc.frequency.setValueAtTime(freq * 3.8, now);
    strikeGain.gain.setValueAtTime(0.001, now);
    strikeGain.gain.exponentialRampToValueAtTime(0.35, now + 0.008);
    strikeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
    strikeOsc.connect(strikeGain);
    strikeGain.connect(ctx.destination);
    strikeOsc.start(now);
    strikeOsc.stop(now + 0.16);

    // 2. Fundamental & Overtones (Hum, Prime, Tierce, Quint, Nominal with beating vibrato)
    const partials = [
      { f: freq * 0.5, gain: 0.22, decay: duration * 1.1 },    // Hum tone
      { f: freq, gain: 0.42, decay: duration },                 // Prime
      { f: freq * 1.189, gain: 0.24, decay: duration * 0.8 },   // Tierce (minor third)
      { f: freq * 1.498, gain: 0.18, decay: duration * 0.7 },   // Quint (fifth)
      { f: freq * 2.0, gain: 0.12, decay: duration * 0.55 },    // Nominal (octave)
      { f: freq * 2.756 + 1.2, gain: 0.08, decay: duration * 0.4 } // Supernominal with beating vibrato
    ];

    partials.forEach(p => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(p.f, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(p.gain, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + p.decay + 0.05);
    });
  }

  // --- Sound: Ambient Sacred Vedic Tanpura Drone (~136.1 Hz Om Frequency) ---
  let tanpuraGain = null;
  let isDroneActive = false;

  function initTanpuraDrone() {
    if (!isSoundEnabled || isDroneActive) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      tanpuraGain = ctx.createGain();
      tanpuraGain.gain.setValueAtTime(0.001, now);
      tanpuraGain.gain.exponentialRampToValueAtTime(0.055, now + 3.0); // Gentle 3s fade-in

      // Sacred Frequencies (Sa: 136.1Hz Om, Pa: 204.15Hz, Tar Sa: 272.2Hz)
      const freqs = [136.1, 204.15, 272.2, 136.1 * 0.5];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(f, now);

        // Warm lowpass filter for silky acoustic timbre
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380 + idx * 60, now);

        // Subtle LFO modulation for breathing acoustic presence
        lfo.frequency.setValueAtTime(0.22 + idx * 0.08, now);
        lfoGain.gain.setValueAtTime(16, now);
        lfo.connect(filter.frequency);
        lfo.start(now);

        osc.connect(filter);
        filter.connect(tanpuraGain);
        osc.start(now);
      });

      tanpuraGain.connect(ctx.destination);
      isDroneActive = true;
    } catch (e) {
      console.warn('Drone init deferred:', e);
    }
  }

  function stopTanpuraDrone() {
    if (tanpuraGain && audioCtx) {
      try {
        tanpuraGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
        setTimeout(() => { isDroneActive = false; }, 1300);
      } catch (e) {
        isDroneActive = false;
      }
    }
  }

  // --- Sound 2: Diya Flame Ignition Whoosh ---
  function playIgnitionSound() {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(480, now + 0.18);
    osc.frequency.exponentialRampToValueAtTime(220, now + 0.35);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.42);
  }

  // --- Sound 3: High-Altitude Rocket Whistle ---
  function playRocketWhistle() {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(340, now);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.45);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.07, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  // --- Sound 4: Celebratory Firework Boom & Echo ---
  function playFireworkSound() {
    if (!isSoundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // Sub-bass heavy thud
    const boomOsc = ctx.createOscillator();
    const boomGain = ctx.createGain();
    boomOsc.type = 'triangle';
    boomOsc.frequency.setValueAtTime(130, now);
    boomOsc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

    boomGain.gain.setValueAtTime(0.01, now);
    boomGain.gain.exponentialRampToValueAtTime(0.42, now + 0.02);
    boomGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);

    boomOsc.connect(boomGain);
    boomGain.connect(ctx.destination);
    boomOsc.start(now);
    boomOsc.stop(now + 0.75);

    // Initial sharp transient snap
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snapOsc.type = 'square';
    snapOsc.frequency.setValueAtTime(1800, now);
    snapOsc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

    snapGain.gain.setValueAtTime(0.01, now);
    snapGain.gain.exponentialRampToValueAtTime(0.18, now + 0.01);
    snapGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    snapOsc.connect(snapGain);
    snapGain.connect(ctx.destination);
    snapOsc.start(now);
    snapOsc.stop(now + 0.1);
  }

  // Hook Temple Bells for realistic ringing & chime sounds
  const templeBells = document.querySelectorAll('.temple-bell-wrapper');
  templeBells.forEach((bell) => {
    const pitch = parseFloat(bell.getAttribute('data-pitch')) || 392.0;
    
    function ringThisBell() {
      bell.classList.remove('ringing');
      void bell.offsetWidth; // trigger reflow
      bell.classList.add('ringing');
      playBellChime(pitch);
      if (navigator.vibrate) navigator.vibrate(35);
      
      // Spawn golden aura around bell
      const rect = bell.getBoundingClientRect();
      const stageRect = posterStage.getBoundingClientRect();
      spawnSparkler(rect.left - stageRect.left + rect.width / 2, rect.top - stageRect.top + rect.height, 12);
    }

    bell.addEventListener('click', ringThisBell);
    bell.addEventListener('touchstart', (e) => {
      e.stopPropagation();
      ringThisBell();
    }, { passive: true });
  });

  // --- PROGRESSIVE 5-STAGE DIYA LIGHTING & AWAKENING CEREMONY ---
  const diyaNodes = document.querySelectorAll('.diya-node');
  const litDiyas = new Set();
  let isAyodhyaAwakened = false;
  let currentAmbientBrightness = 0.28; // Start in twilight darkness

  function updatePosterBrightness(newBrightness) {
    currentAmbientBrightness = Math.min(1.0, newBrightness);
    posterStage.style.setProperty('--ambient-brightness', currentAmbientBrightness.toFixed(2));
  }
  updatePosterBrightness(currentAmbientBrightness);

  function igniteDiya(diyaElement, isClapOrMic = false) {
    const diyaIndex = diyaElement.getAttribute('data-diya');
    if (litDiyas.has(diyaIndex)) return;

    litDiyas.add(diyaIndex);
    if (navigator.vibrate) navigator.vibrate([25, 40, 25]);

    // Visual Flame Update
    const flameParticle = diyaElement.querySelector('.flame-particle');
    const flameGlow = diyaElement.querySelector('.flame-glow');
    if (flameParticle) {
      flameParticle.classList.remove('unlit');
      flameParticle.classList.add('lit');
    }
    if (flameGlow) {
      flameGlow.classList.add('lit');
    }

    // Spark Burst & Sound
    const rect = diyaElement.getBoundingClientRect();
    const stageRect = posterStage.getBoundingClientRect();
    const sparkX = rect.left - stageRect.left + rect.width / 2;
    const sparkY = rect.top - stageRect.top + 8;
    spawnSparkler(sparkX, sparkY, 24);
    playIgnitionSound();

    // Progressive Illumination Step (+18% brightness per diya)
    const newBrightness = 0.28 + (litDiyas.size * 0.15);
    updatePosterBrightness(newBrightness);

    // Awaken background Sacred Surya Mandala and Mandir Aura
    const mandala = document.getElementById('mandala-container');
    if (mandala) {
      mandala.style.opacity = (0.2 + (litDiyas.size * 0.12)).toFixed(2);
    }
    const aura = document.getElementById('mandir-aura');
    if (aura) {
      aura.style.opacity = (0.25 + (litDiyas.size * 0.14)).toFixed(2);
    }

    // If Central Mahadiya (diya #3) or all 5 are lit -> Trigger Grand Awakening
    if ((diyaIndex === '3' || litDiyas.size === 5) && !isAyodhyaAwakened) {
      triggerAyodhyaAwakening(sparkX, sparkY);
    }
  }

  // Click on Diyas to ignite
  diyaNodes.forEach((diya) => {
    diya.addEventListener('click', () => {
      igniteDiya(diya);
    });
  });

  // Central Awakening Trigger
  function triggerAyodhyaAwakening(originX = stageWidth / 2, originY = stageHeight * 0.8) {
    isAyodhyaAwakened = true;
    updatePosterBrightness(1.0); // Full glorious radiant illumination!

    // Start Sacred Vedic Tanpura Drone
    initTanpuraDrone();

    // Light remaining diyas in celebratory sequence
    diyaNodes.forEach((d, idx) => {
      setTimeout(() => {
        igniteDiya(d);
      }, idx * 180);
    });

    // 1. Golden Awakening Shockwave Ripple
    const shockwave = document.createElement('div');
    shockwave.className = 'awakening-shockwave';
    shockwave.style.left = `${originX - 100}px`;
    shockwave.style.top = `${originY - 100}px`;
    shockwave.style.width = '200px';
    shockwave.style.height = '200px';
    posterStage.appendChild(shockwave);
    setTimeout(() => shockwave.remove(), 1700);

    // 2. Multi-Rocket Celebratory Firework Salute over Ram Mandir
    const saluteTargets = [
      { x: stageWidth * 0.25, y: stageHeight * 0.2 },
      { x: stageWidth * 0.50, y: stageHeight * 0.15 },
      { x: stageWidth * 0.75, y: stageHeight * 0.2 },
      { x: stageWidth * 0.38, y: stageHeight * 0.28 },
      { x: stageWidth * 0.62, y: stageHeight * 0.28 },
    ];

    saluteTargets.forEach((target, index) => {
      setTimeout(() => {
        launchFirework(target.x, target.y);
        playFireworkSound();
      }, index * 260);
    });

    // 3. Flight of Glowing Sky Lanterns Ascending
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        spawnSkyLantern(stageWidth * 0.2 + (Math.random() * stageWidth * 0.6), stageHeight * 0.75);
      }, i * 220);
    }

    // 4. Ring Temple Bells in Joyful Melodic Arpeggio
    templeBells.forEach((bell, index) => {
      setTimeout(() => {
        const pitch = parseFloat(bell.getAttribute('data-pitch')) || 392.0;
        bell.classList.remove('ringing');
        void bell.offsetWidth;
        bell.classList.add('ringing');
        playBellChime(pitch);
      }, index * 200 + 400);
    });

    // 5. Update Status Banner with Celebratory Triumph
    const hintBanner = document.getElementById('ignition-hint');
    if (hintBanner) {
      hintBanner.className = 'mt-4 sm:mt-6 inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/30 via-rose-500/30 to-amber-500/30 border-2 border-amber-400 backdrop-blur-xl shadow-[0_0_35px_rgba(255,215,0,0.6)] animate-pulse';
      hintBanner.innerHTML = `
        <span class="text-xl">🪔</span>
        <span class="text-xs sm:text-base text-amber-100 font-extrabold tracking-wider">
          ✨ AYODHYA DHAM IS AWAKENED! SHUBH DEEPAWALI ✨
        </span>
        <span class="text-xl">🏹</span>
      `;
    }
  }

  // --- HARDWARE FEATURE: MICROPHONE BLOW / CLAP DETECTION ---
  const micBtn = document.getElementById('mic-toggle-btn');
  const micIcon = document.getElementById('mic-icon');
  let isMicListening = false;
  let micAudioStream = null;
  let micAnalyser = null;
  let micInterval = null;

  async function toggleMicIgnition() {
    if (isMicListening) {
      // Turn Off
      if (micAudioStream) {
        micAudioStream.getTracks().forEach(track => track.stop());
      }
      if (micInterval) clearInterval(micInterval);
      isMicListening = false;
      micBtn.classList.remove('active');
      micBtn.style.borderColor = '';
      micIcon.innerText = '🎙️';
      return;
    }

    try {
      getAudioContext();
      micAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const micSource = audioCtx.createMediaStreamSource(micAudioStream);
      micAnalyser = audioCtx.createAnalyser();
      micAnalyser.fftSize = 256;
      micSource.connect(micAnalyser);

      isMicListening = true;
      micBtn.classList.add('active');
      micBtn.style.borderColor = '#00f5d4';
      micIcon.innerText = '🟢';

      const dataArray = new Uint8Array(micAnalyser.frequencyBinCount);

      // Listen for sudden peak in volume (blowing air or clapping)
      micInterval = setInterval(() => {
        if (!isMicListening) return;
        micAnalyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;

        // If high energy sound detected (blow/clap spike threshold > 65)
        if (average > 65) {
          const mahadiya = document.querySelector('.central-mahadiya');
          if (mahadiya) {
            igniteDiya(mahadiya, true);
          }
          // Visual celebration flash on button
          micIcon.innerText = '✨';
          setTimeout(() => { if (isMicListening) micIcon.innerText = '🟢'; }, 600);
        }
      }, 50);

    } catch (err) {
      console.warn('Microphone permission denied or not available:', err);
      alert('Microphone access was not granted or is unavailable on this device. You can click on the Diyas directly to illuminate Ayodhya!');
    }
  }

  if (micBtn) {
    micBtn.addEventListener('click', toggleMicIgnition);
  }

  // Audio Toggle Button (Mute/Unmute)
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      if (isSoundEnabled) {
        getAudioContext();
        initTanpuraDrone();
        audioIcon.innerText = '🔊';
        audioToggleBtn.classList.add('active');
      } else {
        stopTanpuraDrone();
        audioIcon.innerText = '🔇';
        audioToggleBtn.classList.remove('active');
      }
    });
  }

  // Play subtle crackle when moving mouse in sparkler mode
  let lastCrackleTime = 0;
  posterStage.addEventListener('mousemove', () => {
    const now = Date.now();
    if (currentToolMode === 'sparkler' && isSoundEnabled && now - lastCrackleTime > 180) {
      lastCrackleTime = now;
      const ctx = getAudioContext();
      if (ctx) {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800 + Math.random() * 600, ctx.currentTime);
        g.gain.setValueAtTime(0.015, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    }
  });

  if (personalizeBtn && personalizeModal) {
    personalizeBtn.addEventListener('click', () => {
      personalizeModal.classList.remove('hidden');
      personalizeModal.classList.add('flex');
    });
  }

  if (modalCloseBtn && personalizeModal) {
    modalCloseBtn.addEventListener('click', () => {
      personalizeModal.classList.add('hidden');
      personalizeModal.classList.remove('flex');
    });
  }

  const student1Input = document.getElementById('team-student1-input');
  const student2Input = document.getElementById('team-student2-input');

  if (applyNameBtn) {
    applyNameBtn.addEventListener('click', () => {
      const name = judgeNameInput.value.trim() || 'Honorable Evaluator';
      const dept = judgeDeptInput.value.trim() || 'Distinguished Faculty';
      const student1 = student1Input ? student1Input.value.trim() : '';
      const student2 = student2Input ? student2Input.value.trim() : '';

      // Create or update Royal Samman Patra Edict
      let patraElem = document.getElementById('royal-samman-patra');
      if (!patraElem) {
        patraElem = document.createElement('div');
        patraElem.id = 'royal-samman-patra';
        const centerMonument = document.getElementById('center-monument');
        const hintBanner = document.getElementById('ignition-hint');
        if (hintBanner && hintBanner.parentNode === centerMonument) {
          centerMonument.insertBefore(patraElem, hintBanner);
        } else {
          centerMonument.appendChild(patraElem);
        }
      }

      patraElem.innerHTML = `
        <div class="royal-gold-seal">
          <svg class="w-8 h-8 text-[#4a2600]" viewBox="0 0 40 40" fill="currentColor">
            <circle cx="20" cy="20" r="16" stroke="#4a2600" stroke-width="1.5" fill="none" stroke-dasharray="2,2"/>
            <path d="M12,30 C8,20 8,20 12,10" stroke="#4a2600" stroke-width="2" fill="none"/>
            <line x1="8" y1="20" x2="32" y2="20" stroke="#4a2600" stroke-width="2"/>
            <polygon points="32,17 38,20 32,23" fill="#4a2600"/>
          </svg>
        </div>
        <div class="text-left flex-1">
          <div class="flex items-center gap-2 mb-0.5">
            <span class="text-[10px] tracking-[0.2em] uppercase text-amber-400 font-bold">
              श्री अयोध्या दीपोत्सव • प्रशस्ति पत्र
            </span>
            <span class="px-1.5 py-0.2 rounded bg-amber-400/20 text-[9px] font-mono text-amber-200 border border-amber-400/30">
              VERIFIED
            </span>
          </div>
          <h4 class="font-cinzel text-sm sm:text-base md:text-lg font-bold text-[#fff2a8] leading-tight">
            ${name}
          </h4>
          <p class="text-[11px] text-amber-300/80 font-medium">
            ${dept}
          </p>
        </div>
        <div class="hidden sm:flex flex-col items-end text-right border-l border-amber-500/30 pl-3">
          <span class="text-[9px] font-mono text-amber-300/60 uppercase">COMMEMORATIVE TOKEN</span>
          <span class="text-[10px] font-mono text-amber-300 font-bold tracking-wider">AYD-2026-RAM-7729</span>
          <span class="text-[8px] text-amber-400/50">SAMVAT 2083 // SPEC ED.</span>
        </div>
      `;

      // Update student team metadata if provided
      if (student1 || student2) {
        const teamDesc = [student1, student2].filter(Boolean).join(' & ');
        const metaLine = document.querySelector('footer .font-mono.tracking-widest');
        if (metaLine) {
          metaLine.innerHTML = `
            <span>DEV TEAM: ${teamDesc.toUpperCase()}</span>
            <span>AYODHYA LIVING POSTER EDITION 2026</span>
            <span>SPEC CAMPUS DESIGN CHALLENGE</span>
          `;
        }
      }

      // Celebratory feedback
      playBellChime(523.25);
      const stageRect = posterStage.getBoundingClientRect();
      spawnSparkler(stageRect.width / 2, stageRect.height * 0.45, 30);

      personalizeModal.classList.add('hidden');
      personalizeModal.classList.remove('flex');
    });
  }

  // Export Poster to High-Res PNG using html2canvas
  if (exportPngBtn) {
    exportPngBtn.addEventListener('click', () => {
      // First ensure name is applied if user just clicked export
      const name = judgeNameInput.value.trim();
      if (name && applyNameBtn) {
        applyNameBtn.click();
      }

      const exportTarget = document.getElementById('poster-stage');
      if (window.html2canvas && exportTarget) {
        exportPngBtn.innerText = 'Minting Keepsake...';
        document.body.classList.add('exporting');

        // Draw sky and fx canvases onto target before snapshot
        setTimeout(() => {
          html2canvas(exportTarget, {
            backgroundColor: '#05020a',
            scale: 2, // 2x Retina resolution
            useCORS: true,
            allowTaint: true,
            logging: false
          }).then((canvas) => {
            const link = document.createElement('a');
            const sanitizedName = (judgeNameInput.value.trim() || 'Evaluator').replace(/[^a-zA-Z0-9]/g, '_');
            link.download = `Ayodhya_Deepotsav_Poster_2026_${sanitizedName}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            exportPngBtn.innerText = '📥 Mint & Download PNG';
            document.body.classList.remove('exporting');
            personalizeModal.classList.add('hidden');
            personalizeModal.classList.remove('flex');
          }).catch(err => {
            console.error('Export error:', err);
            exportPngBtn.innerText = '📥 Mint & Download PNG';
            document.body.classList.remove('exporting');
          });
        }, 150);
      }
    });
  }
});

