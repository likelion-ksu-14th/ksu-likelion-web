"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  Suspense,
  useMemo,
} from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { Float, Sparkles, Environment } from "@react-three/drei";
import * as THREE from "three";

// ─────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────
const LOGO_URL = "https://i.ibb.co/xq5LMy14/001-18.png";
const EXPLOSION_PARTICLE_COUNT = 90;
const EXPLOSION_DURATION_MS = 1600;

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
interface MousePos {
  x: number;
  y: number;
}

interface ExplosionState {
  active: boolean;
  origin: THREE.Vector3;
}

interface MetallicLogoProps {
  mousePos: MousePos;
  onExplode: (origin: THREE.Vector3) => void;
}

// ─────────────────────────────────────────────────────────
// MetallicLogo — bumpMapped plane with orange clearcoat
// ─────────────────────────────────────────────────────────
function MetallicLogo({ mousePos, onExplode }: MetallicLogoProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const texture = useLoader(THREE.TextureLoader, LOGO_URL, (loader) => {
    loader.crossOrigin = "anonymous";
  });

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
  }, [texture]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (meshRef.current) {
      // Smooth mouse-driven rotation
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        mousePos.x * 0.5,
        0.04
      );
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -mousePos.y * 0.35,
        0.04
      );
    }

    // Glow layer pulses independently
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(t * 1.8) * 0.04;
    }
  });

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      onExplode(e.point.clone());
    },
    [onExplode]
  );

  return (
    <Float speed={1.4} rotationIntensity={0.1} floatIntensity={0.65}>
      {/* Soft additive glow behind the logo */}
      <mesh ref={glowRef} scale={1.18}>
        <planeGeometry args={[3.2, 3.2]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Main metallic mesh */}
      <mesh ref={meshRef} onClick={handleClick}>
        <planeGeometry args={[3.2, 3.2]} />
        <meshPhysicalMaterial
          map={texture}
          bumpMap={texture}
          bumpScale={0.3}
          transparent
          alphaTest={0.01}
          metalness={1.0}
          roughness={0.06}
          color={new THREE.Color(0xff7733)}
          clearcoat={1.0}
          clearcoatRoughness={0.04}
          envMapIntensity={4.0}
          iridescence={0.5}
          iridescenceIOR={1.8}
          iridescenceThicknessRange={[80, 400]}
        />
      </mesh>
    </Float>
  );
}

// ─────────────────────────────────────────────────────────
// ExplosionBurst — radial particle burst on click
// ─────────────────────────────────────────────────────────
function ExplosionBurst({ state }: { state: ExplosionState }) {
  const pointsRef = useRef<THREE.Points>(null);
  const progressRef = useRef(0);

  const { geometry, velocities } = useMemo(() => {
    const positions = new Float32Array(EXPLOSION_PARTICLE_COUNT * 3);
    const velocities: THREE.Vector3[] = [];

    for (let i = 0; i < EXPLOSION_PARTICLE_COUNT; i++) {
      positions[i * 3 + 0] = state.origin.x;
      positions[i * 3 + 1] = state.origin.y;
      positions[i * 3 + 2] = state.origin.z;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = Math.random() * 3 + 0.8;
      velocities.push(
        new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.sin(phi) * Math.sin(theta) * speed,
          Math.cos(phi) * speed * 0.5
        )
      );
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry: geo, velocities };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.active]);

  useFrame((_, delta) => {
    if (!pointsRef.current || !state.active) return;

    progressRef.current += delta;
    const t = progressRef.current;

    const posAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    for (let i = 0; i < EXPLOSION_PARTICLE_COUNT; i++) {
      posAttr.setXYZ(
        i,
        state.origin.x + velocities[i].x * t,
        state.origin.y + velocities[i].y * t,
        state.origin.z + velocities[i].z * t * 0.4
      );
    }
    posAttr.needsUpdate = true;

    const mat = pointsRef.current.material as THREE.PointsMaterial;
    mat.opacity = Math.max(0, 1 - t / (EXPLOSION_DURATION_MS / 1000));
  });

  useEffect(() => {
    progressRef.current = 0;
  }, [state.active]);

  if (!state.active) return null;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#ff8833"
        size={0.065}
        transparent
        opacity={1}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ─────────────────────────────────────────────────────────
// SceneLights — two orbiting points + fills
// ─────────────────────────────────────────────────────────
function SceneLights() {
  const warmRef = useRef<THREE.PointLight>(null);
  const rimRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (warmRef.current) {
      warmRef.current.position.set(
        Math.sin(t * 0.4) * 6,
        Math.cos(t * 0.3) * 3,
        3
      );
    }
    if (rimRef.current) {
      rimRef.current.position.set(
        Math.cos(t * 0.35) * 5,
        Math.sin(t * 0.5) * 2.5,
        -1
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight ref={warmRef} color="#ff8833" intensity={14} decay={2} />
      <pointLight ref={rimRef} color="#4433dd" intensity={8} decay={2} />
      <pointLight color="#ff2255" intensity={5} position={[0, -5, 2]} decay={2} />
      <directionalLight color="#ffddaa" intensity={2.2} position={[2, 4, 4]} />
    </>
  );
}

// ─────────────────────────────────────────────────────────
// Scene — state manager for explosion
// ─────────────────────────────────────────────────────────
function Scene({ mousePos }: { mousePos: MousePos }) {
  const [explosion, setExplosion] = useState<ExplosionState>({
    active: false,
    origin: new THREE.Vector3(),
  });
  const burstTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const triggerExplosion = useCallback((origin: THREE.Vector3) => {
    if (burstTimerRef.current) clearTimeout(burstTimerRef.current);
    setExplosion({ active: true, origin });
    burstTimerRef.current = setTimeout(() => {
      setExplosion((prev) => ({ ...prev, active: false }));
    }, EXPLOSION_DURATION_MS);
  }, []);

  useEffect(
    () => () => {
      if (burstTimerRef.current) clearTimeout(burstTimerRef.current);
    },
    []
  );

  return (
    <>
      <SceneLights />
      <Environment preset="sunset" />
      <Sparkles
        count={80}
        scale={12}
        size={1.0}
        speed={0.25}
        color="#ffaa55"
      />
      <Suspense fallback={null}>
        <MetallicLogo mousePos={mousePos} onExplode={triggerExplosion} />
      </Suspense>
      <ExplosionBurst state={explosion} />
    </>
  );
}

// ─────────────────────────────────────────────────────────
// HeroScene3D — canvas entry point
// ─────────────────────────────────────────────────────────
export default function HeroScene3D() {
  const [mousePos, setMousePos] = useState<MousePos>({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 50 }}
      dpr={[1, 2]}
      style={{ position: "absolute", inset: 0 }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.6,
      }}
    >
      <Scene mousePos={mousePos} />
    </Canvas>
  );
}
