"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";

// ─────────────────────────────────────────────────────────
// Countdown hook
// ─────────────────────────────────────────────────────────
const DEADLINE = new Date("2026-03-24T23:59:59");

function useCountdown() {
  const calc = () => {
    const diff = DEADLINE.getTime() - Date.now();
    if (diff <= 0)
      return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1_000),
      ended: false,
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function HeroCountdown() {
  const { days, hours, minutes, seconds, ended } = useCountdown();

  if (ended) {
    return (
      <div className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-black/50 px-5 py-3 text-base font-semibold text-zinc-400 backdrop-blur-md">
        모집이 마감되었습니다
      </div>
    );
  }

  const units = [
    { value: days, label: "DAYS" },
    { value: hours, label: "HOURS" },
    { value: minutes, label: "MINS" },
    { value: seconds, label: "SECS" },
  ];

  return (
    <div className="inline-flex items-center gap-1.5 sm:gap-2">
      {units.map(({ value, label }, i) => (
        <div key={label} className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex min-w-[56px] flex-col items-center gap-1 rounded-xl border border-[#6366F1]/25 bg-black/60 px-3 py-3 backdrop-blur-md sm:min-w-[64px] sm:px-4">
            <span className="tabular-nums text-2xl font-extrabold leading-none tracking-tight text-white sm:text-3xl">
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 sm:text-[11px]">
              {label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-lg font-bold leading-none text-zinc-600 sm:text-xl">
              :
            </span>
          )}
        </div>
      ))}
      <div className="ml-1 flex flex-col items-center justify-center gap-1">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-red-500/70">
          live
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Typing animation hook
// ─────────────────────────────────────────────────────────
const LINES = ["상상을 실행으로,", "결과로 증명하다"];

function useTypingLines(lines: string[], speed = 55, pauseMs = 500) {
  const [displayed, setDisplayed] = useState<string[]>([""]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let lineIdx = 0;
    let charIdx = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const type = () => {
      if (lineIdx >= lines.length) {
        setDone(true);
        return;
      }
      const current = lines[lineIdx];
      if (charIdx <= current.length) {
        setDisplayed((prev) => {
          const next = [...prev];
          next[lineIdx] = current.slice(0, charIdx);
          return next;
        });
        charIdx++;
        timeout = setTimeout(type, speed);
      } else {
        lineIdx++;
        charIdx = 0;
        if (lineIdx < lines.length) {
          setDisplayed((prev) => [...prev, ""]);
          timeout = setTimeout(type, pauseMs);
        } else {
          setDone(true);
        }
      }
    };

    timeout = setTimeout(type, 600);
    return () => clearTimeout(timeout);
  }, []);

  return { displayed, done };
}

// ─────────────────────────────────────────────────────────
// Shared animation variant
// ─────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      delay,
    },
  }),
};

