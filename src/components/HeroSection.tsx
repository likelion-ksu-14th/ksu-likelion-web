"use client";

import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import type { Application } from "@splinetool/runtime";

// ─────────────────────────────────────────────────────────
// Spline 씬 URL
// ※ my.spline.design 뷰어 URL → prod.spline.design 임베드 URL 변환
//   정확한 scene.splinecode URL은 Spline 에디터 > Export > Spline Viewer에서 복사
// ─────────────────────────────────────────────────────────
const SPLINE_DESKTOP =
  "https://prod.spline.design/PNChgvmbUrOEt1qi/scene.splinecode";
const SPLINE_MOBILE =
  "https://prod.spline.design/9emOMcBV3eoOSSwn/scene.splinecode";

const DEADLINE = new Date("2026-03-24T23:59:59");

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
type SplineApp = Application & {
  renderer?: {
    setPixelRatio: (r: number) => void;
    /** updateStyle=false → CSS는 건드리지 않고 픽셀 버퍼만 변경 */
    setSize: (width: number, height: number, updateStyle?: boolean) => void;
  };
};

// ─────────────────────────────────────────────────────────
// Spline Error Boundary
// "Data read, but end of buffer not reached" 같은 런타임 파싱 에러를
// React 트리 밖으로 전파되지 않도록 차단
// ─────────────────────────────────────────────────────────
class SplineErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("[Spline] Scene load error caught by boundary:", error.message);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// Dynamic import — SSR 비활성화, 청크 로딩 중 배경색과 동일한 빈 화면 유지
const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-[#050505]" />,
});

// ─────────────────────────────────────────────────────────
// SplineViewer — ErrorBoundary + 씬 fade-in
// 로딩 중: 사이트 배경색(#050505)과 동일한 빈 화면 유지
// 로드 완료: opacity 0→1 트랜지션으로 부드럽게 등장
// ─────────────────────────────────────────────────────────
function SplineViewer({
  scene,
  onLoad,
}: {
  scene: string;
  onLoad: (app: Application) => void;
}) {
  const [loaded, setLoaded] = useState(false);

  const handleLoad = (app: Application) => {
    onLoad(app);
    setLoaded(true);
  };

  return (
    <SplineErrorBoundary fallback={<div className="h-full w-full bg-[#050505]" />}>
      {/* bg-[#050505]: 로딩 중 배경이 사이트 배경과 동기화되어 빈 화면이 자연스러움 */}
      <div className="relative h-full w-full bg-[#050505]">
        <div
          className={[
            "absolute inset-0 transition-opacity duration-700",
            loaded ? "opacity-100" : "opacity-0",
          ].join(" ")}
        >
          <Spline
            scene={scene}
            onLoad={handleLoad}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </SplineErrorBoundary>
  );
}

// ─────────────────────────────────────────────────────────
// Device type hook
// null = 하이드레이션 전(미확정) → Spline 마운트 금지
// false = 데스크톱, true = 모바일
// ─────────────────────────────────────────────────────────
function useDeviceType() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  return isMobile;
}

// ─────────────────────────────────────────────────────────
// Renderer optimization + canvas 구속
//
// 문제: Spline 런타임이 내부적으로 window.innerWidth 기준으로
//       renderer.setSize를 호출 → canvas가 컨테이너보다 훨씬 넓어져
//       오브 우측이 잘림.
//
// 해결:
//   1) renderer.setSize(w, h, false) — updateStyle=false로 픽셀 버퍼를
//      컨테이너 크기에 고정. CSS는 건드리지 않아 레이아웃 보존.
//   2) canvas 스타일 직접 제어 — width/height: 100%, position: absolute,
//      left: 50%, translateX(-50%)로 컨테이너 중앙에 강제 구속.
//      Spline이 나중에 CSS를 덮어써도 resize 핸들러가 재적용.
// ─────────────────────────────────────────────────────────
function constrainCanvas(containerEl: HTMLElement) {
  const canvas = containerEl.querySelector("canvas");
  if (!canvas) return;
  canvas.style.position  = "absolute";
  canvas.style.width     = "100%";
  canvas.style.height    = "100%";
  canvas.style.top       = "0";
  canvas.style.left      = "50%";
  canvas.style.transform = "translateX(-50%)";
}

