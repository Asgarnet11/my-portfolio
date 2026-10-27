import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api } from "../lib/api";

export default function LoadingScreen() {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isMounted, setIsMounted] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const targetProgressRef = useRef(35);
  const currentProgressRef = useRef(0);
  const isCompletedRef = useRef(false);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Kelola overflow body saat loading aktif
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

  // 2. Muat data backend publik dan transisikan segera
  useEffect(() => {
    let isSubscribed = true;

    const fetchCriticalData = async () => {
      try {
        await Promise.allSettled([
          api.get("/sections/public"),
          api.get("/projects/public"),
        ]);
        if (isSubscribed) {
          targetProgressRef.current = 100;
        }
      } catch (err) {
        console.warn("Koneksi API lambat:", err);
        if (isSubscribed) {
          setApiError("Koneksi backend lambat. Menampilkan data lokal.");
          targetProgressRef.current = 100;
        }
      }
    };

    fetchCriticalData();

    // Fast-fallback timeout: jika 400ms tercapai, segera tuntaskan
    const fastTimer = setTimeout(() => {
      if (isSubscribed) {
        targetProgressRef.current = 100;
      }
    }, 400);

    return () => {
      isSubscribed = false;
      clearTimeout(fastTimer);
    };
  }, []);

  // 3. Interpolasi animasi progresif halus
  useEffect(() => {
    let animId: number;

    const step = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;

      if (current < target) {
        const diff = target - current;
        const increment = Math.max(1.5, diff * 0.25);
        const next = Math.min(target, current + increment);
        currentProgressRef.current = next;
        setDisplayProgress(Math.floor(next));
      }

      if (currentProgressRef.current >= 99.5 && target === 100) {
        currentProgressRef.current = 100;
        setDisplayProgress(100);

        if (!isCompletedRef.current) {
          isCompletedRef.current = true;
          document.body.style.overflow = "";
          document.documentElement.style.overflow = "";

          setTimeout(() => {
            setIsMounted(false);
            if (apiError) setShowToast(true);
          }, prefersReducedMotion ? 20 : 180);
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
                : { opacity: 0, y: -15, transition: { duration: 0.25, ease: "easeInOut" } }
            }
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center p-4 select-none pointer-events-auto"
            style={{
              backgroundColor: "var(--bg-primary, #090909)",
              color: "var(--color-ink, #f7f9fa)",
              fontFamily: "var(--font-heading, 'Inter', sans-serif)",
            }}
            role="status"
            aria-live="polite"
            aria-label={`Memuat portfolio: ${displayProgress}%`}
          >
            {/* Ambient Background Glow */}
            <div
              className="absolute w-72 h-72 rounded-full opacity-25 blur-3xl pointer-events-none"
              style={{
                background: "var(--card-glow)",
              }}
            />

            <div className="relative z-10 w-full max-w-xs flex flex-col items-center space-y-6 text-center">
              {/* Logo / Monogram */}
              <div className="flex flex-col items-center space-y-2">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg border shadow-lg"
                  style={{
                    background: "var(--bg-surface)",
                    borderColor: "var(--border-color)",
                    color: "var(--color-accent)",
                  }}
                >
                  AF
                </div>
                <div
                  className="text-sm font-semibold tracking-wider uppercase"
                  style={{ color: "var(--color-ink)" }}
                >
                  ASGAR FATWAHYUDI
                </div>
                <div
                  className="text-[11px] font-mono uppercase tracking-widest"
                  style={{ color: "var(--color-muted)" }}
                >
                  PORTFOLIO // INTERFACE
                </div>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full space-y-2.5">
                <div
                  className="w-full h-1.5 rounded-full overflow-hidden p-0 border"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-color)",
                  }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-75"
                    style={{
                      width: `${displayProgress}%`,
                      backgroundColor: "var(--color-accent)",
                    }}
                  />
                </div>

                {/* Persentase Numerik */}
                <div className="flex justify-between items-center text-xs font-mono">
                  <span
                    className="text-[11px] uppercase tracking-wider"
                    style={{ color: "var(--color-muted)" }}
                  >
                    {displayProgress < 100 ? "INITIALIZING" : "READY"}
                  </span>
                  <span
                    className="font-semibold text-sm tabular-nums"
                    style={{ color: "var(--color-accent)" }}
                  >
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
            className="fixed bottom-6 right-6 z-50 max-w-sm p-4 rounded-2xl shadow-2xl flex items-start gap-3 text-xs border"
            style={{
              backgroundColor: "var(--bg-surface)",
              color: "var(--color-ink)",
              borderColor: "var(--border-color)",
              fontFamily: "var(--font-body, 'Inter', sans-serif)",
            }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full mt-1 shrink-0 animate-ping"
              style={{ background: "var(--color-accent)" }}
            />
            <div className="space-y-1">
              <div className="font-semibold">Pemberitahuan Sistem</div>
              <p className="leading-relaxed font-normal" style={{ color: "var(--color-muted)" }}>
                {apiError}
              </p>
            </div>
            <button
              onClick={() => setShowToast(false)}
              className="p-1 ml-auto cursor-pointer"
              style={{ color: "var(--color-muted)" }}
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
