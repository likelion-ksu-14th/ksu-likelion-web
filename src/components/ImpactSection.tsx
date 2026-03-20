"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

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

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", onResize);
    };
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
      className="flex flex-col items-center text-center"
      style={{ gap: "2rem !important" }} // 카드 내부 요소 간격 조정
    >
      {/* ── 숫자: 가독성을 위해 최대 크기를 8.5rem으로 소폭 하향 조정 ── */}
      <p
        className="tabular-nums font-black leading-none tracking-tighter text-[#22C55E]"
        style={{
          fontSize: "clamp(5rem, 8vw, 7.5rem) !important",
          wordBreak: "keep-all",
          overflowWrap: "break-word",
          textShadow: [
            "0 0  24px rgba(34,197,94,0.95)",   /* 코어 글로우 소폭 축소 */
            "0 0  70px rgba(34,197,94,0.65)",   /* 중간 확산 */
            "0 0 150px rgba(34,197,94,0.35)",   /* 대기 광무 최적화 */
            "0  10px 30px rgba(0,0,0,0.98)",    /* 가독성 보정 */
          ].join(", "),
        }}
      >
        {count}{suffix}
      </p>

      {/* ── 장식용 구분선 ── */}
      <div
        className="h-[2px] w-16 rounded-full"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(34,197,94,0.70), transparent)",
          boxShadow: "0 0 10px rgba(34,197,94,0.50)",
        }}
      />

      {/* ── 타이틀: 텍스트 크기 미세 조정 ── */}
      <p
        className="font-bold text-white"
        style={{
            fontSize: "clamp(1.25rem, 2.2vw, 1.75rem) !important",
            textShadow: "0 0 24px rgba(0,0,0,1), 0 2px 8px rgba(0,0,0,0.9)",
            wordBreak: "keep-all",
            overflowWrap: "break-word",
        }}
      >
        {label}
      </p>

      {/* ── 설명 문구: 가독성 중심의 크기 ── */}
      <p 
        className="max-w-[260px] leading-relaxed tracking-wide text-zinc-400"
        style={{ fontSize: "clamp(0.9rem, 1.2vw, 1rem) !important", wordBreak: "keep-all", overflowWrap: "break-word" }}
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
    <section ref={ref} className="relative overflow-hidden bg-[#0A0A0A] px-6 py-32 md:py-48">
      <MatrixCanvas />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,transparent_40%,#0A0A0A_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-20 text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-[#22C55E]">
              Impact
            </p>
            <span className="rounded-full border border-[#22C55E]/40 bg-[#22C55E]/10 px-3 py-0.5 text-[10px] font-bold tracking-widest text-[#22C55E]">
              14th Vision
            </span>
          </div>
          <h2 
            className="font-extrabold text-white"
            style={{ fontSize: "clamp(2rem, 5vw, 4rem) !important", wordBreak: "keep-all", overflowWrap: "break-word" }}
          >
            숫자로 보는{" "}
            <span className="text-[#22C55E]">14기의 목표</span>
          </h2>
        </motion.div>

        {/* 그리드 레이아웃: 여백을 더 확보하여 겹침 방지 */}
        <div className="grid grid-cols-1 gap-20 md:grid-cols-3 md:gap-8 lg:gap-16">
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
  );
}