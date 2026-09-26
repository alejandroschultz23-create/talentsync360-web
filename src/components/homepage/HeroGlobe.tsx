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

    // 3. LATAM Tech Hub Data Points
    // Convert lat/long to 3D sphere coordinate
    const latLongToVector3 = (lat: number, lon: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

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
      const pos = latLongToVector3(h.lat, h.lon, 1.01);
      hubPositions.push(pos.x, pos.y, pos.z);
    });
    hubPointsGeo.setAttribute('position', new THREE.Float32BufferAttribute(hubPositions, 3));

    const hubPointsMat = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 0.045,
      transparent: true,
      opacity: 0.9,
    });
    const hubPoints = new THREE.Points(hubPointsGeo, hubPointsMat);
    globeGroup.add(hubPoints);

    // 4. Subtle Destination Hubs (US & Europe)
    const destHubs = [
      { name: 'NewYork', lat: 40.7128, lon: -74.006 },
      { name: 'SanFrancisco', lat: 37.7749, lon: -122.4194 },
      { name: 'London', lat: 51.5074, lon: -0.1278 },
      { name: 'Berlin', lat: 52.52, lon: 13.405 },
    ];
    const destPositions: number[] = [];
    destHubs.forEach((h) => {
      const pos = latLongToVector3(h.lat, h.lon, 1.01);
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

    // 5. Connecting Spline Arcs from LATAM to US/EU
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

    // Mouse Interaction (Bounded Parallax)
    let targetRotationX = 0.25;
    let targetRotationY = -1.2;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = relX;
      mouseY = relY;
      // Bounded parallax offset
      targetRotationY = -1.2 + mouseX * 0.25;
      targetRotationX = 0.25 + mouseY * 0.2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

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

      // Slow perpetual idle drift
      targetRotationY += 0.04 * delta;

      // Smooth damped lerp
      globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.05;
      globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.05;

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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      observer.disconnect();

      sphereGeo.dispose();
      sphereMat.dispose();
      wireMat.dispose();
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
      className={`relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center pointer-events-none select-none ${className}`}
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
