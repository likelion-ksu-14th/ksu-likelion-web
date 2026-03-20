"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/* ── 테마 ─────────────────────────────────────────────────
   --accent: #6366f1  (레퍼런스 :root 동일)
──────────────────────────────────────────────────────── */
const A = "#6366f1";                           // accent
const AW = "rgba(99,102,241,0.3)";             // accent-weak
const AM = "rgba(99,102,241,0.6)";             // accent-mid
const AGLOW = "rgba(99,102,241,0.5)";          // accent-glow

/* ── 데이터 (텍스트 원본 유지) ──────────────────────────── */
const TIMELINE = [
  {
    step: "STEP 01",
    period: "1학기",
    date: "3월 – 6월",
    title: "Python & Web 기초",
    desc: "프로그래밍 사고력 배양 및 프론트엔드/백엔드 기초 다지기. HTML·CSS·JS부터 Python까지 실습 중심으로 진행합니다.",
    icon: "📖",
    tags: ["Python", "HTML/CSS", "JavaScript"],
  },
  {
    step: "STEP 02",
    period: "여름방학",
    date: "7월 – 8월",
    title: "중앙 해커톤",
    desc: "무박 2일간 전국 멋사 대학생들이 모여 실제 서비스를 빌드하는 핵심 이벤트. 아이디어를 48시간 안에 현실로.",
    icon: "🚀",
    tags: ["해커톤", "팀빌딩", "네트워킹"],
  },
  {
    step: "STEP 03",
    period: "2학기",
    date: "9월 – 12월",
    title: "서비스 고도화 & 런칭",
    desc: "협업 기반 팀 프로젝트를 진행하고, 실제 사용자 피드백을 반영해 서비스를 계속 발전시킵니다.",
    icon: "🔥",
    tags: ["팀 프로젝트", "배포", "사용자 피드백"],
  },
  {
    step: "STEP 04",
    period: "데모데이",
    date: "1월",
    title: "최종 발표회",
    desc: "1년간의 성과를 공유하고 멘토·선배·기업 관계자들과 네트워킹하는 마무리 축제입니다.",
    icon: "🏆",
    tags: ["데모데이", "발표", "네트워킹"],
  },
];

const SPRING_CONFIG = { stiffness: 60, damping: 20, mass: 0.8 };
const N = TIMELINE.length;

/* ── 커리큘럼 카드 ────────────────────────────────────────
   양방향 플라잉 (오른쪽 진입 → 중앙 정착 → 오른쪽 역방향 이탈)
   IntersectionObserver로 화면 중앙 감지 → activeIndex 업데이트
──────────────────────────────────────────────────────── */
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
  const opacity = useTransform(smooth, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const x       = useTransform(smooth, [0, 0.2, 0.8, 1], [130, 0, 0, 130]);
  const y       = useTransform(smooth, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);
  const scale   = useTransform(smooth, [0, 0.2, 0.8, 1], [0.85, 1, 1, 0.85]);

  return (
    <motion.div ref={ref} style={{ opacity, x, y, scale }}>
      <div
        className="card-box group relative overflow-hidden rounded-[30px] p-10"
      >
        {/* shimmer */}
        <div className="shimmer pointer-events-none absolute inset-0" />

        {/* 배경 글로우 (hover 시 inset) */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[30px] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.07), transparent 70%)" }}
        />

        {/* STEP 텍스트 */}
        <p className="step-text mb-4 text-[56px] font-black leading-none tracking-[-4px]">
          {item.step}
        </p>

        {/* 아이콘 + 기간 + 제목 */}
        <div className="mb-6 flex items-start gap-5">
          <span className="text-4xl leading-none">{item.icon}</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: A }}>
              {item.period} · {item.date}
            </p>
            <h3 className="mt-1 text-2xl font-extrabold text-white md:text-3xl">
              {item.title}
            </h3>
          </div>
        </div>

        <p className="mb-6 text-base leading-relaxed text-zinc-400">{item.desc}</p>

        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="tag-badge rounded-full px-3 py-1 text-sm font-medium">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── 페이지 ───────────────────────────────────────────────── */