// ─────────────────────────────────────────────────────────
// HeroSection
// ─────────────────────────────────────────────────────────
export default function HeroSection() {
  const { displayed, done } = useTypingLines(LINES);

  return (
    <section className="relative flex min-h-[90vh] max-h-[960px] items-center overflow-hidden md:min-h-[800px]">

      {/* ── 배경 이미지 ────────────────────────────────────── */}
      <div aria-hidden className="absolute inset-0">
        <Image
          src="https://i.ibb.co/Xfqf3b7L/image-a9caeb.jpg"
          alt=""
          fill
          priority
          quality={90}
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>

      {/* ── 가독성 오버레이 ─────────────────────────────────── */}
      {/* 모바일: 전체를 충분히 어둡게 */}
      <div
        aria-hidden
        className="absolute inset-0 bg-black/75 md:hidden"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent md:hidden"
      />
      {/* 데스크톱: 좌측 텍스트 가독성 확보, 우측은 이미지 노출 */}
      <div
        aria-hidden
        className="absolute inset-0 hidden bg-gradient-to-r from-black/70 via-black/10 to-transparent md:block"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 hidden h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent md:block"
      />

      {/* ── 인디고 글로우 (데스크톱 좌측) ─────────────────── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[-120px] top-1/2 hidden h-[600px] w-[600px] -translate-y-1/2 rounded-full bg-[#6366F1]/15 blur-[160px] md:block"
      />

      {/* ── 텍스트 콘텐츠 ───────────────────────────────────── */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-16 md:px-16 md:py-20">
        <div className="flex flex-col items-center gap-3 text-center md:max-w-xl md:items-start md:gap-5 md:text-left">

          {/* 뱃지 */}
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="inline-flex items-center gap-2 rounded-full border border-[#6366F1]/40 bg-[#6366F1]/15 px-4 py-1.5 text-base font-medium text-[#6366F1] backdrop-blur-sm md:text-sm"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
            </span>
            경성대학교 멋쟁이사자처럼
          </motion.div>

          {/* 타이핑 슬로건 */}
          <motion.div
            custom={0.1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="w-full"
          >
            <h1
              className="text-5xl font-extrabold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl"
              style={{
                textShadow:
                  "0 2px 24px rgba(0,0,0,0.9), 0 1px 8px rgba(0,0,0,0.8)",
              }}
            >
              {displayed[0] !== undefined && (
                <span>
                  {displayed[0]}
                  {displayed.length === 1 && !done && <Cursor />}
                </span>
              )}
              {displayed[1] !== undefined && (
                <>
                  <br />
                  <span className="text-[#6366F1]">
                    {displayed[1]}
                    {!done && <Cursor />}
                  </span>
                </>
              )}
              {done && displayed[1] !== undefined && (
                <span className="text-[#6366F1]">
                  <Cursor blink />
                </span>
              )}
            </h1>
          </motion.div>

          {/* 서브 카피 */}
          <motion.p
            custom={0.3}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-sm text-lg leading-relaxed text-zinc-300 md:max-w-md md:text-xl"
            style={{ textShadow: "0 1px 16px rgba(0,0,0,0.9)" }}
          >
            아이디어를 코드로, 코드를 세상으로.
            <br />
            경성대 멋쟁이사자처럼과 함께 직접 만들고 증명하세요.
          </motion.p>

          {/* 모집 정보 뱃지 */}
          <motion.div
            custom={0.38}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1 text-xs text-zinc-300 backdrop-blur-sm">
              📅 서류 마감 <strong className="text-white">3월 24일</strong>
            </span>
            <span className="rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-1 text-xs font-semibold text-[#22C55E] backdrop-blur-sm">
              ✅ 면접 없음 · 서류 100% 선발
            </span>
          </motion.div>

          {/* 카운트다운 */}
          <motion.div
            custom={0.42}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
          >
            <HeroCountdown />
          </motion.div>

          {/* CTA 버튼 */}
          <motion.div
            custom={0.45}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="flex flex-row gap-3"
          >
            <a
              href="/apply"
              className="whitespace-nowrap rounded-full bg-[#6366F1] px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-black/30 transition-all hover:bg-[#4f52d4] hover:shadow-[#6366F1]/30 md:px-7 md:py-3.5 md:text-sm"
            >
              지금 지원하기
            </a>
            <a
              href="/about"
              className="whitespace-nowrap rounded-full border border-white/30 bg-black/30 px-6 py-3 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:border-white/50 hover:bg-white/10 md:px-7 md:py-3.5 md:text-sm"
            >
              더 알아보기
            </a>
          </motion.div>
        </div>
      </div>

      {/* ── 스크롤 인디케이터 ───────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span
          className="text-xs text-white/60"
          style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
        >
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="h-4 w-0.5 rounded-full bg-white/50"
        />
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// Cursor component
// ─────────────────────────────────────────────────────────
function Cursor({ blink = false }: { blink?: boolean }) {
  return (
    <span
      className={[
        "ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-[1px] rounded-sm bg-current",
        blink ? "animate-[blink_1s_step-end_infinite]" : "",
      ].join(" ")}
    />
  );
}
