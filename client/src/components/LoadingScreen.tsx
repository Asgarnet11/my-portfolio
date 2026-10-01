import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../lib/api";

interface LenisInstance {
  stop: () => void;
  start: () => void;
}

export default function LoadingScreen() {
  const { progress: r3fProgress, active: r3fActive } = useProgress();

  const [displayProgress, setDisplayProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  // Target progress yang dihitung secara dinamis
  const targetProgressRef = useRef(15);
  // Nilai float saat interpolasi
  const currentProgressRef = useRef(0);
  // Status data API selesai (berhasil / gagal)
  const apiFinishedRef = useRef(false);
  // Menandai apakah loading sudah diselesaikan (mencegah double trigger)
  const isCompletedRef = useRef(false);

  // Deteksi prefers-reduced-motion pengguna
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Kunci scroll selama loading dan pastikan dikembalikan saat selesai/unmount
  useEffect(() => {
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    const lockScroll = () => {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      const lenis = (window as unknown as { __lenis?: LenisInstance }).__lenis;
      if (lenis) lenis.stop();
    };

    const unlockScroll = () => {
      document.body.style.overflow = originalBodyOverflow || "";
      document.documentElement.style.overflow = originalHtmlOverflow || "";
      const lenis = (window as unknown as { __lenis?: LenisInstance }).__lenis;
      if (lenis) lenis.start();
    };

    lockScroll();

    return () => {
      unlockScroll();
    };
  }, []);

  // 2. Muat data backend Express dan pantau batas waktu (Timeout 8s & batas maksimal 1.2s untuk aset ringan)
  useEffect(() => {
    let isSubscribed = true;

    // A. Fetch data awal backend
    const fetchCriticalData = async () => {
      try {
        await Promise.allSettled([
          api.get("/sections/public"),
          api.get("/projects/public"),
        ]);
        if (isSubscribed) {
          apiFinishedRef.current = true;
        }
      } catch (err) {
        console.warn("Koneksi API lambat atau gagal:", err);
        if (isSubscribed) {
          apiFinishedRef.current = true;
          setApiError(
            "Koneksi backend lambat. Menampilkan konten yang tersedia secara offline/cache."
          );
        }
      }
    };

    fetchCriticalData();

    // B. Batas waktu 8 detik: Bila API lambat atau gagal, jangan macet di 99%
    const timeout8s = setTimeout(() => {
      if (!isCompletedRef.current) {
        console.warn("Batas waktu 8 detik loading terlewati. Membuka situs...");
        apiFinishedRef.current = true;
        setApiError(
          "Koneksi ke backend membutuhkan waktu lebih lama. Data akan diperbarui di latar belakang."
        );
        targetProgressRef.current = 100;
      }
    }, 8000);

    // C. Jika tidak ada aset 3D berat (atau selesai cepat), jangan tampil lebih dari 1.2 detik
    const fastLoadTimer = setTimeout(() => {
      if (isSubscribed && (!r3fActive || r3fProgress >= 100)) {
        targetProgressRef.current = 100;
      }
    }, 1200);

    return () => {
      isSubscribed = false;
      clearTimeout(timeout8s);
      clearTimeout(fastLoadTimer);
    };
  }, [r3fActive, r3fProgress]);

  // 3. Gabungkan progress aset 3D (useProgress) dan API Express
  useEffect(() => {
    if (isCompletedRef.current) return;

    // Bobot: 50% aset 3D, 50% data API backend
    const threeWeight = r3fActive ? (r3fProgress || 0) * 0.5 : 50;
    const apiWeight = apiFinishedRef.current ? 50 : 25;
    const combined = Math.min(100, Math.round(threeWeight + apiWeight));

    // Angka persentase tidak boleh mundur
    if (combined > targetProgressRef.current) {
      targetProgressRef.current = combined;
    }

    // Jika aset 3D selesai dan API selesai, capai 100%
    if ((!r3fActive || r3fProgress >= 100) && apiFinishedRef.current) {
      targetProgressRef.current = 100;
    }
  }, [r3fProgress, r3fActive]);

  // 4. Loop interpolasi halus (requestAnimationFrame) agar angka tidak melompat kasar
  useEffect(() => {
    let animId: number;

    const step = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;

      if (current < target) {
        // Interpolasi eksponensial halus dengan kecepatan minimum
        const diff = target - current;
        const increment = Math.max(0.35, diff * 0.08);
        const next = Math.min(target, current + increment);

        currentProgressRef.current = next;
        setDisplayProgress(Math.floor(next));
      }

      // Saat mencapai target 100%, tahan sebentar (maksimal 400 ms) lalu trigger transisi keluar
      if (currentProgressRef.current >= 99.8 && target === 100) {
        currentProgressRef.current = 100;
        setDisplayProgress(100);

        if (!isCompletedRef.current) {
          isCompletedRef.current = true;

          // Buka kunci scroll segera setelah target 100% tercapai
          document.body.style.overflow = "";
          document.documentElement.style.overflow = "";
          const lenis = (window as unknown as { __lenis?: LenisInstance })
            .__lenis;
          if (lenis) lenis.start();

          // Tahan maksimal 300ms (<= 400ms) sebelum menghilang
          setTimeout(() => {
            setIsExiting(true);
            if (apiError) {
              setShowToast(true);
            }
          }, 300);
        }
        return;
      }

      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [apiError]);

  // Auto-dismiss pesan error ramah setelah 5 detik
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return (
    <>
      <AnimatePresence
        onExitComplete={() => {
          setIsMounted(false);
        }}
      >
        {isMounted && !isExiting && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -24, transition: { duration: 0.35, ease: "easeInOut" } }
            }
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-6 select-none"
            style={{
              backgroundColor: "var(--bg-primary, #FFF6EC)",
              color: "var(--color-ink, #4A3B52)",
              fontFamily: "var(--font-heading, monospace)",
            }}
          >
            {/* Screen reader announcements */}
            <div aria-live="polite" className="sr-only">
              {displayProgress < 100
                ? `Memuat portofolio, ${displayProgress}% selesai`
                : "Situs siap ditampilkan"}
            </div>

            <div className="w-full max-w-xs sm:max-w-sm flex flex-col items-center gap-6">
              {/* Logo / Nama singkat */}
              <div className="flex items-center gap-2 px-3 py-1.5 text-xs">
                <span
                  className="w-2.5 h-2.5 animate-ping inline-block"
                  style={{
                    backgroundColor: "var(--color-ink, #4A3B52)",
                    borderRadius: "var(--node-radius, 0px)",
                  }}
                />
                <span
                  className="tracking-widest font-bold text-sm"
                  style={{ color: "var(--color-ink, #4A3B52)" }}
                >
                  ASGAR // DEV
                </span>
              </div>

              {/* Progress bar accessible wrapper */}
              <div className="w-full space-y-2">
                <div
                  role="progressbar"
                  aria-valuenow={displayProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Progres pemuatan situs"
                  className="w-full h-5 overflow-hidden p-0.5"
                  style={{
                    border: "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
                    backgroundColor: "var(--bg-secondary, #FFD866)",
                    boxShadow: "var(--box-shadow, 4px 4px 0 0 #4A3B52)",
                    borderRadius: "var(--border-radius, 0px)",
                  }}
                >
                  <div
                    className="h-full transition-all duration-75"
                    style={{
                      width: `${displayProgress}%`,
                      backgroundColor: "#E29E72", // Warm terracotta accent
                      borderRadius: "var(--border-radius, 0px)",
                    }}
                  />
                </div>

                {/* Persentase dan indikator status */}
                <div
                  className="flex justify-between items-center text-[10px]"
                  style={{
                    fontFamily: "var(--font-body, monospace)",
                    color: "var(--color-muted, #504159)",
                  }}
                >
                  <span className="uppercase tracking-wider">
                    {displayProgress < 100 ? "Memuat komponen..." : "Siap!"}
                  </span>
                  <span
                    className="font-bold"
                    style={{ color: "var(--color-ink, #4A3B52)" }}
                  >
                    {displayProgress}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast notifikasi ramah bila koneksi backend lambat / timeout */}
      <AnimatePresence>
        {showToast && apiError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-[110] max-w-sm p-4 text-xs flex items-start gap-3 shadow-lg"
            style={{
              backgroundColor: "var(--bg-secondary, #FFD866)",
              border: "var(--border-width, 3px) solid var(--color-ink, #4A3B52)",
              color: "var(--color-ink, #4A3B52)",
              boxShadow: "var(--box-shadow, 4px 4px 0 0 #4A3B52)",
              fontFamily: "var(--font-body, monospace)",
            }}
          >
            <span className="text-base select-none">💡</span>
            <div className="flex-1">
              <p className="font-semibold mb-1">Catatan Sambungan:</p>
              <p className="text-[11px] leading-relaxed opacity-90">
                {apiError}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowToast(false)}
              className="text-xs font-bold px-1.5 py-0.5 hover:opacity-70 transition-opacity"
              aria-label="Tutup notifikasi"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
