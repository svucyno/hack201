'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

export default function ThreeBlochSphere({ 
  theta = 0, 
  phi = 0, 
  x = 0, 
  y = 0, 
  z = 1, 
  qubitIndex = 0,
  size = 280,
  interactive = true 
}) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(2.2, 1.6, 2.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(size, size);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    currentMount.appendChild(renderer.domElement);

    // Group for all rotatable objects
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // 1. Translucent Quantum Sphere Body
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 24);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      color: 0x0f172a,
      transparent: true,
      opacity: 0.45,
      shininess: 90,
      specular: 0x38bdf8,
      wireframe: false,
    });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphereGroup.add(sphereMesh);

    // 2. Wireframe Latitudes & Meridians
    const wireGeo = new THREE.WireframeGeometry(new THREE.SphereGeometry(1.002, 16, 12));
    const wireMat = new THREE.LineBasicMaterial({ color: 0x334155, transparent: true, opacity: 0.35 });
    const wireMesh = new THREE.LineSegments(wireGeo, wireMat);
    sphereGroup.add(wireMesh);

    // 3. Equator Ring (XY plane)
    const ringGeo = new THREE.RingGeometry(0.995, 1.005, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    sphereGroup.add(ringMesh);

    // 4. Coordinate Axes (Z: Up=Cyan, X: Right=Emerald, Y: Depth=Amber)
    const createAxis = (from, to, color) => {
      const points = [from, to];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({ color, linewidth: 2, transparent: true, opacity: 0.8 });
      return new THREE.Line(geo, mat);
    };

    sphereGroup.add(createAxis(new THREE.Vector3(0, -1.25, 0), new THREE.Vector3(0, 1.25, 0), 0x06b6d4)); // Z-axis (Up/Down)
    sphereGroup.add(createAxis(new THREE.Vector3(-1.25, 0, 0), new THREE.Vector3(1.25, 0, 0), 0x10b981)); // X-axis (Left/Right)
    sphereGroup.add(createAxis(new THREE.Vector3(0, 0, -1.25), new THREE.Vector3(0, 0, 1.25), 0xf59e0b)); // Y-axis (In/Out)

    // 5. State Vector Arrow (Three.js coordinates: Y is Up, X is Right, Z is Forward)
    // Convert Bloch (Z is up, X is forward, Y is right/depth):
    // Target unit vector from spherical coordinates:
    const thetaRad = THREE.MathUtils.degToRad(theta);
    const phiRad = THREE.MathUtils.degToRad(phi);

    const dirX = Math.sin(thetaRad) * Math.cos(phiRad);
    const dirZ = Math.sin(thetaRad) * Math.sin(phiRad); // depth
    const dirY = Math.cos(thetaRad); // up

    const arrowDirection = new THREE.Vector3(dirX, dirY, dirZ).normalize();
    const arrowLength = Math.min(1.0, Math.sqrt(x*x + y*y + z*z) || 1.0);
    const arrowColor = 0x38bdf8;

    const arrowHelper = new THREE.ArrowHelper(
      arrowDirection,
      new THREE.Vector3(0, 0, 0),
      arrowLength,
      arrowColor,
      0.22,
      0.12
    );
    sphereGroup.add(arrowHelper);

    // Tip glow sphere
    const tipGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const tipMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const tipMesh = new THREE.Mesh(tipGeo, tipMat);
    tipMesh.position.copy(arrowDirection.clone().multiplyScalar(arrowLength));
    sphereGroup.add(tipMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x38bdf8, 2.5, 10);
    pointLight.position.set(3, 3, 3);
    scene.add(pointLight);

    const backLight = new THREE.PointLight(0x8b5cf6, 1.5, 10);
    backLight.position.set(-3, -2, -2);
    scene.add(backLight);

    // Mouse Drag Rotation
    let isDragging = false;
    let prevMousePos = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      if (!interactive) return;
      isDragging = true;
      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging || !interactive) return;
      const deltaX = e.clientX - prevMousePos.x;
      const deltaY = e.clientY - prevMousePos.y;

      sphereGroup.rotation.y += deltaX * 0.01;
      sphereGroup.rotation.x += deltaY * 0.01;

      prevMousePos = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => { isDragging = false; };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile
    const onTouchStart = (e) => {
      if (!interactive || e.touches.length === 0) return;
      isDragging = true;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e) => {
      if (!isDragging || !interactive || e.touches.length === 0) return;
      const deltaX = e.touches[0].clientX - prevMousePos.x;
      const deltaY = e.touches[0].clientY - prevMousePos.y;
      sphereGroup.rotation.y += deltaX * 0.01;
      sphereGroup.rotation.x += deltaY * 0.01;
      prevMousePos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDragging = false; };

    dom.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isDragging) {
        sphereGroup.rotation.y += 0.003; // Gentle idle rotation
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      dom.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (currentMount.contains(renderer.domElement)) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [theta, phi, x, y, z, size, interactive]);

  return (
    <div className="relative flex flex-col items-center justify-center select-none group">
      <div 
        ref={mountRef} 
        className="cursor-grab active:cursor-grabbing relative flex items-center justify-center rounded-full overflow-hidden transition-all duration-300 group-hover:drop-shadow-[0_0_25px_rgba(56,189,248,0.25)]"
        style={{ width: size, height: size }}
      />
      {interactive && (
        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
          Drag to Orbit 3D Sphere
        </span>
      )}
    </div>
  );
}
