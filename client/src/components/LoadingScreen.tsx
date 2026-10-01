import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../lib/api";

export default function LoadingScreen() {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const targetProgressRef = useRef(20);
  const currentProgressRef = useRef(0);
  const apiFinishedRef = useRef(false);
  const isCompletedRef = useRef(false);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Kelola scroll: Hanya kunci saat loading aktif, dan pastikan SELALU dibuka kembali
  useEffect(() => {
    if (isMounted) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isMounted]);

  // 2. Muat data backend Express dan pantau batas waktu
  useEffect(() => {
    let isSubscribed = true;

    // Fetch data awal backend
    const fetchCriticalData = async () => {
      try {
        await Promise.allSettled([
          api.get("/sections/public"),
          api.get("/projects/public"),
        ]);
        if (isSubscribed) {
          apiFinishedRef.current = true;
          targetProgressRef.current = 100;
        }
      } catch (err) {
        console.warn("Koneksi API lambat atau gagal:", err);
        if (isSubscribed) {
          apiFinishedRef.current = true;
          setApiError(
            "Koneksi backend lambat. Menampilkan konten yang tersedia secara offline/cache."
          );
          targetProgressRef.current = 100;
        }
      }
    };

    fetchCriticalData();

    // Batas waktu: Maksimal 1.0 detik bila data ringan/cepat, atau timeout 8s
    const fastLoadTimer = setTimeout(() => {
      if (isSubscribed) {
        targetProgressRef.current = 100;
      }
    }, 800);

    const timeout8s = setTimeout(() => {
      if (!isCompletedRef.current) {
        apiFinishedRef.current = true;
        setApiError(
          "Koneksi ke backend membutuhkan waktu lebih lama. Data akan diperbarui di latar belakang."
        );
        targetProgressRef.current = 100;
      }
    }, 8000);

    return () => {
      isSubscribed = false;
      clearTimeout(fastLoadTimer);
      clearTimeout(timeout8s);
    };
  }, []);

  // 3. Interpolasi halus requestAnimationFrame
  useEffect(() => {
    let animId: number;

    const step = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;

      if (current < target) {
        const diff = target - current;
        const increment = Math.max(0.8, diff * 0.14);
        const next = Math.min(target, current + increment);

        currentProgressRef.current = next;
        setDisplayProgress(Math.floor(next));
      }

      if (currentProgressRef.current >= 99.8 && target === 100) {
        currentProgressRef.current = 100;
        setDisplayProgress(100);

        if (!isCompletedRef.current) {
          isCompletedRef.current = true;
          // Buka kunci scroll segera
          document.body.style.overflow = "";
          document.documentElement.style.overflow = "";

          // Tahan maksimal 250ms saat 100% lalu transisi fade out
          setTimeout(() => {
            setIsMounted(false);
            if (apiError) {
              setShowToast(true);
            }
          }, prefersReducedMotion ? 40 : 250);
        }
      }

      if (!isCompletedRef.current || currentProgressRef.current < 100) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [apiError, prefersReducedMotion]);

  return (
    <>
      <AnimatePresence>
        {isMounted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeInOut" } }
            }
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 select-none pointer-events-auto"
            style={{
              backgroundColor: "#09090B",
              color: "#FFFFFF",
              fontFamily: "var(--font-heading, 'Inter', sans-serif)",
            }}
            role="status"
            aria-live="polite"
            aria-label={`Memuat konten situs: ${displayProgress}%`}
          >
            {/* Ambient Background Glow */}
            <div
              className="absolute w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{
                background: "radial-gradient(circle, #00E559 0%, #38BDF8 60%, transparent 80%)",
              }}
            />

            <div className="relative z-10 w-full max-w-xs flex flex-col items-center space-y-6 text-center">
              {/* Logo / Monogram */}
              <div className="flex flex-col items-center space-y-2">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg"
                  style={{
                    background: "rgba(26, 27, 30, 0.9)",
                    border: "1px solid #27272A",
                    color: "#00E559",
                    boxShadow: "0 0 24px rgba(0, 229, 89, 0.2)",
                  }}
                >
                  AF
                </div>
                <div className="text-sm font-semibold tracking-wider text-white">
                  ASGAR FATWAHYUDI
                </div>
                <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
                  PORTFOLIO // INTERFACE
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full space-y-2.5">
                <div
                  className="w-full h-1.5 rounded-full overflow-hidden p-0"
                  style={{
                    backgroundColor: "#1A1B1E",
                    border: "1px solid #27272A",
                  }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-75"
                    style={{
                      width: `${displayProgress}%`,
                      backgroundColor: "#00E559",
                      boxShadow: "0 0 12px rgba(0, 229, 89, 0.6)",
                    }}
                  />
                </div>

                {/* Persentase Numerik */}
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-zinc-500 text-[11px] uppercase tracking-wider">
                    {displayProgress < 100 ? "INITIALIZING" : "SYSTEM READY"}
                  </span>
                  <span className="font-semibold text-[#00E559] text-sm tabular-nums">
                    {displayProgress}%
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifikasi Error Jika Backend Lambat/Gagal */}
      <AnimatePresence>
        {showToast && apiError && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-2xl shadow-2xl flex items-start gap-3 text-xs"
            style={{
              backgroundColor: "#1A1B1E",
              color: "#FFFFFF",
              border: "1px solid #27272A",
              fontFamily: "var(--font-body, 'Inter', sans-serif)",
            }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1 shrink-0 animate-ping" />
            <div className="space-y-1">
              <div className="font-semibold text-white">Pemberitahuan Sistem</div>
              <p className="text-zinc-400 leading-relaxed font-normal">{apiError}</p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="text-zinc-500 hover:text-white p-1 ml-auto cursor-pointer"
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