function applyRendererOpts(splineApp: Application, containerEl: HTMLElement | null) {
  const app = splineApp as SplineApp;
  if (!app.renderer || !containerEl) return;
  app.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  // updateStyle: false → canvas.style은 우리가 직접 제어
  app.renderer.setSize(containerEl.clientWidth, containerEl.clientHeight, false);
  constrainCanvas(containerEl);
}

// ─────────────────────────────────────────────────────────
// Countdown hook
// ─────────────────────────────────────────────────────────
function useCountdown() {
  const calc = () => {
    const diff = DEADLINE.getTime() - Date.now();
    if (diff <= 0)
      return { days: 0, hours: 0, minutes: 0, seconds: 0, ended: true };
    return {
      days:    Math.floor(diff / 86_400_000),
      hours:   Math.floor((diff % 86_400_000) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000)  / 60_000),
      seconds: Math.floor((diff % 60_000)     / 1_000),
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

// 카운트다운 로딩 전 Skeleton — Hydration mismatch 방지
function CountdownSkeleton() {
  return (
    <div className="inline-flex items-center gap-1.5 sm:gap-2">
      {["DAYS", "HOURS", "MINS", "SECS"].map((label, i) => (
        <div key={label} className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex min-w-[52px] flex-col items-center gap-1 rounded-xl border border-[#2DD4BF]/15 bg-white/5 px-3 py-3 sm:min-w-[60px] sm:px-4">
            <span className="text-2xl font-extrabold text-white/20 sm:text-3xl">--</span>
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-700 sm:text-[10px]">
              {label}
            </span>
          </div>
          {i < 3 && (
            <span className="text-lg font-bold leading-none text-zinc-800 sm:text-xl">:</span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// HeroCountdown
// Hydration fix: isMounted가 true가 되기 전까지 Skeleton 렌더링
// → 서버(Date.now() 미확정)와 클라이언트(현재 시각) 불일치 해소
// ─────────────────────────────────────────────────────────
function HeroCountdown() {
  const [isMounted, setIsMounted] = useState(false);
  const { days, hours, minutes, seconds, ended } = useCountdown();

  useEffect(() => { setIsMounted(true); }, []);

  // 클라이언트 마운트 전: SSR-safe Skeleton
  if (!isMounted) return <CountdownSkeleton />;

  if (ended) {
    return (
      <div className="inline-flex items-center gap-2 rounded-2xl border border-zinc-700 bg-black/50 px-5 py-3 text-sm font-semibold text-zinc-400 backdrop-blur-md">
        모집이 마감되었습니다
      </div>
    );
  }

  const units = [
    { value: days,    label: "DAYS"  },
    { value: hours,   label: "HOURS" },
    { value: minutes, label: "MINS"  },
    { value: seconds, label: "SECS"  },
  ];

  return (
    <div className="inline-flex items-center gap-1.5 sm:gap-2">
      {units.map(({ value, label }, i) => (
        <div key={label} className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex min-w-[52px] flex-col items-center gap-1 rounded-xl border border-[#2DD4BF]/20 bg-white/5 px-3 py-3 backdrop-blur-md sm:min-w-[60px] sm:px-4">
            {/* suppressHydrationWarning: isMounted 가드 뒤이므로 이중 방어 */}
            <span
              suppressHydrationWarning
              className="tabular-nums text-2xl font-extrabold leading-none tracking-tight text-white sm:text-3xl"
            >
              {String(value).padStart(2, "0")}
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-zinc-500 sm:text-[10px]">
              {label}
            </span>
          </div>
          {i < units.length - 1 && (
            <span className="text-lg font-bold leading-none text-zinc-700 sm:text-xl">:</span>
          )}
        </div>
      ))}
      <div className="ml-1 flex flex-col items-center justify-center gap-1">
        <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
        <span className="text-[9px] font-bold uppercase tracking-widest text-red-500/70">live</span>
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
      if (lineIdx >= lines.length) { setDone(true); return; }
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
// Shared fadeUp variant
// ─────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      delay,
    },
  }),
};

// ─────────────────────────────────────────────────────────
// HeroText — PC: left / Mobile: center
// ─────────────────────────────────────────────────────────
function HeroText({
  displayed,
  done,
  align = "center",
}: {
  displayed: string[];
  done: boolean;
  align?: "center" | "left";
}) {
  const left = align === "left";

  return (
    <div
      className={[
        "flex flex-col gap-5",
        left ? "items-start text-left" : "items-center text-center",
      ].join(" ")}
    >
      {/* 뱃지 */}
      <motion.div
        custom={0}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-4 py-1.5 text-sm font-medium tracking-wide text-[#2DD4BF] backdrop-blur-sm"
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
          className="text-5xl font-black leading-[1.15] tracking-tight text-white md:text-6xl lg:text-7xl"
          style={{ textShadow: "0 2px 32px rgba(0,0,0,0.8)" }}
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
              <span className="bg-gradient-to-r from-[#2DD4BF] to-[#6366F1] bg-clip-text text-transparent">
                {displayed[1]}
                {!done && <Cursor gradient />}
              </span>
            </>
          )}
          {done && displayed[1] !== undefined && (
            <span className="bg-gradient-to-r from-[#2DD4BF] to-[#6366F1] bg-clip-text text-transparent">
              <Cursor gradient blink />
            </span>
          )}
        </h1>
      </motion.div>

      {/* 서브 카피 */}
      <motion.p
        custom={0.25}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="max-w-sm font-light leading-[1.9] tracking-wider text-zinc-400 md:max-w-md md:text-lg"
      >
        아이디어를 코드로, 코드를 세상으로.
        <br />
        경성대 멋쟁이사자처럼과 함께 직접 만들고 증명하세요.
      </motion.p>

      {/* 모집 정보 뱃지 */}
      <motion.div
        custom={0.35}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex flex-wrap items-center gap-2"
      >
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs tracking-wide text-zinc-400 backdrop-blur-sm">
          📅 서류 마감 <strong className="text-white">3월 24일</strong>
        </span>
        <span className="rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-3 py-1 text-xs font-medium tracking-wide text-[#22C55E] backdrop-blur-sm">
          ✅ 면접 없음 · 서류 100% 선발
        </span>
      </motion.div>

      {/* 카운트다운 */}
      <motion.div custom={0.42} initial="hidden" animate="visible" variants={fadeUp}>
        <HeroCountdown />
      </motion.div>

      {/* CTA 버튼 */}
      <motion.div
        custom={0.5}
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="flex flex-row gap-3"
      >
        <a
          href="/apply"
          className="pointer-events-auto whitespace-nowrap rounded-full bg-gradient-to-r from-[#2DD4BF] to-[#6366F1] px-7 py-3 text-sm font-semibold tracking-wide text-white shadow-lg shadow-[#2DD4BF]/20 transition-all hover:scale-[1.02] hover:shadow-[#6366F1]/30"
        >
          지금 지원하기
        </a>
        <a
          href="/about"
          className="pointer-events-auto whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-medium tracking-wide text-white/80 backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 hover:text-white"
        >
          더 알아보기
        </a>
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// HeroSection
// ─────────────────────────────────────────────────────────
export default function HeroSection() {
  const { displayed, done } = useTypingLines(LINES);
  const isMobile = useDeviceType();

  const [orbPressed, setOrbPressed] = useState(false);

  // Spline 컨테이너 ref — onLoad 후 canvas에 직접 접근하기 위함
  const desktopSplineRef = useRef<HTMLDivElement>(null);
  const mobileSplineRef  = useRef<HTMLDivElement>(null);
  // desktop Spline app 저장 → resize 시 renderer.setSize 재호출에 사용
  const desktopAppRef = useRef<Application | null>(null);

  const handleDesktopLoad = (app: Application) => {
    desktopAppRef.current = app;
    applyRendererOpts(app, desktopSplineRef.current);
  };

  const handleMobileLoad = (app: Application) => {
    applyRendererOpts(app, mobileSplineRef.current);
  };

  // PC 전용: 휠 스크롤 투과 + window resize 시 renderer/canvas 재동기화
  useEffect(() => {
    const el = desktopSplineRef.current;
    if (!el || isMobile !== false) return;

    const onWheel = (e: WheelEvent) => {
      e.stopPropagation(); // Spline의 window 레벨 wheel 핸들러 차단
      window.scrollBy({ top: e.deltaY, left: 0 });
    };

    // rAF로 Spline 내부 resize 핸들러보다 확실히 나중에 실행
    // → Spline이 setSize(window.innerWidth, ...) 호출 후 우리가 컨테이너 크기로 덮어씀
    const onResize = () => {
      requestAnimationFrame(() => {
        const app = desktopAppRef.current as SplineApp;
        if (!app?.renderer) return;
        app.renderer.setSize(el.clientWidth, el.clientHeight, false);
        constrainCanvas(el);
      });
    };

    el.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
    };
  }, [isMobile]);

  return (
    <section className="relative overflow-hidden bg-[#050505]">

      {/* ══════════════════════════════════════════
          Desktop (md+): 텍스트 좌 | Spline 우
         ══════════════════════════════════════════ */}
      <div className="hidden md:block min-h-[800px] max-h-[960px]">
        {/* Fix 1: max-w-[1440px] + mx-auto → 와이드 모니터에서 콘텐츠를 중앙으로 응집 */}
        {/*
          absolute 레이아웃 전략:
          - 텍스트: 일반 흐름(w-[48%]) + z-10 → 왼쪽 고정
          - Spline: absolute right-0 w-[65%] → 우측에서 화면의 65%를 점유
          - 이유: flex에서 52%를 줄 때 Three.js frustum이 좁아 오브 우측 잘림 발생.
                  absolute로 65%(1280px 기준 832px)를 확보하면 frustum이 충분히 넓어짐.
          - 텍스트와 Spline은 35%~48% 구간에서 겹치지만 z-10이 텍스트를 위로 올림.
        */}
        <div className="relative mx-auto flex h-full max-w-[1440px] min-h-[800px] max-h-[960px] items-center">

          {/* 좌: 텍스트 — z-10으로 Spline 위에 렌더링 */}
          <div className="relative z-10 flex w-[48%] flex-col justify-center pl-44 pr-6 py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute left-[-80px] top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-[#2DD4BF]/8 blur-[120px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-[-40px] top-1/3 h-[300px] w-[300px] -translate-y-1/2 rounded-full bg-[#6366F1]/10 blur-[100px]"
            />
            <HeroText displayed={displayed} done={done} align="left" />
          </div>

          {/* 우: Spline — absolute로 우측 65% 점유
              65%: 1280px 기준 832px → 이전 52%(666px)보다 166px 더 넓은 frustum 확보
              섹션 overflow-hidden이 뷰포트 밖 부분을 자연스럽게 클립 */}
          <div ref={desktopSplineRef} className="absolute right-0 top-0 h-[800px] w-[65%] overflow-hidden">
            {isMobile === false && (
              <SplineViewer scene={SPLINE_DESKTOP} onLoad={handleDesktopLoad} />
            )}
            {isMobile === null && <div className="h-full w-full bg-[#050505]" />}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-[#050505] to-transparent"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050505] to-transparent"
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          Mobile (md 미만): 텍스트 상 | Spline 하
         ══════════════════════════════════════════ */}
      <div className="flex flex-col md:hidden min-h-[90vh]">

        {/* 상: 텍스트
            Fix 2: z-10으로 항상 Spline 위에 렌더링 보장 */}
        <div className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-2">
          <HeroText displayed={displayed} done={done} align="center" />
        </div>

        {/* 하: Spline
            touch-action: pan-y → 수직 스와이프는 브라우저 스크롤, 수평 드래그는 Spline orbit
            mask-image → 상단 페이드로 텍스트 영역과 자연 분리
            pointer-events: auto (기본) → Spline 터치 인터랙션 활성 */}
        <motion.div
          ref={mobileSplineRef}
          className="relative h-[44vh] w-full"
          style={{
            touchAction: "pan-y",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 28%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 28%)",
          }}
          animate={{ scale: orbPressed ? 1.04 : 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          onTouchStart={() => setOrbPressed(true)}
          onTouchEnd={() => setOrbPressed(false)}
          onTouchCancel={() => setOrbPressed(false)}
        >
          {isMobile === true && (
            <SplineViewer scene={SPLINE_MOBILE} onLoad={handleMobileLoad} />
          )}
          {isMobile === null && <div className="h-full w-full bg-[#050505]" />}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#050505] to-transparent"
          />
        </motion.div>
      </div>

      {/* ── 스크롤 인디케이터 ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-[10px] font-light tracking-[0.25em] text-white/30">SCROLL</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="h-5 w-px rounded-full bg-gradient-to-b from-white/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// Cursor (gradient 모드: bg-current 대신 고정 teal 색상)
// ─────────────────────────────────────────────────────────
function Cursor({
  blink = false,
  gradient = false,
}: {
  blink?: boolean;
  gradient?: boolean;
}) {
  return (
    <span
      className={[
        "ml-1 inline-block h-[0.85em] w-[3px] translate-y-[2px] rounded-sm",
        gradient ? "bg-[#2DD4BF]" : "bg-current",
        blink ? "animate-[blink_1s_step-end_infinite]" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
