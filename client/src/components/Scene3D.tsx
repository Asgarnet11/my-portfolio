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
import { Float, PerformanceMonitor } from "@react-three/drei";
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

interface AbstractShapeProps {
  targets: React.RefObject<ScrollTargets>;
  isMobile: boolean;
  isLowTier: boolean;
  reducedMotion: boolean;
}

// 1. Deteksi spesifikasi perangkat lemah (Hardware concurrency, RAM, GPU mobile)
function detectLowSpecDevice(): boolean {
  if (typeof window === "undefined") return false;

  // CPU core count rendah (<= 4 cores)
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
    return true;
  }

  // RAM terbatas (<= 4 GB)
  if (
    "deviceMemory" in navigator &&
    (navigator as unknown as { deviceMemory: number }).deviceMemory <= 4
  ) {
    return true;
  }

  // Layar sentuh mobile beresolusi kecil
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

// 3. Error Boundary tangguh untuk menangkap kegagalan WebGL tanpa merobohkan halaman
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
                "radial-gradient(ellipse at 85% 25%, rgba(226, 158, 114, 0.16) 0%, rgba(255, 246, 236, 0) 65%)",
            }}
          />
        )
      );
    }
    return this.props.children;
  }
}

// 4. Komponen Bentuk Geometris 3D yang Teroptimasi
function AbstractShape({
  targets,
  isMobile,
  isLowTier,
  reducedMotion,
}: AbstractShapeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  // Memoize geometry & material agar tidak dialokasi ulang di setiap render / frame
  const { geometry, material, wireframeGeo, wireframeMat } = useMemo(() => {
    // Pada perangkat lemah, detail dikurangi (0 subdivisi = 20 facet)
    const geo = new THREE.IcosahedronGeometry(1.2, isLowTier ? 0 : 1);
    const mat = new THREE.MeshStandardMaterial({
      color: "#E29E72",
      roughness: 0.35,
      metalness: 0.12,
      flatShading: true,
      transparent: true,
      opacity: 0.9, // Menjaga kontras teks WCAG AA tetap di atas 5:1
    });

    const wGeo = new THREE.IcosahedronGeometry(1.2, isLowTier ? 0 : 1);
    const wMat = new THREE.MeshBasicMaterial({
      color: "#9C6B4E",
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });

    return {
      geometry: geo,
      material: mat,
      wireframeGeo: wGeo,
      wireframeMat: wMat,
    };
  }, [isLowTier]);

  // Pastikan memori WebGL dibersihkan saat unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
    };
  }, [geometry, material, wireframeGeo, wireframeMat]);

  useFrame((state, delta) => {
    // Jika prefers-reduced-motion aktif, hentikan semua rotasi & pergeseran kamera
    if (reducedMotion) {
      if (groupRef.current) {
        groupRef.current.position.set(isMobile ? 0 : 2.0, isMobile ? -0.8 : 0.2, 0);
        groupRef.current.rotation.set(0.2, 0.4, 0);
      }
      state.camera.position.set(0, 0, 6);
      return;
    }

    const t = targets.current;
    if (!t) return;

    // A. Ambient idle rotation (hanya berputar pelan bila bukan reduced-motion)
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.07;
      meshRef.current.rotation.y += delta * 0.09;
    }
    if (wireframeRef.current && !isLowTier) {
      wireframeRef.current.rotation.x += delta * 0.07;
      wireframeRef.current.rotation.y += delta * 0.09;
    }

    // B. Interpolasi posisi & rotasi grup scroll (ZERO dynamic allocation)
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.damp(
        groupRef.current.position.x,
        t.posX,
        3.5,
        delta
      );
      groupRef.current.position.y = THREE.MathUtils.damp(
        groupRef.current.position.y,
        t.posY,
        3.5,
        delta
      );
      groupRef.current.position.z = THREE.MathUtils.damp(
        groupRef.current.position.z,
        t.posZ,
        3.5,
        delta
      );

      groupRef.current.rotation.x = THREE.MathUtils.damp(
        groupRef.current.rotation.x,
        t.rotX,
        3.5,
        delta
      );
      groupRef.current.rotation.y = THREE.MathUtils.damp(
        groupRef.current.rotation.y,
        t.rotY,
        3.5,
        delta
      );
      groupRef.current.rotation.z = THREE.MathUtils.damp(
        groupRef.current.rotation.z,
        t.rotZ,
        3.5,
        delta
      );
    }

    // C. Parallax camera shift
    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      t.cameraX,
      2.5,
      delta
    );
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      t.cameraY,
      2.5,
      delta
    );
  });

  return (
    <Float
      speed={reducedMotion ? 0 : 1.5}
      rotationIntensity={reducedMotion ? 0 : 0.3}
      floatIntensity={reducedMotion ? 0 : 0.4}
      floatingRange={[-0.08, 0.08]}
    >
      <group
        ref={groupRef}
        position={[isMobile ? 0 : 2.0, isMobile ? -0.8 : 0.2, 0]}
        scale={isMobile ? 1.15 : 1.6}
      >
        <mesh
          ref={meshRef}
          geometry={geometry}
          material={material}
          castShadow={false}
          receiveShadow={false}
        />

        {/* Tampilkan wireframe aksen hanya bila bukan perangkat lemah */}
        {!isLowTier && (
          <mesh
            ref={wireframeRef}
            geometry={wireframeGeo}
            material={wireframeMat}
            scale={1.03}
            castShadow={false}
            receiveShadow={false}
          />
        )}
      </group>
    </Float>
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

  const targets = useRef<ScrollTargets>({
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    posX: isMobile ? 0 : 2.0,
    posY: isMobile ? -0.8 : 0.2,
    posZ: 0,
    cameraX: 0,
    cameraY: 0,
  });

  // A. Pantau visibilitas tab untuk menjeda render loop saat tab tidak aktif
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(document.visibilityState === "visible");
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // B. IntersectionObserver untuk menjeda render bila canvas tidak berada di viewport
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

  // C. Inisialisasi Lenis dan ScrollTrigger (dimatikan otomatis bila prefers-reduced-motion)
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
      const basePosX = isMobile ? 0 : 2.0;

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
        posX: isMobile ? 0.25 : basePosX - 0.3,
        posY: isMobile ? -0.6 : -0.25,
        cameraX: 0.15,
        cameraY: -0.3,
        ease: "power1.inOut",
      })
        .to(targets.current, {
          rotX: -0.35,
          rotY: Math.PI * 1.0,
          rotZ: -0.2,
          posX: isMobile ? -0.25 : basePosX + 0.15,
          posY: isMobile ? -0.7 : 0.15,
          cameraX: -0.15,
          cameraY: -0.6,
          ease: "power1.inOut",
        })
        .to(targets.current, {
          rotX: 0.3,
          rotY: Math.PI * 1.5,
          rotZ: 0.1,
          posX: isMobile ? 0.2 : basePosX - 0.2,
          posY: isMobile ? -0.65 : -0.3,
          cameraX: 0.12,
          cameraY: -0.85,
          ease: "power1.inOut",
        })
        .to(targets.current, {
          rotX: 0,
          rotY: Math.PI * 2.0,
          rotZ: 0,
          posX: isMobile ? 0 : basePosX,
          posY: isMobile ? -0.8 : 0.1,
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

  // Fallback visual bila WebGL tidak didukung perangkat
  if (!isWebGLSupported) {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        aria-hidden="true"
        tabIndex={-1}
        style={{
          background:
            "radial-gradient(ellipse at 85% 25%, rgba(226, 158, 114, 0.16) 0%, rgba(255, 246, 236, 0) 65%)",
        }}
      />
    );
  }

  // Tentukan mode frameloop: jeda total ('never') jika tab tersembunyi / offscreen, 'demand' bila reduced-motion
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
          {/* Penurunan kualitas adaptif: Bila FPS drop di bawah 45 fps (threshold 0.75), kurangi dpr & detail */}
          <PerformanceMonitor
            threshold={0.75}
            flipflops={3}
            onDecline={() => {
              setDpr(1);
            }}
            onIncline={() => {
              if (!isLowTier) setDpr(1.75);
            }}
            onFallback={() => {
              setIsLowTier(true);
              setDpr(1);
            }}
          />

          {/* Pencahayaan lembut selaras latar krem (#FFF6EC) */}
          <ambientLight intensity={1.2} color="#FFF8F0" />
          <directionalLight
            position={[5, 6, 5]}
            intensity={1.5}
            color="#FFE9D6"
          />
          {!isLowTier && (
            <directionalLight
              position={[-5, -4, -3]}
              intensity={0.4}
              color="#D8CCF4"
            />
          )}

          <Suspense fallback={null}>
            <AbstractShape
              targets={targets}
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
