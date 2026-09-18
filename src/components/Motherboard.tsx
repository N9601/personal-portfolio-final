"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createTimeline, onScroll, stagger, utils, type Timeline } from "animejs";

/**
 * Exploded Motherboard / Server Core.
 *
 * A vertical PCB facing the camera with animated glowing circuit traces.
 * Components hover in formation in front of it (CPU, GPU, RAM, capacitors,
 * heatsink, ports). Connector arcs glow between components. Data sparks
 * travel along traces. Cursor proximity lifts and disperses components
 * like a magnetic field.
 *
 * The canvas is position: fixed and lives on screen from the hero
 * through the Toolbox gallery. An anime.js timeline synced to scroll
 * (the same technique animejs.com uses for its 3D engine) disassembles
 * the board with a staggered explode as the hero leaves, spins the
 * debris slowly behind the gallery, snaps everything back together in
 * the last chapter, then drops the board away before Skills.
 */
export function Motherboard() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // === Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080808, 0.022);

    // === Camera (eye-level, looking at center, slight perspective)
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 9.5);
    camera.lookAt(0, 0, 0);

    // === Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    // Touch devices get a tighter pixel-ratio cap — phone GPUs pay
    // dearly for the shader-driven PCB at high DPR, and the visual
    // difference at phone scale is negligible.
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isCoarse ? 1.25 : 1.5)
    );
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.appendChild(renderer.domElement);

    // === Lights
    scene.add(new THREE.AmbientLight(0x556677, 0.95));

    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(3, 6, 7);
    scene.add(key);

    const coolRim = new THREE.DirectionalLight(0x4488ff, 1.3);
    coolRim.position.set(-5, 2, 3);
    scene.add(coolRim);

    const warmRim = new THREE.DirectionalLight(0xff6622, 1.0);
    warmRim.position.set(6, -1, 2);
    scene.add(warmRim);

    const center = new THREE.PointLight(0x0066ff, 6, 9, 1.6);
    center.position.set(0, 0, 0.8);
    scene.add(center);

    // Red side accent
    const redLight = new THREE.PointLight(0xff1133, 1.8, 6, 2);
    redLight.position.set(2.2, -1, 1.4);
    scene.add(redLight);

    // === Root group — vertical PCB facing camera, slight tilt
    const root = new THREE.Group();
    root.rotation.x = -0.18; // light forward tilt
    root.rotation.y = 0.05;
    scene.add(root);

    // === PCB Base Plate (now VERTICAL — facing camera)
    const pcbW = 7.2;
    const pcbH = 4.6;
    const pcbThickness = 0.18;
    const pcbGeo = new THREE.BoxGeometry(pcbW, pcbH, pcbThickness, 1, 1, 1);
    const pcbMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCursor: { value: new THREE.Vector2(0.5, 0.5) },
        uIdle: { value: 0 }, // 0..1, drives idle pulse intensity
        uIdleSweep: { value: 0 }, // 0..1, position of the sweep line
        uColorA: { value: new THREE.Color(0x0066ff) },
        uColorB: { value: new THREE.Color(0xff5500) },
        uColorR: { value: new THREE.Color(0xff1133) },
        uColorBase: { value: new THREE.Color(0x070710) },
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform float uTime;
        uniform vec2 uCursor;
        uniform float uIdle;
        uniform float uIdleSweep;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform vec3 uColorR;
        uniform vec3 uColorBase;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        // Maze-like circuit (Manhattan path per cell)
        float circuit(vec2 p, float scale) {
          p *= scale;
          vec2 g = fract(p) - 0.5;
          vec2 id = floor(p);
          float r = hash(id);

          float trace = 0.0;
          if (r < 0.33) {
            trace = smoothstep(0.04, 0.0, abs(g.x));
          } else if (r < 0.66) {
            trace = smoothstep(0.04, 0.0, abs(g.y));
          } else {
            // L-bend
            float a = smoothstep(0.04, 0.0, abs(g.x));
            float b = smoothstep(0.04, 0.0, abs(g.y));
            trace = max(a * step(0.0, g.y), b * step(0.0, g.x));
          }

          // Solder pads at corners
          float node = smoothstep(0.13, 0.07, length(g));
          return max(trace, node * 0.85);
        }

        // Moving data pulse mask along a trace
        float dataPulse(vec2 p, float t) {
          float v = sin(p.x * 6.2832 + t * 3.5) * 0.5 + 0.5;
          v *= sin(p.y * 6.2832 - t * 2.8) * 0.5 + 0.5;
          return pow(v, 6.0);
        }

        void main() {
          float front = max(vNormal.z, 0.0);
          float side = 1.0 - front;

          vec2 uv = vUv * 2.0 - 1.0;

          // Multi-octave circuit
          float c1 = circuit(uv, 7.0);
          float c2 = circuit(uv + 3.7, 14.0) * 0.55;
          float c3 = circuit(uv * 0.5 - 1.1, 3.5) * 0.7;
          float c = max(max(c1, c2), c3);

          // Pulse
          float p1 = dataPulse(uv, uTime);
          float p2 = dataPulse(uv * 1.3 + 2.0, uTime * 0.7);

          // Cursor halo
          vec2 cp = vUv - uCursor;
          float cd = length(cp);
          float halo = smoothstep(0.55, 0.0, cd);

          // Idle sweep — bright vertical line that travels left to right
          // when the user goes idle. Faintly tinted blue along the trail.
          float sweepDist = abs(vUv.x - uIdleSweep);
          float sweepCore = smoothstep(0.045, 0.0, sweepDist) * uIdle;
          float sweepTrail = smoothstep(0.16, 0.0, sweepDist) * uIdle * 0.45;
          float sweep = max(sweepCore, sweepTrail);

          // Trace color shifts between blue/orange + red flicker
          float redFlick = step(0.985, hash(vec2(floor(uTime * 20.0), 0.0)));
          vec3 traceCol = mix(uColorA, uColorB, p1);
          traceCol = mix(traceCol, uColorR, redFlick * 0.6);

          // Base color
          vec3 col = uColorBase;

          // Add traces with pulse glow + idle sweep boost
          col += traceCol * c * (0.85 + p2 * 1.2 + halo * 1.8 + sweep * 2.5);

          // Extra blue accent right under the sweep wave
          col += uColorA * sweep * 0.6;

          // Background "wells" (subtle blue ambient on board surface)
          col += uColorA * 0.04 * (sin(uv.x * 3.0 + uTime * 0.5) * 0.5 + 0.5);

          // Scanline grain
          col += vec3(0.02) * (sin(vUv.y * 600.0) * 0.5 + 0.5);

          // Edge bevel highlight
          float edgeX = smoothstep(0.97, 1.0, abs(uv.x));
          float edgeY = smoothstep(0.97, 1.0, abs(uv.y));
          col += vec3(0.15, 0.2, 0.4) * max(edgeX, edgeY);

          // Vignette on board
          float vig = 1.0 - dot(uv * 0.5, uv * 0.5) * 0.7;
          col *= vig;

          // Side faces are darker, denim metal
          col = mix(vec3(0.04, 0.05, 0.07), col, front);

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
    const pcb = new THREE.Mesh(pcbGeo, pcbMat);
    pcb.position.z = -0.4; // behind components
    root.add(pcb);

    // PCB edge wireframe
    const pcbEdge = new THREE.LineSegments(
      new THREE.EdgesGeometry(pcbGeo),
      new THREE.LineBasicMaterial({
        color: 0x66aaff,
        transparent: true,
        opacity: 0.55,
      })
    );
    pcb.add(pcbEdge);

    // === Components (now in front of PCB, in XY plane)
    type Component = {
      mesh: THREE.Object3D;
      basePos: THREE.Vector3;
      offsetSeed: THREE.Vector3;
      cracked: THREE.Vector3;
      // Direction this component scatters toward when the board is
      // disassembled (intro fly-in + scroll-out explode)
      explodeDir: THREE.Vector3;
    };
    const components: Component[] = [];

    const metalMat = new THREE.MeshStandardMaterial({
      color: 0x6a7280,
      roughness: 0.32,
      metalness: 0.94,
      emissive: 0x101520,
      emissiveIntensity: 0.45,
    });

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xc8923a,
      roughness: 0.28,
      metalness: 0.96,
      emissive: 0x5a3a14,
      emissiveIntensity: 0.55,
    });

    const darkMat = new THREE.MeshStandardMaterial({
      color: 0x2a2d36,
      roughness: 0.42,
      metalness: 0.85,
      emissive: 0x0a0c14,
      emissiveIntensity: 0.35,
    });

    const blueGlow = new THREE.MeshStandardMaterial({
      color: 0x223060,
      roughness: 0.3,
      metalness: 0.9,
      emissive: 0x0066ff,
      emissiveIntensity: 1.6,
    });

    const orangeGlow = new THREE.MeshStandardMaterial({
      color: 0x502a10,
      roughness: 0.38,
      metalness: 0.85,
      emissive: 0xff5500,
      emissiveIntensity: 1.4,
    });

    const redGlow = new THREE.MeshStandardMaterial({
      color: 0x4a1018,
      roughness: 0.4,
      metalness: 0.8,
      emissive: 0xff1133,
      emissiveIntensity: 1.5,
    });

    const edgeMatBlue = new THREE.LineBasicMaterial({
      color: 0x88bbff,
      transparent: true,
      opacity: 0.65,
    });

    const addComponent = (
      mesh: THREE.Object3D,
      x: number,
      y: number,
      z: number
    ) => {
      mesh.position.set(x, y, z);
      root.add(mesh);
      components.push({
        mesh,
        basePos: new THREE.Vector3(x, y, z),
        offsetSeed: new THREE.Vector3(
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100
        ),
        cracked: new THREE.Vector3(),
        // Scatter radially outward from board center, biased toward
        // the camera so disassembly reads as the board flying apart.
        explodeDir: new THREE.Vector3(
          x * 0.7 + (Math.random() - 0.5) * 2.0,
          y * 0.7 + (Math.random() - 0.5) * 2.0,
          1.0 + Math.random() * 2.4
        ),
      });
    };

    const wrapEdges = (mesh: THREE.Mesh, mat: THREE.LineBasicMaterial) => {
      const e = new THREE.LineSegments(
        new THREE.EdgesGeometry(mesh.geometry),
        mat.clone()
      );
      mesh.add(e);
    };

    // CPU socket (centered)
    const cpuGroup = new THREE.Group();
    const cpuBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.6, 0.22),
      darkMat.clone()
    );
    wrapEdges(cpuBase, edgeMatBlue);
    cpuGroup.add(cpuBase);
    const cpuTop = new THREE.Mesh(
      new THREE.BoxGeometry(1.15, 1.15, 0.1),
      goldMat
    );
    cpuTop.position.z = 0.16;
    cpuGroup.add(cpuTop);
    const cpuChip = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.6, 0.03),
      blueGlow.clone()
    );
    cpuChip.position.z = 0.22;
    cpuGroup.add(cpuChip);
    // CPU labels (small bright pads around perimeter)
    for (let i = 0; i < 16; i++) {
      const pad = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.05, 0.02),
        i % 3 === 0 ? blueGlow.clone() : metalMat.clone()
      );
      const a = (i / 16) * Math.PI * 2;
      pad.position.set(Math.cos(a) * 0.72, Math.sin(a) * 0.72, 0.13);
      cpuGroup.add(pad);
    }
    addComponent(cpuGroup, 0, 0, 0.55);

    // Heatsink (tower of horizontal fins extending forward)
    const heatsink = new THREE.Group();
    for (let i = 0; i < 9; i++) {
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 1.3, 0.04),
        metalMat.clone()
      );
      fin.position.z = i * 0.13;
      heatsink.add(fin);
    }
    // Cap
    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(1.4, 1.4, 0.06),
      darkMat.clone()
    );
    cap.position.z = 9 * 0.13;
    heatsink.add(cap);
    addComponent(heatsink, 0, 0, 1.4);

    // GPU (large slab to the lower-left)
    const gpuGroup = new THREE.Group();
    const gpu = new THREE.Mesh(
      new THREE.BoxGeometry(2.8, 0.85, 0.32),
      darkMat.clone()
    );
    wrapEdges(gpu, edgeMatBlue);
    gpuGroup.add(gpu);
    for (let i = 0; i < 6; i++) {
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.7, 0.22),
        metalMat.clone()
      );
      fin.position.x = -1.15 + i * 0.46;
      fin.position.z = 0.22;
      gpuGroup.add(fin);
    }
    // GPU LED bar
    const gpuLed = new THREE.Mesh(
      new THREE.BoxGeometry(2.4, 0.07, 0.05),
      blueGlow.clone()
    );
    gpuLed.position.set(0, -0.42, 0.18);
    gpuGroup.add(gpuLed);
    addComponent(gpuGroup, -1.65, -1.45, 0.4);

    // RAM sticks (3 verticals on the right)
    for (let i = 0; i < 4; i++) {
      const stick = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 1.9, 0.18),
        darkMat.clone()
      );
      wrapEdges(stick, edgeMatBlue);
      const shim = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 1.6, 0.08),
        i % 2 === 0 ? blueGlow.clone() : orangeGlow.clone()
      );
      shim.position.z = 0.13;
      stick.add(shim);
      // Notch label
      const notch = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.18, 0.06),
        metalMat.clone()
      );
      notch.position.set(0, -0.7, 0.16);
      stick.add(notch);
      addComponent(stick, 2.0 + i * 0.32, 0.4, 0.4);
    }

    // Capacitors (taller cylinders scattered around)
    for (let i = 0; i < 10; i++) {
      const cap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.13, 0.13, 0.42, 14),
        metalMat.clone()
      );
      cap.rotation.x = Math.PI / 2; // standing forward
      // Top accent ring
      const ring = new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.14, 0.04, 14),
        i % 3 === 0 ? blueGlow.clone() : orangeGlow.clone()
      );
      ring.position.z = 0.21;
      cap.add(ring);
      const a = (i / 10) * Math.PI * 2 + 0.7;
      addComponent(
        cap,
        Math.cos(a) * 2.6 - 0.2,
        Math.sin(a) * 1.6 + 0.1,
        0.25
      );
    }

    // I/O ports (left side, vertical column)
    for (let i = 0; i < 5; i++) {
      const port = new THREE.Mesh(
        new THREE.BoxGeometry(0.55, 0.32, 0.28),
        darkMat.clone()
      );
      wrapEdges(port, edgeMatBlue);
      const led = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.08, 0.05),
        i % 2 === 0 ? blueGlow.clone() : i === 3 ? redGlow.clone() : orangeGlow.clone()
      );
      led.position.set(-0.18, 0.08, 0.18);
      port.add(led);
      addComponent(port, -3.0, 1.4 - i * 0.45, 0.3);
    }

    // SMD chips scattered
    for (let i = 0; i < 18; i++) {
      const w = 0.12 + Math.random() * 0.2;
      const h = 0.06 + Math.random() * 0.1;
      const chip = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, 0.04),
        Math.random() < 0.15
          ? blueGlow.clone()
          : Math.random() < 0.3
          ? orangeGlow.clone()
          : darkMat.clone()
      );
      addComponent(
        chip,
        (Math.random() - 0.5) * 6.2,
        (Math.random() - 0.5) * 3.8,
        0.18
      );
    }

    // Resistors (tiny dark slabs with gold tips)
    for (let i = 0; i < 12; i++) {
      const r = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.07, 0.05),
        darkMat.clone()
      );
      const t1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.08, 0.06),
        goldMat
      );
      t1.position.x = -0.13;
      r.add(t1);
      const t2 = t1.clone();
      t2.position.x = 0.13;
      r.add(t2);
      r.rotation.z = Math.random() < 0.5 ? 0 : Math.PI / 2;
      addComponent(
        r,
        (Math.random() - 0.5) * 5.8,
        (Math.random() - 0.5) * 3.4,
        0.13
      );
    }

    // === Glowing connector traces (animated arcs between components)
    const connectorMat = new THREE.LineBasicMaterial({
      color: 0x0088ff,
      transparent: true,
      opacity: 0.5,
    });
    const connectorPoints: Array<[THREE.Vector3, THREE.Vector3]> = [
      [new THREE.Vector3(0, 0, 0.6), new THREE.Vector3(-1.65, -1.45, 0.4)],
      [new THREE.Vector3(0, 0, 0.6), new THREE.Vector3(2.0, 0.4, 0.4)],
      [new THREE.Vector3(0, 0, 0.6), new THREE.Vector3(-3.0, 0.5, 0.3)],
      [new THREE.Vector3(-1.65, -1.45, 0.4), new THREE.Vector3(-3.0, 0.5, 0.3)],
    ];
    const connectorLines: THREE.Line[] = [];
    for (const [a, b] of connectorPoints) {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i <= 24; i++) {
        const t = i / 24;
        const mid = a.clone().lerp(b, t);
        mid.z += Math.sin(t * Math.PI) * 0.6; // arc forward
        points.push(mid);
      }
      const g = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(g, connectorMat.clone());
      root.add(line);
      connectorLines.push(line);
    }

    // === Floating data particles (count trimmed for steady 60fps on mobile)
    const particleCount = 130;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const seeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.2) * 2;
      seeds[i] = Math.random() * 100;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute("seed", new THREE.BufferAttribute(seeds, 1));
    const particleMat = new THREE.PointsMaterial({
      color: 0x44aaff,
      size: 0.04,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    root.add(particles);

    // Orange spark layer
    const sparkGeo = new THREE.BufferGeometry();
    const sparkCount = 32;
    const sparkPos = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      sparkPos[i * 3 + 0] = (Math.random() - 0.5) * 7;
      sparkPos[i * 3 + 1] = (Math.random() - 0.5) * 4.4;
      sparkPos[i * 3 + 2] = Math.random() * 1.6;
    }
    sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPos, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xff7733,
      size: 0.07,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sparks = new THREE.Points(sparkGeo, sparkMat);
    root.add(sparks);

    // === Cursor tracking
    const ndc = new THREE.Vector2(0, 0);
    const ndcTarget = new THREE.Vector2(0, 0);
    const raycaster = new THREE.Raycaster();
    const cursorWorld = new THREE.Vector3();
    const pickPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 20),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    pickPlane.position.z = 0.3;
    root.add(pickPlane);

    // Idle detection — reset on any user activity
    let lastActivity = performance.now();
    const IDLE_DELAY = 5000; // ms before sweep starts
    const onPointerMove = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndcTarget.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndcTarget.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      lastActivity = performance.now();
    };
    const bumpActivity = () => {
      lastActivity = performance.now();
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", bumpActivity, { passive: true });
    window.addEventListener("keydown", bumpActivity, { passive: true });
    window.addEventListener("touchstart", bumpActivity, { passive: true });

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    const startTime = performance.now();
    let rafId: number;
    let visible = true;
    let docVisible = true;

    // Assembly choreography. The board starts disassembled and the
    // components fly into formation, staggered, timed to land as the
    // loader curtain wipes. Repeat visits (loader skipped) assemble
    // almost immediately. Scrolling away from the hero disassembles
    // the board again; scrolling back rebuilds it.
    let introStart = 2.4; // seconds of scene time before assembly begins
    try {
      if (sessionStorage.getItem("booted") === "1") introStart = 0.35;
    } catch {
      // storage unavailable — keep first-visit timing
    }
    const INTRO_PER = 1.1; // per-component flight duration
    const INTRO_STAGGER = 0.045;

    // Pause the entire render loop when the hero is scrolled off-screen
    // OR when the tab is backgrounded. Saves ~6ms per frame and battery.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          visible = e.isIntersecting;
        }
        if (visible && docVisible && !rafId) {
          rafId = requestAnimationFrame(render);
        }
      },
      { threshold: 0.01 }
    );
    // The mount is fixed, so it always "intersects". Observe the scroll
    // range the board is choreographed over instead.
    const rangeEl = document.getElementById("engine-range") ?? mount;
    io.observe(rangeEl);

    // === Scroll choreography (anime.js, scrubbed by scroll position)
    // Plain JS objects hold the scrub state; the render loop reads them.
    const scrub = { explode: 0, rotY: 0, scale: 1, opacity: 1, y: 0, x: 0 };
    const parts = components.map(() => ({ ex: 0 }));
    let scrollTl: Timeline | null = null;
    if (rangeEl !== mount) {
      scrollTl = createTimeline({
        defaults: { ease: "inOut(3)" },
        autoplay: onScroll({
          target: rangeEl,
          enter: "top top",
          leave: "bottom bottom",
          sync: true,
        }),
      })
        .label("EXPLODE", 0)
        // Parts fly apart from the centre outward, staggered
        .add(parts, { ex: 1, duration: 700, delay: stagger(14, { from: "center" }) }, "EXPLODE")
        .add(scrub, { explode: 1, duration: 700 }, "EXPLODE")
        // Debris drifts back, dims, and slowly rotates behind the gallery
        .add(scrub, { scale: 0.72, opacity: 0.42, x: -0.6, duration: 900 }, "EXPLODE+=400")
        .add(scrub, { rotY: -Math.PI * 2, duration: 4600, ease: "linear" }, "EXPLODE+=400")
        // Snap back together (the site's MODULES_CASE beat)
        .label("ASSEMBLE", 5400)
        .add(parts, { ex: 0, duration: 500, ease: "out(3)", delay: stagger(9, { from: "last" }) }, "ASSEMBLE")
        .add(scrub, { explode: 0, scale: 1, opacity: 1, x: 0, duration: 500, ease: "out(3)" }, "ASSEMBLE")
        // ...and fall away before the next section takes over
        .add(scrub, { y: -7, opacity: 0, duration: 500, ease: "in(2)" }, "ASSEMBLE+=800")
        .init();
    }
    if (process.env.NODE_ENV !== "production") {
      // Dev hook so automated checks can read the scrub state without
      // a running render loop (rAF never fires in hidden panes).
      (window as unknown as { __scrub?: unknown }).__scrub = { scrub, parts };
    }

    const onVis = () => {
      docVisible = document.visibilityState === "visible";
      if (visible && docVisible && !rafId) {
        rafId = requestAnimationFrame(render);
      }
    };
    document.addEventListener("visibilitychange", onVis);

    const render = () => {
      const t = (performance.now() - startTime) / 1000;

      // Ease cursor
      ndc.x += (ndcTarget.x - ndc.x) * 0.1;
      ndc.y += (ndcTarget.y - ndc.y) * 0.1;

      // Camera parallax
      camera.position.x = ndc.x * 0.5;
      camera.position.y = 0.4 + ndc.y * 0.35;
      camera.lookAt(0, 0, 0);

      // Cursor projection onto pick plane
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObject(pickPlane, false);
      if (hits.length) {
        cursorWorld.copy(hits[0].point);
        // Local to PCB for shader (PCB is in XY of root)
        const localX = cursorWorld.x / pcbW + 0.5;
        const localY = cursorWorld.y / pcbH + 0.5;
        pcbMat.uniforms.uCursor.value.set(localX, localY);
      }

      pcbMat.uniforms.uTime.value = t;

      // Idle sweep — eased onset/offset, sweep position loops 0..1 ~3s
      const idleMs = performance.now() - lastActivity;
      const targetIdle = idleMs > IDLE_DELAY ? 1 : 0;
      const currIdle = pcbMat.uniforms.uIdle.value;
      pcbMat.uniforms.uIdle.value = currIdle + (targetIdle - currIdle) * 0.05;
      pcbMat.uniforms.uIdleSweep.value = ((t * 0.32) % 1);

      center.intensity = 5 + Math.sin(t * 2.2) * 1.8;
      redLight.intensity = 1.4 + Math.sin(t * 3.2 + 1) * 1.0;

      // Disassembly factor from the scroll-synced anime.js timeline
      // (0 assembled, 1 fully exploded). Falls back to a plain smoothstep
      // of hero scroll when no range element exists.
      let scrollEx = scrub.explode;
      if (!scrollTl) {
        const heroH = mount.clientHeight || 1;
        const raw = Math.min(1, Math.max(0, window.scrollY / (heroH * 0.85)));
        scrollEx = raw * raw * (3 - 2 * raw);
      }

      // Global assembly progress (used for the shared elements: PCB,
      // connector arcs, particles)
      const introT0 = Math.min(1, Math.max(0, (t - introStart) / 1.7));
      const introG = 1 - Math.pow(1 - introT0, 3);
      const globalEx = Math.max(1 - introG, scrollEx);

      // PCB recedes while disassembled
      pcb.position.z = -0.4 - globalEx * 3.0;

      // Connector arcs and ambience fade out as the board comes apart
      for (const line of connectorLines) {
        (line.material as THREE.LineBasicMaterial).opacity =
          0.5 * (1 - globalEx);
      }
      particleMat.opacity = 0.75 * (1 - globalEx * 0.85);

      // Component physics — cursor pushes in XY and forward in Z,
      // assembly state scatters along each component's explode vector
      for (let i = 0; i < components.length; i++) {
        const c = components[i];
        const worldPos = new THREE.Vector3();
        c.mesh.getWorldPosition(worldPos);

        const dx = worldPos.x - cursorWorld.x;
        const dy = worldPos.y - cursorWorld.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const radius = 2.2;
        const force = Math.max(0, 1 - dist / radius);
        const push = force * force * 0.7;

        const len = Math.max(dist, 0.0001);
        const targetX = (dx / len) * push;
        const targetY = (dy / len) * push;
        const targetZ = force * force * 1.0; // lift forward toward camera

        const floatX = Math.sin(t * 0.6 + c.offsetSeed.x) * 0.012;
        const floatY = Math.cos(t * 0.5 + c.offsetSeed.y) * 0.012;
        const floatZ =
          Math.sin(t * 0.8 + c.offsetSeed.z) * 0.04 +
          Math.cos(t * 0.4) * 0.02;

        c.cracked.x += (targetX + floatX - c.cracked.x) * 0.12;
        c.cracked.y += (targetY + floatY - c.cracked.y) * 0.12;
        c.cracked.z += (targetZ + floatZ - c.cracked.z) * 0.1;

        // Per-component assembly: staggered fly-in on load, scroll
        // explode on the way out. Whichever pulls it apart more wins.
        const introT = Math.min(
          1,
          Math.max(0, (t - introStart - i * INTRO_STAGGER) / INTRO_PER)
        );
        const introEase = 1 - Math.pow(1 - introT, 3);
        const explode = Math.max(
          1 - introEase,
          scrollTl ? parts[i].ex : scrollEx
        );
        const ex = explode * 2.4;

        c.mesh.position.set(
          c.basePos.x + c.cracked.x + c.explodeDir.x * ex,
          c.basePos.y + c.cracked.y + c.explodeDir.y * ex,
          c.basePos.z + c.cracked.z + c.explodeDir.z * ex
        );
        c.mesh.rotation.z =
          c.cracked.x * 0.3 + explode * ((c.offsetSeed.x % 2) - 1) * 1.4;
        c.mesh.rotation.x =
          c.cracked.y * 0.2 + explode * ((c.offsetSeed.y % 2) - 1) * 1.1;
        c.mesh.rotation.y = explode * ((c.offsetSeed.z % 2) - 1) * 1.2;
      }

      // Animate particles drifting up and forward
      const pp = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const seed = seeds[i];
        pp[i * 3 + 1] += 0.005 * (0.5 + seed * 0.01);
        pp[i * 3 + 2] += Math.sin(t * 0.5 + seed) * 0.001;
        if (pp[i * 3 + 1] > 2.6) pp[i * 3 + 1] = -2.6;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Sparks twinkle (suppressed while disassembled)
      sparkMat.opacity = (0.5 + Math.sin(t * 6) * 0.3) * (1 - globalEx);

      // Root subtle sway + scroll choreography (spin, recede, drop)
      root.rotation.y = ndc.x * 0.18 + Math.sin(t * 0.15) * 0.04 + scrub.rotY;
      root.rotation.x = -0.18 + ndc.y * 0.08;
      root.scale.setScalar(scrub.scale);
      root.position.set(scrub.x, scrub.y, 0);
      renderer.domElement.style.opacity = String(scrub.opacity);

      renderer.render(scene, camera);
      if (visible && docVisible) {
        rafId = requestAnimationFrame(render);
      } else {
        rafId = 0;
      }
    };
    render();

    return () => {
      cancelAnimationFrame(rafId);
      scrollTl?.revert();
      utils.remove([scrub, ...parts]);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", bumpActivity);
      window.removeEventListener("keydown", bumpActivity);
      window.removeEventListener("touchstart", bumpActivity);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      scene.traverse((o) => {
        if ((o as THREE.Mesh).geometry) {
          (o as THREE.Mesh).geometry.dispose();
        }
        if ((o as THREE.Mesh).material) {
          const m = (o as THREE.Mesh).material;
          if (Array.isArray(m)) m.forEach((x) => x.dispose());
          else (m as THREE.Material).dispose();
        }
      });
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-10 h-[100svh] w-full"
      style={{ pointerEvents: "none" }}
      aria-hidden
    />
  );
}
