'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import HeroGlobeFallback from './HeroGlobeFallback';

interface HeroGlobeProps {
  className?: string;
}

export default function HeroGlobe({ className = '' }: HeroGlobeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const [useFallback, setUseFallback] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = window.innerWidth < 768;
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return Boolean(motion || isMobile || !gl);
    }
    return false;
  });

  useEffect(() => {
    if (useFallback) return;

    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let isVisible = true;

    // Dimensions
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.8;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Globe Group
    const globeGroup = new THREE.Group();
    // Default orientation: Center LATAM (approx 15 deg axial tilt, rotated to Americas)
    globeGroup.rotation.x = 0.25;
    globeGroup.rotation.y = -1.2;
    scene.add(globeGroup);

    // 1. Globe Base Sphere (Dark Navy Mesh)
    const sphereGeo = new THREE.SphereGeometry(1, 36, 36);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x050814,
      wireframe: false,
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    globeGroup.add(sphereMesh);

    // 2. Globe Wireframe Lines (Architectural Grid)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x1e293b,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const wireMesh = new THREE.Mesh(sphereGeo, wireMat);
    globeGroup.add(wireMesh);

    // Helper: Convert lat/long to 3D sphere coordinate
    const latLongToVector3 = (lat: number, lon: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // Helper: Point in polygon (ray-casting algorithm)
    const pointInPoly = (pt: [number, number], poly: [number, number][]) => {
      let inside = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i][1], yi = poly[i][0];
        const xj = poly[j][1], yj = poly[j][0];
        const intersect = ((yi > pt[0]) !== (yj > pt[0])) &&
          (pt[1] < (xj - xi) * (pt[0] - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
      }
      return inside;
    };

    // 3. Recognizable Continent Coastlines
    const SA_COAST: [number, number][] = [
      [12.5, -71.5], [11.0, -64.0], [8.0, -60.0], [5.5, -52.5], [0.5, -50.0], [-2.5, -44.0],
      [-5.0, -35.0], [-8.0, -35.0], [-13.0, -38.5], [-18.0, -39.5], [-23.0, -43.0], [-27.0, -48.5],
      [-33.0, -51.5], [-38.0, -57.5], [-43.0, -63.5], [-50.0, -66.0], [-55.0, -66.5], [-54.5, -71.0],
      [-50.0, -74.5], [-44.0, -74.0], [-37.0, -73.5], [-30.0, -71.5], [-22.0, -70.5], [-15.0, -75.5],
      [-8.0, -79.5], [-4.0, -81.0], [2.0, -78.5], [7.5, -77.5], [10.0, -75.5], [12.5, -71.5]
    ];

    const CA_MX_COAST: [number, number][] = [
      [8.0, -77.5], [9.0, -83.0], [10.5, -85.5], [13.5, -87.5], [15.5, -92.5], [18.0, -103.5],
      [22.5, -106.0], [26.0, -110.0], [31.5, -116.0], [31.5, -113.0], [28.0, -111.0], [24.0, -108.5],
      [19.0, -96.0], [22.0, -97.5], [26.0, -97.5], [29.0, -94.0], [28.0, -89.0], [25.0, -90.0],
      [21.5, -87.0], [18.5, -88.0], [16.0, -88.5], [15.5, -85.5], [12.0, -83.5], [9.0, -83.0], [8.0, -77.5]
    ];

    const NA_COAST: [number, number][] = [
      [26.0, -97.5], [29.0, -94.0], [29.5, -85.0], [25.0, -80.5], [31.0, -81.0], [35.0, -75.5],
      [41.0, -71.0], [44.5, -67.0], [48.0, -64.0], [53.0, -56.0], [58.0, -63.0], [60.0, -70.0],
      [58.0, -94.0], [65.0, -120.0], [65.0, -165.0], [59.0, -150.0], [54.0, -132.0], [48.5, -124.5],
      [43.0, -124.5], [37.5, -122.5], [32.5, -117.0], [31.5, -116.0]
    ];

    const EU_AF_COAST: [number, number][] = [
      [36.0, -6.0], [43.5, -9.0], [48.0, -4.5], [51.0, 1.5], [54.0, 8.5], [58.0, 6.0],
      [62.0, 5.0], [60.0, 11.0], [55.0, 12.0], [50.0, 15.0], [44.0, 10.0], [40.0, 0.0], [36.0, -6.0],
      [30.0, -10.0], [21.0, -17.0], [14.5, -17.5], [8.0, -13.0], [4.5, -2.0],
      [4.0, 9.0], [0.0, 9.0], [-10.0, 13.0], [-20.0, 12.0], [-34.0, 18.5], [-34.0, 25.0],
      [-25.0, 33.0], [-15.0, 40.0], [0.0, 42.0], [12.0, 44.0], [24.0, 36.0], [31.0, 32.0], [36.0, -6.0]
    ];

    const createCoastGeo = (coords: [number, number][], radius = 1.006) => {
      const points = coords.map(c => latLongToVector3(c[0], c[1], radius));
      return new THREE.BufferGeometry().setFromPoints(points);
    };

    const saCoastGeo = createCoastGeo(SA_COAST);
    const caMxCoastGeo = createCoastGeo(CA_MX_COAST);
    const naCoastGeo = createCoastGeo(NA_COAST);
    const euAfCoastGeo = createCoastGeo(EU_AF_COAST);

    // LATAM Coastlines (Cobalt)
    const latamCoastMat = new THREE.LineBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.85,
    });
    globeGroup.add(new THREE.Line(saCoastGeo, latamCoastMat));
    globeGroup.add(new THREE.Line(caMxCoastGeo, latamCoastMat));

    // Global Architectural Coastlines (Muted Slate)
    const globalCoastMat = new THREE.LineBasicMaterial({
      color: 0x334155,
      transparent: true,
      opacity: 0.45,
    });
    globeGroup.add(new THREE.Line(naCoastGeo, globalCoastMat));
    globeGroup.add(new THREE.Line(euAfCoastGeo, globalCoastMat));

    // 4. LATAM Landmass Particle Field (Solidifying Central & South America)
    const latamLandPositions: number[] = [];
    for (let lat = -54; lat <= 12; lat += 2.5) {
      for (let lon = -82; lon <= -34; lon += 2.5) {
        if (pointInPoly([lat, lon], SA_COAST)) {
          const pos = latLongToVector3(lat, lon, 1.008);
          latamLandPositions.push(pos.x, pos.y, pos.z);
        }
      }
    }
    for (let lat = 8; lat <= 32; lat += 2.5) {
      for (let lon = -116; lon <= -76; lon += 2.5) {
        if (pointInPoly([lat, lon], CA_MX_COAST)) {
          const pos = latLongToVector3(lat, lon, 1.008);
          latamLandPositions.push(pos.x, pos.y, pos.z);
        }
      }
    }

    const latamLandGeo = new THREE.BufferGeometry();
    latamLandGeo.setAttribute('position', new THREE.Float32BufferAttribute(latamLandPositions, 3));
    const latamLandMat = new THREE.PointsMaterial({
      color: 0x2563eb,
      size: 0.022,
      transparent: true,
      opacity: 0.85,
    });
    globeGroup.add(new THREE.Points(latamLandGeo, latamLandMat));

    // 5. LATAM Tech Hub Data Points
    const hubs = [
      { name: 'Bogota', lat: 4.711, lon: -74.072 },
      { name: 'Medellin', lat: 6.244, lon: -75.581 },
      { name: 'BuenosAires', lat: -34.6037, lon: -58.3816 },
      { name: 'SaoPaulo', lat: -23.5505, lon: -46.6333 },
      { name: 'Santiago', lat: -33.4489, lon: -70.6693 },
      { name: 'MexicoCity', lat: 19.4326, lon: -99.1332 },
    ];

    const hubPointsGeo = new THREE.BufferGeometry();
    const hubPositions: number[] = [];
    hubs.forEach((h) => {
      const pos = latLongToVector3(h.lat, h.lon, 1.015);
      hubPositions.push(pos.x, pos.y, pos.z);
    });
    hubPointsGeo.setAttribute('position', new THREE.Float32BufferAttribute(hubPositions, 3));

    const hubPointsMat = new THREE.PointsMaterial({
      color: 0x60a5fa,
      size: 0.05,
      transparent: true,
      opacity: 0.95,
    });
    const hubPoints = new THREE.Points(hubPointsGeo, hubPointsMat);
    globeGroup.add(hubPoints);

    // 6. Subtle Destination Hubs (US & Europe)
    const destHubs = [
      { name: 'NewYork', lat: 40.7128, lon: -74.006 },
      { name: 'SanFrancisco', lat: 37.7749, lon: -122.4194 },
      { name: 'London', lat: 51.5074, lon: -0.1278 },
      { name: 'Berlin', lat: 52.52, lon: 13.405 },
    ];
    const destPositions: number[] = [];
    destHubs.forEach((h) => {
      const pos = latLongToVector3(h.lat, h.lon, 1.012);
      destPositions.push(pos.x, pos.y, pos.z);
    });
    const destGeo = new THREE.BufferGeometry();
    destGeo.setAttribute('position', new THREE.Float32BufferAttribute(destPositions, 3));
    const destMat = new THREE.PointsMaterial({
      color: 0x64748b,
      size: 0.03,
      transparent: true,
      opacity: 0.6,
    });
    globeGroup.add(new THREE.Points(destGeo, destMat));

    // 7. Connecting Spline Arcs from LATAM to US/EU
    const createArc = (startVec: THREE.Vector3, endVec: THREE.Vector3) => {
      const mid = new THREE.Vector3().addVectors(startVec, endVec).multiplyScalar(0.5);
      mid.normalize().multiplyScalar(1.25); // lift arc above surface
      const curve = new THREE.QuadraticBezierCurve3(startVec, mid, endVec);
      const points = curve.getPoints(30);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0x2563eb,
        transparent: true,
        opacity: 0.25,
      });
      return new THREE.Line(arcGeo, arcMat);
    };

    const bogotaVec = latLongToVector3(4.711, -74.072, 1.01);
    const nyVec = latLongToVector3(40.7128, -74.006, 1.01);
    const spVec = latLongToVector3(-23.5505, -46.6333, 1.01);
    const londonVec = latLongToVector3(51.5074, -0.1278, 1.01);

    globeGroup.add(createArc(bogotaVec, nyVec));
    globeGroup.add(createArc(spVec, londonVec));

    // Mouse & Touch Drag Interaction + Inertia + Parallax
    let targetRotationX = 0.25;
    let targetRotationY = -1.2;
    let dragVelocityX = 0;
    let dragVelocityY = 0;
    let isDragging = false;
    let lastPointerX = 0;
    let lastPointerY = 0;
    let hoverParallaxX = 0;
    let hoverParallaxY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      // Don't drag if clicking directly on an interactive overlay node or link
      if ((e.target as HTMLElement)?.closest('.pointer-events-auto:not(canvas)')) {
        return;
      }
      isDragging = true;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      dragVelocityX = 0;
      dragVelocityY = 0;
      try {
        container.setPointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer capture fails
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - lastPointerX;
        const deltaY = e.clientY - lastPointerY;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;

        const sensitivity = 0.005;
        dragVelocityY = deltaX * sensitivity;
        dragVelocityX = deltaY * sensitivity;

        targetRotationY += dragVelocityY;
        targetRotationX += dragVelocityX;
      } else {
        const rect = container.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        hoverParallaxY = normX * 0.15;
        hoverParallaxX = normY * 0.15;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isDragging) {
        isDragging = false;
        try {
          if (container.hasPointerCapture(e.pointerId)) {
            container.releasePointerCapture(e.pointerId);
          }
        } catch {
          // Ignore
        }
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);
    container.addEventListener('pointermove', handlePointerMove);
    container.addEventListener('pointerup', handlePointerUp);
    container.addEventListener('pointercancel', handlePointerUp);

    // Subtle window mousemove parallax when outside container
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (isDragging) return;
      const rect = container.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (!isInside) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distFromCenterX = (e.clientX - centerX) / (window.innerWidth / 2);
        const distFromCenterY = (e.clientY - centerY) / (window.innerHeight / 2);
        hoverParallaxY = Math.max(-0.2, Math.min(0.2, distFromCenterX * 0.1));
        hoverParallaxX = Math.max(-0.15, Math.min(0.15, distFromCenterY * 0.1));
      }
    };

    window.addEventListener('mousemove', handleWindowMouseMove, { passive: true });

    // Visibility Observer (Pause when off-screen)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);

    // Tab Visibility
    const handleVisibilityChange = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = clock.getDelta();

      // Momentum decay when not dragging
      if (!isDragging) {
        targetRotationY += dragVelocityY;
        targetRotationX += dragVelocityX;
        dragVelocityY *= 0.94;
        dragVelocityX *= 0.94;

        // Slow perpetual idle drift
        targetRotationY += 0.03 * delta;
      }

      // Clamp X rotation to prevent flipping upside down
      targetRotationX = Math.max(-0.55, Math.min(0.65, targetRotationX));

      const finalTargetY = targetRotationY + (isDragging ? 0 : hoverParallaxY);
      const finalTargetX = targetRotationX + (isDragging ? 0 : hoverParallaxX);

      // Smooth damped lerp
      globeGroup.rotation.y += (finalTargetY - globeGroup.rotation.y) * 0.08;
      globeGroup.rotation.x += (finalTargetX - globeGroup.rotation.x) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      if (window.innerWidth < 768) {
        setUseFallback(true);
        return;
      }
      const newW = container.clientWidth || 500;
      const newH = container.clientHeight || 500;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('pointerdown', handlePointerDown);
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerup', handlePointerUp);
      container.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();

      sphereGeo.dispose();
      sphereMat.dispose();
      wireMat.dispose();
      saCoastGeo.dispose();
      caMxCoastGeo.dispose();
      naCoastGeo.dispose();
      euAfCoastGeo.dispose();
      latamCoastMat.dispose();
      globalCoastMat.dispose();
      latamLandGeo.dispose();
      latamLandMat.dispose();
      hubPointsGeo.dispose();
      hubPointsMat.dispose();
      destGeo.dispose();
      destMat.dispose();
      renderer.dispose();

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [useFallback]);

  if (useFallback) {
    return <HeroGlobeFallback className={className} isReducedMotion={isReducedMotion} />;
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-none ${className}`}
      aria-label="Interactive 3D representation of LATAM technical engineering talent and role context"
    >
      {/* Overlay HTML Evidence Nodes aligned around the 3D globe */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Node 1: PROJECTS */}
        <div className="absolute top-[12%] left-[4%] px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/60 shadow-lg backdrop-blur-md flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-300 pointer-events-auto transition-transform hover:scale-105">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span>PROJECTS</span>
        </div>

        {/* Node 2: GITHUB */}
        <div className="absolute top-[14%] right-[4%] px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/60 shadow-lg backdrop-blur-md flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-300 pointer-events-auto transition-transform hover:scale-105">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span>GITHUB</span>
        </div>

        {/* Node 3: WORK EXP */}
        <div className="absolute bottom-[16%] left-[6%] px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/60 shadow-lg backdrop-blur-md flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-300 pointer-events-auto transition-transform hover:scale-105">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span>WORK EXP</span>
        </div>

        {/* Node 4: ROLE CONTEXT */}
        <div className="absolute bottom-[14%] right-[6%] px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/60 shadow-lg backdrop-blur-md flex items-center gap-1.5 text-[11px] font-mono font-medium text-slate-300 pointer-events-auto transition-transform hover:scale-105">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span>ROLE CONTEXT</span>
        </div>

        {/* Convergence Centerpiece: EVIDENCE BRIEF */}
        <div className="absolute top-[48%] left-[54%] -translate-x-1/2 -translate-y-1/2 p-3 rounded-xl bg-slate-900/95 border border-blue-500/50 shadow-2xl shadow-blue-500/20 backdrop-blur-md flex items-center gap-2.5 pointer-events-auto transition-transform hover:scale-105">
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-left">
            <span className="block text-[11px] font-mono font-bold tracking-wider text-white">EVIDENCE BRIEF</span>
            <span className="block text-[10px] text-slate-400 font-sans">Decision Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
