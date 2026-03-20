"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ────────────────────────────────────────────────────────────
   !important 강제 스타일 — 전역 CSS·Tailwind 퍼지 완전 무력화
   React style 객체는 !important 미지원 → <style> 태그로 우회
──────────────────────────────────────────────────────────── */
const FORCE_STYLES = `
  .impact-number {
    font-size: clamp(3.5rem, 10vw, 7.5rem) !important;
    font-weight: 900 !important;
    line-height: 1 !important;
    letter-spacing: -0.04em !important;
    color: #22C55E !important;
    font-variant-numeric: tabular-nums !important;
    text-shadow:
      0 0  20px rgba(34,197,94,0.95),
      0 0  58px rgba(34,197,94,0.60),
      0 0 120px rgba(34,197,94,0.28),
      0  5px 16px rgba(0,0,0,0.98) !important;
    display: block !important;
  }
  .impact-label {
    font-size: clamp(1.1rem, 2vw, 1.45rem) !important;
    font-weight: 700 !important;
    color: #ffffff !important;
    text-shadow: 0 0 24px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,0.9) !important;
  }
  .impact-sub {
    font-size: clamp(1rem, 1.2vw, 1.05rem) !important;
    line-height: 1.75 !important;
    letter-spacing: 0.03em !important;
    color: #a1a1aa !important;
    max-width: 240px !important;
  }
  .impact-heading {
    font-size: clamp(1.6rem, 4vw, 3.1rem) !important;
    font-weight: 800 !important;
    line-height: 1.2 !important;
    color: #ffffff !important;
  }
  .impact-section {
    padding: 10rem 1.5rem !important;
  }
`;

/* ── 카운트업 훅 ───────────────────────────────────────── */
function useCountUp(target: number, durationMs: number, started: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [started, target, durationMs]);

  return count;
}

/* ── 매트릭스 캔버스 ─────────────────────────────────── */
function MatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const FONT_SIZE = 13;
    const CHARS = "0123456789%+".split("");
    let columns = Math.floor(canvas.width / FONT_SIZE);
    let drops   = Array<number>(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(10,10,10,0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FONT_SIZE}px monospace`;

      drops.forEach((y, i) => {
        const char  = CHARS[Math.floor(Math.random() * CHARS.length)];
        const alpha = Math.random() > 0.92 ? 0.55 : 0.12;
        ctx.fillStyle = `rgba(34,197,94,${alpha})`;
        ctx.fillText(char, i * FONT_SIZE, y * FONT_SIZE);
        if (y * FONT_SIZE > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };

    const interval = setInterval(draw, 55);

    const onResize = () => {
      resize();
      columns = Math.floor(canvas.width / FONT_SIZE);
      drops   = Array<number>(columns).fill(1);
    };
    window.addEventListener("resize", onResize);
    return () => { clearInterval(interval); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ pointerEvents: "none", position: "absolute", inset: 0, width: "100%", height: "100%" }}
    />
  );
}

/* ── 통계 카드 ──────────────────────────────────────────── */
interface StatCardProps {
  target: number;
  suffix: string;
  label: string;
  sub: string;
  started: boolean;
  delay: number;
}

function StatCard({ target, suffix, label, sub, started, delay }: StatCardProps) {
  const count = useCountUp(target, 2200, started);

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.75rem",
        textAlign: "center",
      }}
    >
      {/* 숫자 — !important 클래스로 크기 강제 */}
      <p className="impact-number">{count}{suffix}</p>

      {/* 그린 구분선 */}
      <div
        style={{
          height: "2px",
          width: "72px",
          borderRadius: "9999px",
          background: "linear-gradient(to right, transparent, rgba(34,197,94,0.75), transparent)",
          boxShadow: "0 0 14px rgba(34,197,94,0.45)",
          flexShrink: 0,
        }}
      />

      {/* 타이틀 */}
      <p className="impact-label">{label}</p>

      {/* 설명 */}
      <p className="impact-sub">{sub}</p>
    </motion.div>
  );
}

/* ── 메인 섹션 ──────────────────────────────────────────── */
const stats = [
  {
    target: 8,
    suffix: "+",
    label: "혁신적 서비스",
    sub: "2026년 14기 출시 목표 프로젝트",
  },
  {
    target: 1000,
    suffix: "+",
    label: "실제 사용자",
    sub: "우리가 1년 내 만날 실제 사용자",
  },
  {
    target: 100,
    suffix: "%",
    label: "실행 팀 비율",
    sub: "아이디어를 포기하지 않고 런칭할 팀 비율",
  },
];

export default function ImpactSection() {
  const ref     = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <>
      {/* !important 스타일 주입 — 전역 CSS 오버라이드 */}
      <style dangerouslySetInnerHTML={{ __html: FORCE_STYLES }} />

      <section
        ref={ref}
        className="impact-section"
        style={{ position: "relative", overflow: "hidden", background: "#0A0A0A" }}
      >
        {/* 매트릭스 배경 */}
        <MatrixCanvas />

        {/* 중앙 그라디언트 마스크 */}
        <div
          aria-hidden
          style={{
            pointerEvents: "none",
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 60% at 50% 50%, transparent 40%, #0A0A0A 100%)",
          }}
        />

        <div style={{ position: "relative", zIndex: 10, margin: "0 auto", maxWidth: "80rem" }}>

          {/* ── 헤딩 ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ marginBottom: "5rem", textAlign: "center" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", marginBottom: "1rem" }}>
              <p style={{ fontSize: "0.875rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#22C55E" }}>
                Impact
              </p>
              <span style={{
                borderRadius: "9999px",
                border: "1px solid rgba(34,197,94,0.40)",
                background: "rgba(34,197,94,0.10)",
                padding: "0.125rem 0.75rem",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#22C55E",
              }}>
                14th Vision
              </span>
            </div>

            <h2 className="impact-heading">
              숫자로 보는{" "}
              <span style={{ color: "#22C55E" }}>14기의 목표</span>
            </h2>
          </motion.div>

          {/* ── 구분선 ── */}
          <div style={{
            marginBottom: "5rem",
            height: "1px",
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.10), transparent)",
          }} />

          {/* ── 통계 그리드 — auto-fit으로 1→3열 자동 전환 ── */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "4rem 4rem",
            alignItems: "start",
          }}>
            {stats.map((s, i) => (
              <StatCard
                key={s.label}
                {...s}
                started={isInView}
                delay={i * 0.12}
              />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
