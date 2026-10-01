import React, {
  Component,
  type ErrorInfo,
  type ReactNode,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PerformanceMonitor, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger);

interface ScrollTargets {
  rotX: number;
  rotY: number;
  rotZ: number;
  posX: number;
  posY: number;
  posZ: number;
  cameraX: number;
  cameraY: number;
}

interface QuantumOrbitalProps {
  targets: React.RefObject<ScrollTargets>;
  mouseRef: React.RefObject<{ x: number; y: number }>;
  isMobile: boolean;
  isLowTier: boolean;
  reducedMotion: boolean;
}

// 1. Deteksi spesifikasi perangkat lemah
function detectLowSpecDevice(): boolean {
  if (typeof window === "undefined") return false;

  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
    return true;
  }

  if (
    "deviceMemory" in navigator &&
    (navigator as unknown as { deviceMemory: number }).deviceMemory <= 4
  ) {
    return true;
  }

  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (isTouch && window.innerWidth < 768) {
    return true;
  }

  return false;
}

// 2. Deteksi dukungan WebGL peramban
function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

// 3. Error Boundary tangguh untuk kegagalan WebGL
interface ErrorBoundaryState {
  hasError: boolean;
}

class Scene3DErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Scene3D WebGL failure captured by Error Boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
            aria-hidden="true"
            tabIndex={-1}
            style={{
              background:
                "radial-gradient(ellipse at 80% 20%, rgba(226, 168, 120, 0.12) 0%, rgba(255, 246, 236, 0) 60%)",
            }}
          />
        )
      );
    }
    return this.props.children;
  }
}