export default function CurriculumPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);

  const registerRef = useCallback((i: number, el: HTMLDivElement | null) => {
    cardEls.current[i] = el;
  }, []);

  const handleVisible = useCallback((i: number) => setActiveIndex(i), []);

  const scrollToCard = useCallback((i: number) => {
    const el = cardEls.current[i];
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const top  = window.pageYOffset + rect.top - window.innerHeight / 2 + rect.height / 2;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  /* 사이드바 높이 300px → dot 간격 계산 */
  const SIDEBAR_H = 300;

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-24">

      {/* 헤딩 */}
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="mb-24 text-center"
      >
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest" style={{ color: A }}>
          Curriculum
        </p>
        <h1 className="mx-auto max-w-2xl text-4xl font-extrabold leading-tight text-white md:text-5xl">
          1년의 여정,{" "}
          <span style={{ color: A }}>상상이 현실이 되는 시간</span>
        </h1>
        <p className="mt-5 text-base text-zinc-500">
          3월 입부부터 1월 데모데이까지, 단계별로 성장하는 로드맵
        </p>
      </motion.div>

      {/* ── 스티키 레이아웃 ─────────────────────────────────── */}
      <div className="mx-auto flex max-w-5xl items-start gap-10">

        {/* 좌측 스티키 사이드바 (md 이상) */}
        <aside
          className="hidden md:block shrink-0 self-stretch"
          style={{ width: 150 }}
        >
          <div
            className="sticky"
            style={{ top: `calc(50vh - ${SIDEBAR_H / 2}px)`, height: SIDEBAR_H }}
          >
            <div className="relative flex h-full flex-col items-center">

              {/* 세로 라인 */}
              <div
                className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2"
                style={{
                  background: `linear-gradient(to bottom, transparent 0%, ${AW} 20%, ${AM} 50%, ${AW} 80%, transparent 100%)`,
                  boxShadow: `0 0 20px ${AGLOW}`,
                }}
              />

              {/* 점 (Dot) */}
              {TIMELINE.map((item, i) => {
                const topPct = 15 + i * (70 / (N - 1));
                const isActive = activeIndex === i;
                return (
                  <button
                    key={item.step}
                    onClick={() => scrollToCard(i)}
                    className="absolute left-1/2 flex -translate-x-1/2 items-center"
                    style={{ top: `${topPct}%` }}
                    aria-label={`${item.period}으로 이동`}
                  >
                    {/* 점 본체 */}
                    <div
                      className="rounded-full border-[3px] border-black transition-all duration-500"
                      style={
                        isActive
                          ? {
                              width: 30, height: 30,
                              background: `linear-gradient(135deg, ${A}, rgba(220,210,255,0.9))`,
                              boxShadow: `0 0 40px rgba(99,102,241,1), 0 0 60px rgba(99,102,241,0.6), inset 0 0 15px rgba(255,255,255,0.8)`,
                              animation: "pulse-dot 2s infinite",
                            }
                          : {
                              width: 20, height: 20,
                              background: `linear-gradient(135deg, ${A}, rgba(220,210,255,0.9))`,
                              boxShadow: `0 0 20px rgba(99,102,241,0.6), inset 0 0 10px rgba(255,255,255,0.5)`,
                            }
                      }
                    />
                    {/* 기간 텍스트 */}
                    <span
                      className="absolute whitespace-nowrap font-bold transition-all duration-300"
                      style={{
                        right: 40,
                        fontSize: isActive ? 18 : 14,
                        color: isActive ? A : `rgba(99,102,241,0.3)`,
                        textShadow: isActive ? `0 0 20px rgba(99,102,241,0.8)` : "none",
                      }}
                    >
                      {item.period}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* 우측 스크롤 카드 */}
        <div className="min-w-0 flex-1 space-y-[22vh] py-[8vh]">
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

      <style>{`
        /* ── 카드 기본 ─────────────────────────────── */
        .card-box {
          background: rgba(17, 17, 17, 0.80);
          border: 2px solid rgba(99, 102, 241, 0.20);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: border-color 0.5s ease, box-shadow 0.5s ease;
        }
        .card-box:hover {
          border-color: rgba(99, 102, 241, 0.60);
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.35),
            0 0 40px rgba(99, 102, 241, 0.20),
            inset 0 0 60px rgba(99, 102, 241, 0.05);
        }

        /* ── STEP 텍스트 ────────────────────────────── */
        .step-text {
          background: linear-gradient(135deg, rgba(99,102,241,0.35), rgba(99,102,241,0.06));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.7s ease;
        }
        .card-box:hover .step-text {
          background: linear-gradient(135deg, #6366f1, rgba(220,210,255,0.9));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 16px rgba(99,102,241,0.5));
        }

        /* ── 기술 태그 ──────────────────────────────── */
        .tag-badge {
          background: rgba(99, 102, 241, 0.10);
          border: 1px solid rgba(99, 102, 241, 0.30);
          color: #6366f1;
          transition: background 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .tag-badge:hover {
          background: rgba(99, 102, 241, 0.20);
          border-color: rgba(99, 102, 241, 0.60);
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.25);
        }

        /* ── shimmer ────────────────────────────────── */
        .shimmer {
          background: linear-gradient(90deg, transparent, rgba(99,102,241,0.09), transparent);
          transform: translateX(-100%);
          transition: none;
        }
        .card-box:hover .shimmer {
          animation: shimmer-slide 0.75s ease forwards;
        }

        /* ── Dot pulse ──────────────────────────────── */
        @keyframes pulse-dot {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.25); }
        }

        /* ── shimmer slide ──────────────────────────── */
        @keyframes shimmer-slide {
          from { transform: translateX(-100%); }
          to   { transform: translateX(200%); }
        }
      `}</style>
    </main>
  );
}
