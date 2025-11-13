
'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';

const BlackHoleAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // ==================== SCENE SETUP ====================
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 15);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);

    // ==================== POST-PROCESSING ====================
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.8,  // strength
      0.6,  // radius
      0.4   // threshold
    );
    composer.addPass(bloomPass);

    const outputPass = new OutputPass();
    composer.addPass(outputPass);

    // ==================== PHYSICS CONSTANTS ====================
    const G = 6.674e-11;
    const c = 299792458;
    const M = 1e31; // Black hole mass (arbitrary units for visualization)
    const rs = (2 * G * M) / (c * c); // Schwarzschild radius
    const blackHoleScale = 1.5; // Visual scale for rendering

    // ==================== EVENT HORIZON ====================
    const eventHorizonGeometry = new THREE.SphereGeometry(blackHoleScale, 64, 64);
    const eventHorizonMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.FrontSide,
    });
    const eventHorizon = new THREE.Mesh(eventHorizonGeometry, eventHorizonMaterial);
    scene.add(eventHorizon);

    // Inner shadow ring for depth
    const innerRingGeometry = new THREE.RingGeometry(blackHoleScale * 0.98, blackHoleScale * 1.05, 64);
    const innerRingMaterial = new THREE.MeshBasicMaterial({
      color: 0x111111,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const innerRing = new THREE.Mesh(innerRingGeometry, innerRingMaterial);
    innerRing.rotation.x = Math.PI / 2;
    scene.add(innerRing);

    // ==================== ACCRETION DISK PARTICLES (7000+) ====================
    const particleCount = 7000;
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const phases = new Float32Array(particleCount);

    const iscoRadius = blackHoleScale * 3;
    const diskInnerRadius = iscoRadius;
    const diskOuterRadius = iscoRadius * 4;
    const diskThickness = 0.8;

    // Initialize particles with 3D positions (volumetric rendering)
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = diskInnerRadius + Math.random() * (diskOuterRadius - diskInnerRadius);
      
      // Gaussian distribution for vertical height (volumetric depth)
      const height = (Math.random() - 0.5) * 2 * diskThickness * 
                     Math.exp(-Math.pow((radius - iscoRadius * 2) / diskOuterRadius, 2));

      const i3 = i * 3;
      positions[i3] = Math.cos(angle) * radius;
      positions[i3 + 1] = height;
      positions[i3 + 2] = Math.sin(angle) * radius;

      // Keplerian velocity (v ∝ 1/√r)
      const speed = 0.8 / Math.sqrt(radius / iscoRadius);
      velocities[i3] = -Math.sin(angle) * speed;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = Math.cos(angle) * speed;

      // Size variation based on depth
      sizes[i] = 0.05 + Math.random() * 0.1 * (diskOuterRadius / radius);

      // Color: Gray scale (monochromatic) with distance-based variation
      const distanceFactor = 1 - (radius - diskInnerRadius) / (diskOuterRadius - diskInnerRadius);
      const grayValue = 0.3 + distanceFactor * 0.7;
      colors[i3] = grayValue;
      colors[i3 + 1] = grayValue;
      colors[i3 + 2] = grayValue;

      phases[i] = Math.random() * Math.PI * 2;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // ==================== CUSTOM PARTICLE SHADER ====================
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        cameraPosition: { value: camera.position },
        blackHolePos: { value: new THREE.Vector3(0, 0, 0) },
        schwarzschildRadius: { value: blackHoleScale },
      },
      vertexShader: `
        uniform float time;
        uniform vec3 cameraPosition;
        uniform vec3 blackHolePos;
        uniform float schwarzschildRadius;
        
        attribute float size;
        attribute vec3 color;
        
        varying vec3 vColor;
        varying float vOpacity;
        
        void main() {
          vec3 pos = position;
          
          // Gravitational lensing approximation
          vec3 toBH = pos - blackHolePos;
          float dist = length(toBH);
          float rs = schwarzschildRadius * 1.5; // Photon sphere
          
          if (dist > rs) {
            float deflection = (rs * rs) / (dist * dist) * 0.5;
            vec3 perpendicular = normalize(cross(toBH, vec3(0.0, 1.0, 0.0)));
            pos += perpendicular * deflection;
          }
          
          // Doppler beaming (relativistic brightness)
          vec3 velocity = normalize(vec3(-position.z, 0.0, position.x));
          vec3 toCamera = normalize(cameraPosition - pos);
          float dopplerFactor = max(0.3, 1.0 + dot(velocity, toCamera) * 2.0);
          
          // Size based on distance (perspective)
          float camDist = distance(pos, cameraPosition);
          float perspectiveSize = size * (10.0 / camDist);
          
          // Opacity falloff with depth
          vOpacity = mix(0.4, 1.0, smoothstep(schwarzschildRadius * 6.0, schwarzschildRadius * 3.0, dist));
          vOpacity *= dopplerFactor;
          
          vColor = color * dopplerFactor;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = perspectiveSize * (300.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        
        void main() {
          // Circular particle with soft edge
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          // Soft glow falloff
          float alpha = smoothstep(0.5, 0.2, dist) * vOpacity;
          
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    particleSystem.rotation.x = Math.PI * 0.25; // 3D tilt on X axis
    particleSystem.rotation.z = Math.PI * 0.15; // 3D tilt on Z axis
    scene.add(particleSystem);

    // ==================== PHOTON SPHERE (BRIGHT RING) ====================
    const photonSphereGeometry = new THREE.TorusGeometry(blackHoleScale * 1.5, 0.08, 16, 100);
    const photonSphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
    });
    const photonSphere = new THREE.Mesh(photonSphereGeometry, photonSphereMaterial);
    photonSphere.rotation.x = Math.PI * 0.25;
    photonSphere.rotation.z = Math.PI * 0.15;
    scene.add(photonSphere);

    // ==================== SPACETIME GRID ====================
    const gridSize = 40;
    const gridDivisions = 60;
    const gridGeometry = new THREE.PlaneGeometry(gridSize, gridSize, gridDivisions, gridDivisions);
    
    const gridMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        blackHolePos: { value: new THREE.Vector3(0, 0, 0) },
        schwarzschildRadius: { value: blackHoleScale },
      },
      vertexShader: `
        uniform float time;
        uniform vec3 blackHolePos;
        uniform float schwarzschildRadius;
        
        varying float vWarp;
        
        void main() {
          vec3 pos = position;
          
          // Distance from black hole
          float dist = distance(pos, blackHolePos);
          
          // Dramatic gravitational warping (Schwarzschild metric approximation)
          float warp = smoothstep(20.0, 2.0, dist);
          float warpIntensity = warp * warp * warp * 5.0; // Cubic for dramatic effect
          
          // Warp downward towards black hole
          pos.z -= warpIntensity;
          
          vWarp = warp;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying float vWarp;
        
        void main() {
          // Brighter near black hole
          float brightness = 0.1 + vWarp * 0.3;
          gl_FragColor = vec4(vec3(brightness), 0.3 + vWarp * 0.3);
        }
      `,
      wireframe: true,
      transparent: true,
      side: THREE.DoubleSide,
    });
    
    const grid = new THREE.Mesh(gridGeometry, gridMaterial);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = -3;
    scene.add(grid);

    // ==================== BACKGROUND STARS WITH LENSING ====================
    const starCount = 300;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 30 + Math.random() * 20;

      starPositions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      starPositions[i3 + 2] = radius * Math.cos(phi);
      
      starSizes[i] = 0.5 + Math.random() * 1.0;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.8,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // ==================== ANIMATION LOOP ====================
    let time = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);
      
      const delta = clock.getDelta();
      time += delta;

      // Update particle system rotation (orbital motion)
      particleSystem.rotation.y += 0.0005;

      // Update photon sphere rotation
      photonSphere.rotation.y += 0.001;

      // Update shader uniforms
      particleMaterial.uniforms.time.value = time;
      particleMaterial.uniforms.cameraPosition.value.copy(camera.position);
      gridMaterial.uniforms.time.value = time;

      // Subtle camera orbit
      camera.position.x = Math.sin(time * 0.05) * 0.5;
      camera.lookAt(0, 0, 0);

      composer.render();
    };

    animate();

    // ==================== WINDOW RESIZE ====================
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      composer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // ==================== CLEANUP ====================
    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      
      particleGeometry.dispose();
      particleMaterial.dispose();
      eventHorizonGeometry.dispose();
      eventHorizonMaterial.dispose();
      photonSphereGeometry.dispose();
      photonSphereMaterial.dispose();
      gridGeometry.dispose();
      gridMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: '#000',
      }}
    />
  );
};

export default BlackHoleAnimation;