// 4. Komposisi 3D Modern: Quantum Orbital Glass Ring & Core
function QuantumOrbital({
  targets,
  mouseRef,
  isMobile,
  isLowTier,
  reducedMotion,
}: QuantumOrbitalProps) {
  const mainGroupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const satellite1Ref = useRef<THREE.Mesh>(null);
  const satellite2Ref = useRef<THREE.Mesh>(null);

  // Waktu orbit satelit
  const orbitTime = useRef(0);

  // Memoize seluruh Geometri & Material untuk ZERO alokasi berulang
  const assets = useMemo(() => {
    // A. Core: Dodecahedron bertekstur kristal/kaca lembut
    const coreGeo = new THREE.DodecahedronGeometry(0.72, isLowTier ? 0 : 1);
    const coreMat = isLowTier
      ? new THREE.MeshStandardMaterial({
          color: "#F6E8DA",
          roughness: 0.25,
          metalness: 0.15,
          transparent: true,
          opacity: 0.85,
        })
      : new THREE.MeshPhysicalMaterial({
          color: "#FFF5EC",
          roughness: 0.12,
          metalness: 0.08,
          clearcoat: 1.0,
          clearcoatRoughness: 0.1,
          transmission: 0.75, // Efek frosted glass mewah
          ior: 1.45,
          thickness: 1.5,
          transparent: true,
          opacity: 0.82,
        });

    // B. Cincin Orbital 1 (Slender metallic ring luar)
    const ring1Geo = new THREE.TorusGeometry(1.65, 0.03, isLowTier ? 12 : 24, isLowTier ? 48 : 96);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: "#E2A478",
      roughness: 0.2,
      metalness: 0.8, // Kilau metallic gold/champagne
    });

    // C. Cincin Orbital 2 (Slender frosted ring dalam)
    const ring2Geo = new THREE.TorusGeometry(1.25, 0.024, isLowTier ? 12 : 24, isLowTier ? 48 : 96);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: "#D4C2F0",
      roughness: 0.3,
      metalness: 0.5, // Aksen lilac/iridescent halus
      transparent: true,
      opacity: 0.8,
    });

    // D. Node Satelit Mini (Partikel teknologi bersinar)
    const satGeo = new THREE.SphereGeometry(0.065, 12, 12);
    const sat1Mat = new THREE.MeshStandardMaterial({
      color: "#FFB066",
      emissive: "#FF8C33",
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });
    const sat2Mat = new THREE.MeshStandardMaterial({
      color: "#C2A8F5",
      emissive: "#9973E8",
      emissiveIntensity: 0.8,
      roughness: 0.2,
    });

    return {
      coreGeo,
      coreMat,
      ring1Geo,
      ring1Mat,
      ring2Geo,
      ring2Mat,
      satGeo,
      sat1Mat,
      sat2Mat,
    };
  }, [isLowTier]);

  // Pembersihan memori WebGL saat unmount
  useEffect(() => {
    return () => {
      assets.coreGeo.dispose();
      assets.coreMat.dispose();
      assets.ring1Geo.dispose();
      assets.ring1Mat.dispose();
      assets.ring2Geo.dispose();
      assets.ring2Mat.dispose();
      assets.satGeo.dispose();
      assets.sat1Mat.dispose();
      assets.sat2Mat.dispose();
    };
  }, [assets]);

  useFrame((state, delta) => {
    if (reducedMotion) {
      if (mainGroupRef.current) {
        mainGroupRef.current.position.set(isMobile ? 0 : 2.4, isMobile ? -0.8 : 0.1, -0.4);
        mainGroupRef.current.rotation.set(0.2, 0.4, 0);
      }
      state.camera.position.set(0, 0, 6);
      return;
    }

    const t = targets.current;
    const mouse = mouseRef.current || { x: 0, y: 0 };
    if (!t) return;

    // 1. Pergerakan orbit mandiri untuk cincin & core
    orbitTime.current += delta;
    const time = orbitTime.current;

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = 0.8 + Math.sin(time * 0.4) * 0.15;
      ring1Ref.current.rotation.y = time * 0.25;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -0.6 + Math.cos(time * 0.35) * 0.15;
      ring2Ref.current.rotation.y = -time * 0.3;
    }
    if (coreRef.current) {
      coreRef.current.rotation.x += delta * 0.1;
      coreRef.current.rotation.y += delta * 0.14;
    }

    // Posisi satelit mengitari cincin
    if (satellite1Ref.current) {
      const angle1 = time * 0.8;
      satellite1Ref.current.position.set(
        Math.cos(angle1) * 1.65,
        Math.sin(angle1) * 0.4,
        Math.sin(angle1) * 1.65
      );
    }
    if (satellite2Ref.current && !isLowTier) {
      const angle2 = -time * 0.9 + 2;
      satellite2Ref.current.position.set(
        Math.cos(angle2) * 1.25,
        Math.sin(angle2) * 0.5,
        Math.sin(angle2) * 1.25
      );
    }

    // 2. Interpolasi Scroll + Interaktivitas Mouse Parallax
    if (mainGroupRef.current) {
      // Parallax mouse halus
      const mouseTiltX = mouse.y * 0.25;
      const mouseTiltY = mouse.x * 0.35;

      mainGroupRef.current.position.x = THREE.MathUtils.damp(
        mainGroupRef.current.position.x,
        t.posX + mouse.x * 0.2,
        3.5,
        delta
      );
      mainGroupRef.current.position.y = THREE.MathUtils.damp(
        mainGroupRef.current.position.y,
        t.posY + mouse.y * 0.2,
        3.5,
        delta
      );
      mainGroupRef.current.position.z = THREE.MathUtils.damp(
        mainGroupRef.current.position.z,
        t.posZ,
        3.5,
        delta
      );

      mainGroupRef.current.rotation.x = THREE.MathUtils.damp(
        mainGroupRef.current.rotation.x,
        t.rotX + mouseTiltX,
        3.5,
        delta
      );
      mainGroupRef.current.rotation.y = THREE.MathUtils.damp(
        mainGroupRef.current.rotation.y,
        t.rotY + mouseTiltY,
        3.5,
        delta
      );
      mainGroupRef.current.rotation.z = THREE.MathUtils.damp(
        mainGroupRef.current.rotation.z,
        t.rotZ,
        3.5,
        delta
      );
    }

    // 3. Parallax kamera yang lembut
    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      t.cameraX + mouse.x * 0.15,
      2.5,
      delta
    );
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      t.cameraY - mouse.y * 0.15,
      2.5,
      delta
    );
  });

  return (
    <>
      {/* Debu partikel atmosferik halus (Stardust depth) */}
      <Sparkles
        count={isLowTier ? 20 : 50}
        scale={[12, 10, 6]}
        size={isMobile ? 1.8 : 2.5}
        speed={reducedMotion ? 0 : 0.3}
        opacity={0.45}
        color="#E2A478"
      />

      <Float
        speed={reducedMotion ? 0 : 1.4}
        rotationIntensity={reducedMotion ? 0 : 0.2}
        floatIntensity={reducedMotion ? 0 : 0.35}
        floatingRange={[-0.06, 0.06]}
      >
        <group
          ref={mainGroupRef}
          position={[isMobile ? 0 : 2.4, isMobile ? -0.85 : 0.1, -0.4]}
          scale={isMobile ? 0.95 : 1.3}
        >
          {/* Core Kristal Kaca Halus */}
          <mesh
            ref={coreRef}
            geometry={assets.coreGeo}
            material={assets.coreMat}
            castShadow={false}
            receiveShadow={false}
          />

          {/* Cincin Orbital 1 (Metallic Gold) */}
          <mesh
            ref={ring1Ref}
            geometry={assets.ring1Geo}
            material={assets.ring1Mat}
            castShadow={false}
            receiveShadow={false}
          />

          {/* Cincin Orbital 2 (Frosted Iridescent) */}
          <mesh
            ref={ring2Ref}
            geometry={assets.ring2Geo}
            material={assets.ring2Mat}
            castShadow={false}
            receiveShadow={false}
          />

          {/* Satelit Mengorbit */}
          <mesh
            ref={satellite1Ref}
            geometry={assets.satGeo}
            material={assets.sat1Mat}
          />
          {!isLowTier && (
            <mesh
              ref={satellite2Ref}
              geometry={assets.satGeo}
              material={assets.sat2Mat}
            />
          )}
        </group>
      </Float>
    </>
  );
}

