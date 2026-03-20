"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/* ── 색상 상수 ─────────────────────────────────────────── */
const ORANGE      = "#F97316";                        // 타임라인 포인트 컬러
const ORANGE_W    = "rgba(249,115,22,0.25)";
const ORANGE_M    = "rgba(249,115,22,0.55)";
const ORANGE_GLOW = "rgba(249,115,22,0.45)";
const INDIGO      = "#6366f1";                        // 섹션 헤더 등 기존 accent

/* ── 배지 카테고리 ──────────────────────────────────────── */
type BadgeType = "스터디" | "해커톤" | "행사" | "모집" | "기업연계" | "운영";

const BADGE_STYLE: Record<BadgeType, { bg: string; text: string; border: string }> = {
  스터디:   { bg: "rgba(99,102,241,0.12)",  text: "#818cf8", border: "rgba(99,102,241,0.35)" },
  해커톤:   { bg: "rgba(249,115,22,0.12)",  text: "#fb923c", border: "rgba(249,115,22,0.40)" },
  행사:     { bg: "rgba(34,197,94,0.10)",   text: "#4ade80", border: "rgba(34,197,94,0.35)" },
  모집:     { bg: "rgba(234,179,8,0.12)",   text: "#facc15", border: "rgba(234,179,8,0.40)" },
  기업연계: { bg: "rgba(168,85,247,0.12)",  text: "#c084fc", border: "rgba(168,85,247,0.40)" },
  운영:     { bg: "rgba(20,184,166,0.12)",  text: "#2dd4bf", border: "rgba(20,184,166,0.40)" },
};

function TagBadge({ tag }: { tag: string }) {
  const style = BADGE_STYLE[tag as BadgeType] ?? BADGE_STYLE["행사"];
  return (
    <span
      className="rounded-full px-3 py-1 text-sm font-semibold"
      style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}
    >
      {tag}
    </span>
  );
}

/* ── 월별 타임라인 데이터 ────────────────────────────────── */
const TIMELINE = [
  {
    step: "01",
    period: "1월",
    dateLabel: "January",
    title: "참여 대학 모집",
    desc: "멋쟁이사자처럼 신규 참여 대학교와 운영진 구성이 확정되는 시기입니다. 14기의 여정이 이 달에 시작됩니다.",
    icon: "🏫",
    tags: ["행사"] as BadgeType[],
  },
  {
    step: "02",
    period: "2월",
    dateLabel: "February",
    title: "운영진 가입 마감 · 대표 LT",
    desc: "각 대학 운영진 가입 마감과 함께, 전국 대표들이 모여 리더십 트레이닝(LT)을 진행합니다.",
    icon: "📋",
    tags: ["행사", "운영"] as BadgeType[],
  },
  {
    step: "03",
    period: "3월",
    dateLabel: "March",
    title: "아기사자 가입 마감 · 전체 OT · 교육 자료 지급",
    desc: "14기 아기사자 가입 서류 마감 (3월 24일)이 완료되고, 전체 OT와 함께 교육 자료가 지급됩니다. 본격적인 활동이 시작됩니다!",
    icon: "🦁",
    tags: ["모집", "행사"] as BadgeType[],
  },
  {
    step: "04",
    period: "4월 – 6월",
    dateLabel: "1학기 스터디",
    title: "1학기 스터디 & 중앙 아이디어톤",
    desc: "매주 진행되는 1학기 스터디로 프로그래밍 기초와 웹 개발 역량을 쌓습니다. 5월 중에는 전국 멋사 대학생이 참여하는 중앙 아이디어톤 행사가 열립니다.",
    icon: "📚",
    tags: ["스터디", "해커톤"] as BadgeType[],
  },
  {
    step: "05",
    period: "7월 – 8월",
    dateLabel: "여름방학",
    title: "중앙 해커톤",
    desc: "전국 멋쟁이사자처럼 대학생들이 한 자리에 모여 진행하는 48시간 무박 해커톤입니다. 아이디어를 실제 서비스로 만들어내는 경험, 그 자체가 성장입니다.",
    icon: "🚀",
    tags: ["해커톤", "행사"] as BadgeType[],
  },
  {
    step: "06",
    period: "9월 – 12월",
    dateLabel: "2학기",
    title: "2학기 스터디 · 연합 해커톤 · 기업 연계 해커톤",
    desc: "2학기 팀 프로젝트 스터디로 서비스를 고도화합니다. 권역별 연합 해커톤과 기업 연계 해커톤에도 참여하며 실전 역량을 완성합니다.",
    icon: "🔥",
    tags: ["스터디", "해커톤", "기업연계"] as BadgeType[],
  },
];

