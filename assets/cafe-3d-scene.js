/**
 * Sky16 Cafe — Real 3D WebGL Experience Engine
 * Built with Three.js, GSAP ScrollTrigger & Custom Micro-Interactions
 * Motion & Interaction Language benchmarked on Melvin Moses's portfolio
 */

(function () {
  'use strict';

  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    init3DCinematicExperience();
    initCustomCursor();
  });

  // ============================================================
  // 1. CUSTOM MAGNETIC CURSOR (Melvin Moses Portfolio Polish)
  // ============================================================
  function initCustomCursor() {
    // Only enable on pointer/desktop devices
    if (window.matchMedia('(hover: none)').matches) return;

    const dot = document.getElementById('custom-cursor-dot');
    const ring = document.getElementById('custom-cursor-ring');
    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    // Smooth trailing ring lerp loop
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Magnetic and expanding hover states on interactive items
    const targets = document.querySelectorAll('a, button, [data-cursor], .menu-card, .tilt-card, input, select');
    targets.forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.classList.add('active-hover');
        dot.classList.add('active-hover');
      });
      el.addEventListener('mouseleave', () => {
        ring.classList.remove('active-hover');
        dot.classList.remove('active-hover');
      });
    });
  }

  // ============================================================
  // 2. THREE.JS REAL 3D ENGINE & SCENE COMPOSITION
  // ============================================================
  function init3DCinematicExperience() {
    const canvasContainer = document.getElementById('webgl-canvas-container');
    const heroSection = document.getElementById('experience-3d') || document.getElementById('cinematic-hero-section') || canvasContainer;
    const chapters = document.querySelectorAll('.story-chapter') || [];
    const dots = document.querySelectorAll('.chapter-dot') || [];

    if (!canvasContainer || !window.THREE) return;

    const width = canvasContainer.clientWidth || window.innerWidth;
    const height = canvasContainer.clientHeight || window.innerHeight;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x1a110a, 0.038);

    // --- Perspective Camera ---
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 3, 14); // Initial far camera position

    // --- WebGL Renderer ---
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    canvasContainer.appendChild(renderer.domElement);

    // --- Dynamic Lighting Rig ---
    const ambientLight = new THREE.AmbientLight(0x3a251a, 1.4);
    scene.add(ambientLight);

    // Key Directional Light (Warm Golden Roast)
    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.2);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Soft Fill Light (Warm Crema)
    const fillLight = new THREE.DirectionalLight(0xe8c8a8, 0.9);
    fillLight.position.set(-8, 5, -4);
    scene.add(fillLight);

    // Cinematic Rim PointLight (Sky16 Orange Silhouette Glow)
    const rimLight = new THREE.PointLight(0xd65a31, 3.8, 25);
    rimLight.position.set(0, 3.5, -6);
    scene.add(rimLight);

    // Bottom Ambient Bounce
    const bounceLight = new THREE.PointLight(0x8a4524, 1.2, 15);
    bounceLight.position.set(0, -3, 3);
    scene.add(bounceLight);

    // ============================================================
    // 3. PROCEDURAL REAL 3D COFFEE CUP, SAUCER & LATTE ART
    // ============================================================
    const cupGroup = new THREE.Group();
    scene.add(cupGroup);

    // Texture Loader
    const textureLoader = new THREE.TextureLoader();

    // High-end Ceramic Glaze Material
    const ceramicMaterial = new THREE.MeshStandardMaterial({
      color: 0xfbf7f2,
      roughness: 0.16,
      metalness: 0.03,
      bumpScale: 0.002
    });

    // A. Ceramic Cup Body via Spline LatheGeometry
    const cupPoints = [];
    // Inner profile curve
    cupPoints.push(new THREE.Vector2(0.85, 0.05));
    cupPoints.push(new THREE.Vector2(1.15, 0.4));
    cupPoints.push(new THREE.Vector2(1.32, 0.9));
    cupPoints.push(new THREE.Vector2(1.38, 1.4));
    // Curved rim lip
    cupPoints.push(new THREE.Vector2(1.44, 1.45));
    cupPoints.push(new THREE.Vector2(1.47, 1.42));
    // Outer profile curve
    cupPoints.push(new THREE.Vector2(1.45, 1.35));
    cupPoints.push(new THREE.Vector2(1.38, 0.85));
    cupPoints.push(new THREE.Vector2(1.18, 0.35));
    cupPoints.push(new THREE.Vector2(0.88, 0.0));
    cupPoints.push(new THREE.Vector2(0.0, 0.0)); // Base bottom

    const cupGeometry = new THREE.LatheGeometry(cupPoints, 64);
    const cupMesh = new THREE.Mesh(cupGeometry, ceramicMaterial);
    cupMesh.castShadow = true;
    cupMesh.receiveShadow = true;
    cupGroup.add(cupMesh);

    // B. Ceramic Saucer via LatheGeometry
    const saucerPoints = [];
    saucerPoints.push(new THREE.Vector2(0.0, -0.2));
    saucerPoints.push(new THREE.Vector2(1.0, -0.2));
    saucerPoints.push(new THREE.Vector2(1.2, -0.15)); // Cup foot indent ring
    saucerPoints.push(new THREE.Vector2(1.8, -0.1));
    saucerPoints.push(new THREE.Vector2(2.35, 0.18)); // Elegant upward curved lip
    saucerPoints.push(new THREE.Vector2(2.4, 0.14));
    saucerPoints.push(new THREE.Vector2(1.8, -0.14));
    saucerPoints.push(new THREE.Vector2(1.0, -0.24));
    saucerPoints.push(new THREE.Vector2(0.0, -0.24));

    const saucerGeometry = new THREE.LatheGeometry(saucerPoints, 64);
    const saucerMesh = new THREE.Mesh(saucerGeometry, ceramicMaterial);
    saucerMesh.castShadow = true;
    saucerMesh.receiveShadow = true;
    cupGroup.add(saucerMesh);

    // C. Ergonomic Ceramic Handle via TubeGeometry
    const handleCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(1.35, 1.25, 0.0),
      new THREE.Vector3(1.85, 1.15, 0.0),
      new THREE.Vector3(2.1, 0.75, 0.0),
      new THREE.Vector3(1.75, 0.35, 0.0),
      new THREE.Vector3(1.15, 0.45, 0.0)
    ]);
    const handleGeometry = new THREE.TubeGeometry(handleCurve, 32, 0.12, 16, false);
    const handleMesh = new THREE.Mesh(handleGeometry, ceramicMaterial);
    handleMesh.castShadow = true;
    handleMesh.receiveShadow = true;
    cupGroup.add(handleMesh);

    // D. Real Latte Art Liquid Surface
    const latteArtTexture = textureLoader.load('/images-sky-16/latte-art.jpg');
    latteArtTexture.center.set(0.5, 0.5);
    latteArtTexture.rotation = -Math.PI / 2;

    const coffeeMaterial = new THREE.MeshStandardMaterial({
      map: latteArtTexture,
      roughness: 0.22,
      metalness: 0.08
    });
    const liquidGeometry = new THREE.CircleGeometry(1.33, 64);
    const liquidMesh = new THREE.Mesh(liquidGeometry, coffeeMaterial);
    liquidMesh.rotation.x = -Math.PI / 2;
    liquidMesh.position.y = 1.34;
    liquidMesh.receiveShadow = true;
    cupGroup.add(liquidMesh);

    // E. Soft Contact Ground Shadow
    const shadowGeo = new THREE.PlaneGeometry(5.2, 5.2);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.42
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.26;
    cupGroup.add(shadowMesh);

    // ============================================================
    // 4. REALISTIC RISING COFFEE STEAM
    // ============================================================
    const steamCount = 45;
    const steamGeo = new THREE.BufferGeometry();
    const steamPositions = new Float32Array(steamCount * 3);
    const steamAlphas = new Float32Array(steamCount);
    const steamSizes = new Float32Array(steamCount);
    const steamVelocities = [];

    for (let i = 0; i < steamCount; i++) {
      steamPositions[i * 3 + 0] = (Math.random() - 0.5) * 0.8;
      steamPositions[i * 3 + 1] = 1.4 + Math.random() * 2.2;
      steamPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
      steamAlphas[i] = Math.random() * 0.5;
      steamSizes[i] = 25 + Math.random() * 35;
      steamVelocities.push({
        vy: 0.012 + Math.random() * 0.015,
        vx: (Math.random() - 0.5) * 0.005,
        phase: Math.random() * Math.PI * 2
      });
    }

    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPositions, 3));
    steamGeo.setAttribute('alpha', new THREE.BufferAttribute(steamAlphas, 1));

    const steamTexture = textureLoader.load('/images-sky-16/steam-particle.png');
    const steamMaterial = new THREE.PointsMaterial({
      map: steamTexture,
      size: 1.2,
      color: 0xffeedd,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const steamPoints = new THREE.Points(steamGeo, steamMaterial);
    cupGroup.add(steamPoints);

    // ============================================================
    // 5. 15 3D ROASTED COFFEE BEANS WITH DEPTH LAYERS
    // ============================================================
    const beansGroup = new THREE.Group();
    scene.add(beansGroup);

    const beanGeo = new THREE.SphereGeometry(0.35, 16, 16);
    beanGeo.scale(1.2, 0.75, 0.55); // Organic bean proportions

    const beanMaterial = new THREE.MeshStandardMaterial({
      color: 0x24140b,
      roughness: 0.32,
      metalness: 0.08
    });

    const beanObjects = [];
    const beanConfigs = [
      // Foreground beans (closest to camera, passing in front)
      { x: -3.8, y: 1.5, z: 4.5, rotSpeed: 0.008, scale: 1.1 },
      { x: 3.5, y: -0.8, z: 4.8, rotSpeed: -0.01, scale: 1.2 },
      { x: -1.8, y: -2.2, z: 5.2, rotSpeed: 0.012, scale: 0.9 },
      // Midground beans (beside cup)
      { x: -4.5, y: 3.2, z: 1.0, rotSpeed: 0.007, scale: 0.95 },
      { x: 4.2, y: 2.8, z: 0.5, rotSpeed: -0.009, scale: 1.0 },
      { x: -3.2, y: -1.2, z: -0.8, rotSpeed: 0.014, scale: 0.85 },
      { x: 3.8, y: -2.5, z: 1.2, rotSpeed: -0.006, scale: 1.05 },
      // Background beans (behind cup, deeper in fog)
      { x: -2.5, y: 4.5, z: -3.5, rotSpeed: 0.005, scale: 0.75 },
      { x: 2.2, y: 4.0, z: -4.2, rotSpeed: -0.006, scale: 0.8 },
      { x: 0.5, y: -3.5, z: -5.0, rotSpeed: 0.008, scale: 0.7 },
      { x: -5.2, y: 0.2, z: -4.5, rotSpeed: 0.011, scale: 0.85 },
      { x: 5.0, y: 0.5, z: -3.8, rotSpeed: -0.01, scale: 0.8 },
      { x: -1.0, y: 5.2, z: -2.8, rotSpeed: 0.007, scale: 0.9 },
      { x: 2.8, y: -4.2, z: -2.2, rotSpeed: -0.008, scale: 0.75 },
      { x: 0.0, y: 3.8, z: -6.0, rotSpeed: 0.009, scale: 0.65 }
    ];

    beanConfigs.forEach((cfg, idx) => {
      const bMesh = new THREE.Mesh(beanGeo, beanMaterial);
      bMesh.position.set(cfg.x, cfg.y, cfg.z);
      bMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      bMesh.scale.multiplyScalar(cfg.scale);
      bMesh.castShadow = true;
      beansGroup.add(bMesh);
      beanObjects.push({
        mesh: bMesh,
        initialY: cfg.y,
        initialX: cfg.x,
        initialZ: cfg.z,
        speed: cfg.rotSpeed,
        depthFactor: (idx % 2 === 0 ? 1.5 : -1.2)
      });
    });

    // ============================================================
    // 6. FLOATING 3D FOOD CARDS (Chapter 03 Feature)
    // ============================================================
    const foodCardsGroup = new THREE.Group();
    scene.add(foodCardsGroup);
    foodCardsGroup.position.set(2.8, 0.4, 0);
    foodCardsGroup.visible = false;

    const foodTextures = [
      textureLoader.load('/images-food/pizza.jpg'),
      textureLoader.load('/images-food/burger.jpg'),
      textureLoader.load('/images-food/dessert.jpg')
    ];

    const foodCardMeshes = [];
    const cardPositions = [
      { x: 0, y: 1.2, z: 0.5, rotZ: 0.06 },
      { x: 1.6, y: -0.4, z: -0.2, rotZ: -0.08 },
      { x: -1.2, y: -1.1, z: 0.2, rotZ: 0.04 }
    ];

    foodTextures.forEach((tex, i) => {
      const cGeo = new THREE.PlaneGeometry(2.0, 1.5);
      const cMat = new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.3,
        metalness: 0.05,
        side: THREE.DoubleSide
      });
      const cMesh = new THREE.Mesh(cGeo, cMat);
      cMesh.position.set(cardPositions[i].x, cardPositions[i].y, cardPositions[i].z);
      cMesh.rotation.z = cardPositions[i].rotZ;
      cMesh.castShadow = true;
      foodCardsGroup.add(cMesh);
      foodCardMeshes.push(cMesh);
    });

    // ============================================================
    // 7. ATMOSPHERIC GOLDEN DUST PARTICLES
    // ============================================================
    const dustCount = 120;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3 + 0] = (Math.random() - 0.5) * 22;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 16;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 16;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = new THREE.PointsMaterial({
      size: 0.06,
      color: 0xe2a850,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // ============================================================
    // 8. HERO ENTRANCE ANIMATION (Physics Gravity Drop & Settle)
    // ============================================================
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    // Initial position above viewport
    cupGroup.position.set(isMobile ? 0 : -1.8, 14, 0);
    cupGroup.rotation.set(-0.4, 0.8, -0.3);

    function playEntrance() {
      if (prefersReducedMotion) {
        cupGroup.position.set(isMobile ? 0 : -1.8, 0, 0);
        cupGroup.rotation.set(0.12, 0.1, 0);
        camera.position.set(0, 2.0, isMobile ? 11.5 : 8.5);
        return;
      }

      if (window.gsap) {
        // Cup falls smoothly from sky
        gsap.to(cupGroup.position, {
          y: 0,
          duration: 2.0,
          ease: 'power4.out'
        });

        // Gentle settling rotation
        gsap.to(cupGroup.rotation, {
          x: 0.15,
          y: 0.1,
          z: 0,
          duration: 2.2,
          ease: 'power3.out'
        });

        // Camera smoothly approaches cup
        gsap.to(camera.position, {
          z: isMobile ? 11.5 : 8.5,
          y: 2.0,
          duration: 2.4,
          ease: 'power3.out'
        });
      }
    }

    setTimeout(playEntrance, 120);

    // ============================================================
    // 9. SCROLL CHOREOGRAPHY (5-Chapter Cinematic Camera Journey)
    // ============================================================
    let scrollProgress = 0;

    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.create({
        trigger: heroSection,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          scrollProgress = self.progress;
          updateChapterContent(self.progress);
        }
      });
    } else {
      window.addEventListener('scroll', () => {
        const rect = heroSection.getBoundingClientRect();
        const total = heroSection.offsetHeight - window.innerHeight;
        if (total > 0) {
          scrollProgress = Math.min(Math.max(-rect.top / total, 0), 1);
          updateChapterContent(scrollProgress);
        }
      }, { passive: true });
    }

    function updateChapterContent(progress) {
      let activeIndex = 0;
      if (progress < 0.20) {
        activeIndex = 0; // Chapter 1: Arrival
      } else if (progress < 0.42) {
        activeIndex = 1; // Chapter 2: Coffee
      } else if (progress < 0.65) {
        activeIndex = 2; // Chapter 3: Food
      } else if (progress < 0.85) {
        activeIndex = 3; // Chapter 4: Experience
      } else {
        activeIndex = 4; // Chapter 5: Visit
      }

      chapters.forEach((ch, idx) => {
        if (idx === activeIndex) {
          ch.classList.add('active');
        } else {
          ch.classList.remove('active');
        }
      });

      dots.forEach((dot, idx) => {
        if (idx === activeIndex) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });

      // Show/Hide 3D Floating Food Planes during Chapter 03
      if (progress >= 0.40 && progress <= 0.68) {
        foodCardsGroup.visible = true;
        const subP = (progress - 0.40) / 0.28;
        foodCardsGroup.rotation.y = Math.sin(subP * Math.PI) * 0.35;
        foodCardsGroup.position.y = 0.4 + Math.sin(subP * Math.PI) * 0.4;
      } else {
        foodCardsGroup.visible = false;
      }
    }

    // ============================================================
    // 10. MOUSE PARALLAX & TILT (Desktop alive feel)
    // ============================================================
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 1.5;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 1.5;
    }, { passive: true });


    // Add Interactive Pointer Drag Orbit Controls on Canvas
    let isDragging = false;
    let previousPointerPosition = { x: 0, y: 0 };
    let userRotationY = 0;
    let userRotationX = 0;

    canvasContainer.addEventListener('pointerdown', (e) => {
      isDragging = true;
      previousPointerPosition = { x: e.clientX, y: e.clientY };
      canvasContainer.style.cursor = 'grabbing';
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousPointerPosition.x;
      const deltaY = e.clientY - previousPointerPosition.y;

      userRotationY += deltaX * 0.008;
      userRotationX += deltaY * 0.005;
      userRotationX = Math.max(-0.4, Math.min(0.6, userRotationX));

      previousPointerPosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('pointerup', () => {
      isDragging = false;
      canvasContainer.style.cursor = 'grab';
    });

    canvasContainer.style.cursor = 'grab';

    // ============================================================
    // 11. MAIN 60 FPS RENDER LOOP
    // ============================================================
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Mouse Parallax Lerp
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Camera & Cup Position as function of scrollProgress (0 to 1)
      if (!prefersReducedMotion) {
        const p = scrollProgress;

        // Cup Rotation: continuous, intentional 360° scroll journey
        cupGroup.rotation.y = 0.1 + p * Math.PI * 2.2 + userRotationY + (isDragging ? 0 : elapsedTime * 0.2);
        
        // Gentle tilt depending on phase
        if (p < 0.22) {
          // Chapter 1: Standard upright angle
          cupGroup.rotation.x = 0.15 + userRotationX;
          if (!isMobile) cupGroup.position.x = -1.8;
        } else if (p < 0.45) {
          // Chapter 2 (Coffee): Cup tilts towards camera so latte art is highlighted!
          const sub = (p - 0.22) / 0.23;
          cupGroup.rotation.x = 0.15 + sub * 0.32; // Tilts forward
          if (!isMobile) cupGroup.position.x = -1.8 + sub * 0.4;
        } else if (p < 0.68) {
          // Chapter 3 (Food): Cup moves slightly left to make room for 3D food cards
          const sub = (p - 0.45) / 0.23;
          cupGroup.rotation.x = 0.47 - sub * 0.25;
          if (!isMobile) cupGroup.position.x = -1.4 - sub * 1.2;
        } else if (p < 0.88) {
          // Chapter 4 (Experience): Cup centers slightly
          const sub = (p - 0.68) / 0.20;
          cupGroup.rotation.x = 0.22 - sub * 0.08;
          if (!isMobile) cupGroup.position.x = -2.6 + sub * 0.8;
        } else {
          // Chapter 5 (Visit): Settled resting angle
          cupGroup.rotation.x = 0.14;
          if (!isMobile) cupGroup.position.x = -1.8;
        }

        // Camera 3D Movement Path
        const baseCamZ = isMobile ? 11.5 : (8.5 - p * 1.5);
        camera.position.z = baseCamZ;
        camera.position.y = 2.0 + currentMouseY * 0.5 + Math.sin(p * Math.PI) * 0.8;
        camera.position.x = currentMouseX * 0.8 + (isMobile ? 0 : Math.sin(p * Math.PI * 2) * 0.6);
        camera.lookAt(isMobile ? 0 : -0.8, 0.4, 0);

        // Dynamic Lighting Shifts by Chapter
        keyLight.intensity = 2.0 + Math.sin(p * Math.PI) * 0.8;
        rimLight.intensity = 3.5 + Math.cos(p * Math.PI * 2) * 1.2;
      }

      // Animate Coffee Steam Particles
      const posAttr = steamGeo.attributes.position;
      for (let i = 0; i < steamCount; i++) {
        const vel = steamVelocities[i];
        posAttr.array[i * 3 + 1] += vel.vy;
        posAttr.array[i * 3 + 0] += Math.sin(elapsedTime * 1.8 + vel.phase) * 0.004;

        // Reset particle when it floats too high
        if (posAttr.array[i * 3 + 1] > 3.6) {
          posAttr.array[i * 3 + 1] = 1.34;
          posAttr.array[i * 3 + 0] = (Math.random() - 0.5) * 0.8;
          posAttr.array[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
        }
      }
      posAttr.needsUpdate = true;

      // Animate 3D Coffee Beans (Parallax Tumbling)
      beanObjects.forEach((b) => {
        b.mesh.rotation.x += b.speed;
        b.mesh.rotation.y += b.speed * 0.8;
        b.mesh.position.y = b.initialY + Math.sin(elapsedTime * 0.8 + b.initialX) * 0.15;
        b.mesh.position.z = b.initialZ + scrollProgress * b.depthFactor * 2.5;
      });

      // Slowly rotate golden dust
      dustPoints.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    }

    animate();

    // ============================================================
    // 12. RESPONSIVE RESIZE HANDLING
    // ============================================================
    window.addEventListener('resize', () => {
      const w = canvasContainer.clientWidth || window.innerWidth;
      const h = canvasContainer.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }, { passive: true });

  }
})();
