"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

/* ─────────────────────────────────────────────────────────────
   근본 원인 해결 전략:
   ① clamp 최솟값을 없애고 vw 단위만 사용 → 화면 너비에 100% 비례
   ② @media 미디어 쿼리로 모바일 전용 크기 강제 (!important)
   ③ whiteSpace: nowrap 완전 제거 → overflow 원천 차단
   ④ 부모 컨테이너에 overflow-x: hidden으로 안전망 추가
──────────────────────────────────────────────────────────── */
const RESPONSIVE_STYLES = `
  /* ── PC 기본값 ── */
  .impact-number {
    font-size: clamp(4rem, 10vw, 7.5rem) !important;
    font-weight: 900 !important;
    line-height: 1 !important;
    letter-spacing: -0.04em !important;
    white-space: nowrap !important;          /* PC: 숫자 한 줄 유지 */
  }
  .impact-label {
    font-size: clamp(1.25rem, 2.2vw, 1.75rem) !important;
    white-space: nowrap !important;          /* PC: 라벨 한 줄 유지 */
    word-break: keep-all !important;
  }
  .impact-sub {
    font-size: clamp(1rem, 1.2vw, 1.1rem) !important;
    word-break: keep-all !important;
    overflow-wrap: break-word !important;
  }
  .impact-heading {
    font-size: clamp(2rem, 5vw, 4rem) !important;
    word-break: keep-all !important;
    white-space: normal !important;          /* 헤딩은 항상 줄바꿈 허용 */
  }

  /* ── 모바일 (640px 이하) — 강제 override ── */
  @media (max-width: 640px) {
    .impact-number {
      font-size: 3.75rem !important;         /* 60px — 1000+도 안전하게 수용 */
      white-space: nowrap !important;
      letter-spacing: -0.03em !important;
    }
    .impact-label {
      font-size: 1.25rem !important;         /* 20px */
      white-space: normal !important;        /* 모바일: 자연스러운 줄바꿈 허용 */
    }
    .impact-sub {
      font-size: 1rem !important;            /* 16px — 최소 보장 */
    }
    .impact-heading {
      font-size: 1.75rem !important;         /* 28px */
      white-space: normal !important;
    }
  }

  /* ── 극소형 (380px 이하) ── */
  @media (max-width: 380px) {
    .impact-number {
      font-size: 3.25rem !important;         /* 52px */
    }
    .impact-heading {
      font-size: 1.5rem !important;          /* 24px */
    }
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

/* ── 매트릭스 캔버스 (배경 효과) ─────────────────────────── */
function MatrixCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const FONT_SIZE = 13;
    const CHARS = "0123456789%+".split("");
    let columns = Math.floor(canvas.width / FONT_SIZE);
    let drops = Array<number>(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(10,10,10,0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${FONT_SIZE}px monospace`;

      drops.forEach((y, i) => {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)];
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
      drops = Array<number>(columns).fill(1);
    };
    window.addEventListener("resize", onResize);
    return () => { clearInterval(interval); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
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
        textAlign: "center",
        gap: "1.75rem",
        /* 카드 내부가 화면 밖으로 나가지 않도록 안전망 */
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* 숫자 — !important 클래스로 PC/모바일 각각 제어 */}
      <p
        className="impact-number text-[#22C55E]"
        style={{
          textShadow: "0 0 20px rgba(34,197,94,0.95), 0 0 90px rgba(34,197,94,0.65)",
        }}
      >
        {count}{suffix}
      </p>

      {/* 장식용 구분선 */}
      <div
        style={{
          height: "2px",
          width: "64px",
          flexShrink: 0,
          borderRadius: "9999px",
          background: "linear-gradient(to right, transparent, rgba(34,197,94,0.70), transparent)",
          boxShadow: "0 0 10px rgba(34,197,94,0.50)",
        }}
      />

      {/* 타이틀 */}
      <p
        className="impact-label text-white"
        style={{
          fontWeight: 700,
          textShadow: "0 0 24px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,0.9)",
        }}
      >
        {label}
      </p>

      {/* 설명 문구 */}
      <p
        className="impact-sub text-zinc-400"
        style={{
          maxWidth: "260px",
          lineHeight: 1.75,
          letterSpacing: "0.03em",
        }}
      >
        {sub}
      </p>
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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.35 });

  return (
    <>
      {/* 반응형 !important 스타일 주입 */}
      <style dangerouslySetInnerHTML={{ __html: RESPONSIVE_STYLES }} />

      <section
        ref={ref}
        className="relative bg-[#0A0A0A]"
        style={{
          overflow: "hidden",        /* 가로 오버플로우 완전 차단 */
          padding: "8rem 1.5rem",
        }}
      >
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

        <div
          style={{
            position: "relative",
            zIndex: 10,
            margin: "0 auto",
            maxWidth: "80rem",
            /* 컨테이너도 가로 넘침 차단 */
            overflow: "hidden",
          }}
        >
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

            {/* h2 — whiteSpace: nowrap 완전 제거, 미디어 쿼리로 크기 제어 */}
            <h2 className="impact-heading font-extrabold text-white">
              숫자로 보는{" "}
              <span style={{ color: "#22C55E" }}>14기의 목표</span>
            </h2>
          </motion.div>

          {/* 구분선 */}
          <div style={{
            marginBottom: "5rem",
            height: "1px",
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.10), transparent)",
          }} />

          {/* 통계 그리드 */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
            gap: "4rem 3rem",
            alignItems: "start",
          }}>
            {stats.map((s, i) => (
              <StatCard
                key={s.label}
                {...s}
                started={isInView}
                delay={i * 0.15}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