const SPRING_CONFIG = { stiffness: 60, damping: 20, mass: 0.8 };
const N = TIMELINE.length;

/* ── 커리큘럼 카드 ─────────────────────────────────────── */
function CurriculumCard({
  item,
  index,
  onVisible,
  registerRef,
}: {
  item: (typeof TIMELINE)[number];
  index: number;
  onVisible: (i: number) => void;
  registerRef: (i: number, el: HTMLDivElement | null) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { registerRef(index, ref.current); }, [index, registerRef]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onVisible(index); },
      { rootMargin: "-25% 0px -25% 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index, onVisible]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const smooth  = useSpring(scrollYProgress, SPRING_CONFIG);
  const opacity = useTransform(smooth, [0, 0.18, 0.82, 1], [0, 1, 1, 0]);
  const x       = useTransform(smooth, [0, 0.18, 0.82, 1], [80, 0, 0, 80]);
  const y       = useTransform(smooth, [0, 0.18, 0.82, 1], [40, 0, 0, -40]);
  const scale   = useTransform(smooth, [0, 0.18, 0.82, 1], [0.88, 1, 1, 0.88]);

  return (
    <motion.div ref={ref} style={{ opacity, x, y, scale }}>
      <div className="card-box group relative overflow-hidden rounded-[28px] p-8 md:p-10">
        {/* shimmer */}
        <div className="shimmer pointer-events-none absolute inset-0" />
        {/* hover 글로우 */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[28px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: `radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249,115,22,0.06), transparent 70%)` }}
        />

        {/* 상단 헤더 행 */}
        <div className="mb-5 flex items-center justify-between gap-3">
          {/* STEP + 기간 */}
          <div className="flex items-center gap-3">
            <span className="step-text text-4xl font-black leading-none tracking-[-2px] md:text-5xl">
              {item.step}
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: ORANGE }}>
                {item.dateLabel}
              </p>
              <p className="text-lg font-extrabold text-white">{item.period}</p>
            </div>
          </div>
          {/* 아이콘 */}
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl">
            {item.icon}
          </span>
        </div>

        {/* 구분선 */}
        <div className="mb-5 h-px w-full" style={{ background: `linear-gradient(to right, ${ORANGE_W}, transparent)` }} />

        {/* 제목 */}
        <h3 className="mb-3 text-xl font-extrabold leading-snug text-white md:text-2xl">
          {item.title}
        </h3>

        {/* 설명 */}
        <p className="mb-5 text-base leading-relaxed text-zinc-400">{item.desc}</p>

        {/* 배지 */}
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
        </div>

      </div>
    </motion.div>
  );
}