// 5. Komponen Utama Scene3D
export default function Scene3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isWebGLSupported] = useState(() => checkWebGLSupport());
  const [isLowTier, setIsLowTier] = useState(() => detectLowSpecDevice());
  const [dpr, setDpr] = useState<number>(() => (detectLowSpecDevice() ? 1 : 1.5));
  const [isTabVisible, setIsTabVisible] = useState(true);
  const [isIntersecting, setIsIntersecting] = useState(true);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const mouseRef = useRef({ x: 0, y: 0 });

  // Posisi target scroll (ditempatkan anggun di area kanan agar tidak menabrak foto kartu)
  const targets = useRef<ScrollTargets>({
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    posX: isMobile ? 0 : 2.4,
    posY: isMobile ? -0.85 : 0.1,
    posZ: -0.4,
    cameraX: 0,
    cameraY: 0,
  });

  // Track pergerakan kursor mouse untuk parallax interaktif
  useEffect(() => {
    if (reducedMotion || isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalisasi -1 ke 1
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [reducedMotion, isMobile]);

  // Pantau visibilitas tab untuk jeda render loop
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let observer: IntersectionObserver | null = null;
    if (containerRef.current && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          setIsIntersecting(entry.isIntersecting);
        },
        { threshold: 0.01 }
      );
      observer.observe(containerRef.current);
    }

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (observer) observer.disconnect();
    };
  }, []);

  // Inisialisasi Lenis dan ScrollTrigger
  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: false,
    });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    const onLenisScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", onLenisScroll);

    const onTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTicker);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      const basePosX = isMobile ? 0 : 2.4;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.4,
        },
      });

      tl.to(targets.current, {
        rotX: 0.45,
        rotY: Math.PI * 0.5,
        rotZ: 0.15,
        posX: isMobile ? 0.2 : basePosX - 0.35,
        posY: isMobile ? -0.7 : -0.2,
        cameraX: 0.12,
        cameraY: -0.3,
        ease: "power1.inOut",
      })
        .to(targets.current, {
          rotX: -0.35,
          rotY: Math.PI * 1.0,
          rotZ: -0.2,
          posX: isMobile ? -0.2 : basePosX + 0.2,
          posY: isMobile ? -0.75 : 0.15,
          cameraX: -0.12,
          cameraY: -0.6,
          ease: "power1.inOut",
        })
        .to(targets.current, {
          rotX: 0.3,
          rotY: Math.PI * 1.5,
          rotZ: 0.1,
          posX: isMobile ? 0.15 : basePosX - 0.25,
          posY: isMobile ? -0.7 : -0.25,
          cameraX: 0.1,
          cameraY: -0.85,
          ease: "power1.inOut",
        })
        .to(targets.current, {
          rotX: 0,
          rotY: Math.PI * 2.0,
          rotZ: 0,
          posX: isMobile ? 0 : basePosX,
          posY: isMobile ? -0.85 : 0.05,
          cameraX: 0,
          cameraY: -1.1,
          ease: "power1.inOut",
        });

      ScrollTrigger.refresh();
    });

    return () => {
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      gsap.ticker.remove(onTicker);
      lenis.off("scroll", onLenisScroll);
      lenis.destroy();
      ctx.revert();
    };
  }, [isMobile, reducedMotion]);

  // Fallback visual bila WebGL tidak tersedia
  if (!isWebGLSupported) {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
        tabIndex={-1}
        style={{
          background:
            "radial-gradient(ellipse at 80% 20%, rgba(226, 168, 120, 0.12) 0%, rgba(255, 246, 236, 0) 60%)",
        }}
      />
    );
  }

  const currentFrameloop: "always" | "demand" | "never" =
    !isTabVisible || !isIntersecting
      ? "never"
      : reducedMotion
      ? "demand"
      : "always";

  return (
    <Scene3DErrorBoundary>
      <div
        ref={containerRef}
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
        tabIndex={-1}
        style={{ pointerEvents: "none" }}
      >
        <Canvas
          frameloop={currentFrameloop}
          dpr={[1, dpr]}
          camera={{ position: [0, 0, 6], fov: 45 }}
          gl={{
            alpha: true,
            antialias: !isLowTier,
            powerPreference: "high-performance",
          }}
          style={{ pointerEvents: "none", width: "100%", height: "100%" }}
          aria-hidden="true"
          tabIndex={-1}
        >
          {/* Adaptasi performa otomatis */}
          <PerformanceMonitor
            threshold={0.75}
            flipflops={3}
            onDecline={() => {
              setDpr(1);
            }}
            onIncline={() => {
              if (!isLowTier) setDpr(1.5);
            }}
            onFallback={() => {
              setIsLowTier(true);
              setDpr(1);
            }}
          />

          {/* Tata cahaya studio: Warm Key Light + Iridescent Rim Light */}
          <ambientLight intensity={1.1} color="#FFF8F0" />
          <directionalLight
            position={[6, 8, 6]}
            intensity={1.8}
            color="#FFF4E6"
          />
          <directionalLight
            position={[-6, -4, -4]}
            intensity={0.8}
            color="#D8CCF4" // Soft lavender rim reflections
          />
          <pointLight
            position={[2, 0, 3]}
            intensity={0.5}
            color="#FFDDBB"
          />

          <Suspense fallback={null}>
            <QuantumOrbital
              targets={targets}
              mouseRef={mouseRef}
              isMobile={isMobile}
              isLowTier={isLowTier}
              reducedMotion={reducedMotion}
            />
          </Suspense>
        </Canvas>
      </div>
    </Scene3DErrorBoundary>
  );
}