/* ── 페이지 ─────────────────────────────────────────────── */
export default function CurriculumPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);

  const registerRef  = useCallback((i: number, el: HTMLDivElement | null) => { cardEls.current[i] = el; }, []);
  const handleVisible = useCallback((i: number) => setActiveIndex(i), []);

  const scrollToCard = useCallback((i: number) => {
    const el = cardEls.current[i];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    window.scrollTo({ top: window.pageYOffset + rect.top - window.innerHeight / 2 + rect.height / 2, behavior: "smooth" });
  }, []);

  const SIDEBAR_H = 380;

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 pb-24 pt-40">

      {/* 헤딩 */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-24 text-center"
      >
        <p className="mb-3 text-base font-semibold uppercase tracking-widest" style={{ color: ORANGE }}>
          Curriculum
        </p>
        <h1 className="mx-auto max-w-2xl text-4xl font-extrabold leading-tight text-white md:text-5xl">
          1년의 여정,{" "}
          <span style={{ color: ORANGE }}>상상이 현실이 되는 시간</span>
        </h1>
        <p className="mt-5 text-base text-zinc-500">
          1월 대학 모집부터 12월 연합 해커톤까지 — 단계별로 성장하는 로드맵
        </p>

        {/* 배지 범례 */}
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {(Object.keys(BADGE_STYLE) as BadgeType[]).map((b) => (
            <TagBadge key={b} tag={b} />
          ))}
        </div>
      </motion.div>

      {/* ── 스티키 레이아웃 ─────────────────────────────────── */}
      <div className="mx-auto flex max-w-5xl items-start gap-10">

        {/* 좌측 스티키 사이드바 (md 이상 전용) */}
        <aside className="hidden shrink-0 self-stretch md:block" style={{ width: 150 }}>
          <div
            className="sticky"
            style={{ top: `calc(50vh - ${SIDEBAR_H / 2}px)`, height: SIDEBAR_H }}
          >
            <div className="relative flex h-full flex-col items-center">
              {/* 오렌지 세로 라인 */}
              <div
                className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2"
                style={{
                  background: `linear-gradient(to bottom, transparent 0%, ${ORANGE_W} 15%, ${ORANGE_M} 50%, ${ORANGE_W} 85%, transparent 100%)`,
                  boxShadow: `0 0 20px ${ORANGE_GLOW}`,
                }}
              />

              {/* 점 (Dot) — translate(-50%,-50%)로 dot 중앙이 선과 정확히 일치 */}
              {TIMELINE.map((item, i) => {
                const topPct = 8 + i * (84 / (N - 1));
                const isActive = activeIndex === i;
                const dotSize = isActive ? 28 : 18;
                return (
                  <div
                    key={item.step}
                    className="absolute"
                    style={{ top: `${topPct}%`, left: "50%", transform: "translate(-50%, -50%)" }}
                  >
                    {/* 기간 레이블 — dot 왼쪽에 절대 위치 */}
                    <span
                      className="absolute top-1/2 whitespace-nowrap font-bold transition-all duration-300"
                      style={{
                        right: dotSize + 10,
                        transform: "translateY(-50%)",
                        fontSize: isActive ? 16 : 13,
                        color: isActive ? ORANGE : `rgba(249,115,22,0.3)`,
                        textShadow: isActive ? `0 0 18px rgba(249,115,22,0.8)` : "none",
                      }}
                    >
                      {item.period}
                    </span>

                    {/* 클릭 가능한 dot */}
                    <button
                      onClick={() => scrollToCard(i)}
                      aria-label={`${item.period}으로 이동`}
                      className="flex items-center justify-center"
                      style={{ width: dotSize, height: dotSize }}
                    >
                      <div
                        className="rounded-full border-[3px] border-black transition-all duration-500"
                        style={{
                          width: dotSize,
                          height: dotSize,
                          background: `linear-gradient(135deg, ${ORANGE}, ${isActive ? "#fbbf24" : "#fed7aa"})`,
                          boxShadow: isActive
                            ? `0 0 32px rgba(249,115,22,0.9), 0 0 56px rgba(249,115,22,0.5)`
                            : `0 0 14px rgba(249,115,22,0.5)`,
                          animation: isActive ? "pulse-dot 2s infinite" : "none",
                        }}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* 우측 스크롤 카드 */}
        <div className="min-w-0 flex-1 space-y-[18vh] py-[6vh]">
          {TIMELINE.map((item, i) => (
            <CurriculumCard
              key={item.step}
              item={item}
              index={i}
              onVisible={handleVisible}
              registerRef={registerRef}
            />
          ))}
        </div>
      </div>

      {/* 모바일 전용 수직 타임라인 진행 바 */}
      <style>{`
        /* ── 카드 기본 ─────────────────────────────── */
        .card-box {
          background: rgba(15, 15, 15, 0.85);
          border: 2px solid rgba(249, 115, 22, 0.15);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: border-color 0.5s ease, box-shadow 0.5s ease;
        }
        .card-box:hover {
          border-color: rgba(249, 115, 22, 0.50);
          box-shadow:
            0 20px 60px rgba(0,0,0,0.4),
            0 0 40px rgba(249,115,22,0.12),
            inset 0 0 60px rgba(249,115,22,0.04);
        }
        /* ── STEP 텍스트 ────────────────────────────── */
        .step-text {
          background: linear-gradient(135deg, rgba(249,115,22,0.45), rgba(249,115,22,0.10));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.6s ease;
        }
        .card-box:hover .step-text {
          background: linear-gradient(135deg, #f97316, #fed7aa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 14px rgba(249,115,22,0.55));
        }

        /* ── shimmer ────────────────────────────────── */
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(249,115,22,0.07), transparent);
          transform: translateX(-100%);
        }
        .card-box:hover .shimmer {
          animation: shimmer-slide 0.75s ease forwards;
        }

        /* ── Dot pulse ──────────────────────────────── */
        /* translateX는 부모 button에 이미 적용되어 있으므로 scale만 사용 */
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.30); }
        }

        /* ── shimmer slide ──────────────────────────── */
        @keyframes shimmer-slide {
          from { transform: translateX(-100%); }
          to   { transform: translateX(200%); }
        }

        /* ── 모바일 수직 타임라인 ───────────────────── */
        @media (max-width: 767px) {
          .card-box { border-left: 3px solid rgba(249,115,22,0.40); border-radius: 0 20px 20px 0; }
        }
      `}</style>
    </main>
  );
}
