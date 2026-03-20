"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/* ── 타입 ─────────────────────────────────────────── */
type FilterKey = "전체" | "대표" | "운영진" | "부원";

interface QnA {
  q: string;
  a: string;
}

interface Member {
  name: string;
  role: string;
  image: string | null;
  tags: string[];
  description: string;
  filter: Exclude<FilterKey, "전체">;
  questions: QnA[];
}

/* ── 멤버 데이터 ──────────────────────────────────── */
const membersData: Member[] = [
  {
    name: "김민교",
    role: "대표",
    image: "https://i.ibb.co/jBhhk4X/300397196-385255173754143-2569638798356540139-n.jpg",
    tags: ["#Growth", "#Entrepreneur"],
    description: "경성대 멋쟁이사자처럼 14기를 이끄는 대표입니다.",
    filter: "대표",
    questions: [],
  },
  {
    name: "김도현",
    role: "운영진 / 기획·PM Staff",
    image: "https://i.ibb.co/v4wJrHJx/images-1.png",
    tags: ["PM", "기획"],
    description: "아이디어를 구체적인 서비스로 설계합니다.",
    filter: "운영진",
    questions: [
      { q: "나에게 멋사란?", a: "성장의 발판입니다. 아이디어를 코드로 바꾸는 경험을 여기서 처음 했습니다." },
      { q: "멋사에서 가장 기억에 남는 순간은?", a: "첫 프로젝트 발표 날, 우리가 만든 서비스를 처음 세상에 공개했을 때의 떨림이 아직도 생생합니다." },
      { q: "14기 지원자에게 한 마디?", a: "망설이지 마세요. 여기선 모르는 것보다 도전하는 자세가 더 중요합니다." },
    ],
  },
  {
    name: "Next Lion",
    role: "14기 부원",
    image: null,
    tags: ["모집 중", "14기"],
    description: "당신의 자리가 기다리고 있습니다.",
    filter: "부원",
    questions: [],
  },
  {
    name: "Next Lion",
    role: "14기 부원",
    image: null,
    tags: ["모집 중", "14기"],
    description: "당신의 자리가 기다리고 있습니다.",
    filter: "부원",
    questions: [],
  },
  {
    name: "Next Lion",
    role: "14기 부원",
    image: null,
    tags: ["모집 중", "14기"],
    description: "당신의 자리가 기다리고 있습니다.",
    filter: "부원",
    questions: [],
  },
  {
    name: "Next Lion",
    role: "14기 부원",
    image: null,
    tags: ["모집 중", "14기"],
    description: "당신의 자리가 기다리고 있습니다.",
    filter: "부원",
    questions: [],
  },
  {
    name: "Next Lion",
    role: "14기 부원",
    image: null,
    tags: ["모집 중", "14기"],
    description: "당신의 자리가 기다리고 있습니다.",
    filter: "부원",
    questions: [],
  },
  {
    name: "Next Lion",
    role: "14기 부원",
    image: null,
    tags: ["모집 중", "14기"],
    description: "당신의 자리가 기다리고 있습니다.",
    filter: "부원",
    questions: [],
  },
];

const FILTERS: FilterKey[] = ["전체", "대표", "운영진", "부원"];

/* ── 실루엣 SVG ───────────────────────────────────── */
function SilhouetteAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const cls = size === "lg" ? "h-40 w-40" : size === "md" ? "h-28 w-28" : "h-16 w-16";
  return (
    <svg viewBox="0 0 80 100" className={`${cls} opacity-20`} fill="currentColor">
      <circle cx="40" cy="28" r="18" className="text-[#6366F1]" />
      <path d="M10 90 Q10 60 40 60 Q70 60 70 90" className="text-[#6366F1]" />
    </svg>
  );
}

/* ── 인터뷰 모달 ──────────────────────────────────── */
function InterviewModal({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) {
  const isRecruiting = member.name === "Next Lion";

  /* ESC 키로 닫기 */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  /* 스크롤 잠금 */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* 배경 오버레이 */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* 모달 패널 */}
      <motion.div
        className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#111111] shadow-[0_0_60px_rgba(99,102,241,0.15)]"
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* 보라색 글로우 상단 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/60 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-32 w-64 -translate-x-1/2 rounded-full bg-[#6366F1]/10 blur-3xl"
        />

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="닫기"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col sm:flex-row">
          {/* 왼쪽 — 프로필 */}
          <div className="flex flex-col items-center gap-4 border-b border-white/5 bg-white/[0.02] p-8 sm:w-56 sm:border-b-0 sm:border-r sm:p-10">
            {/* 아바타 */}
            <div className="relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-2 border-white/10 bg-[#1a1a2e] shadow-[0_0_20px_rgba(99,102,241,0.15)]">
              {isRecruiting ? (
                <SilhouetteAvatar size="lg" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={member.image!}
                  alt={member.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            {/* 이름·역할·태그 */}
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-lg font-bold text-white">{member.name}</p>
              <p className="text-xs text-zinc-500">{member.role}</p>
              <div className="flex flex-wrap justify-center gap-1.5 pt-1">
                {member.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#6366F1]/20 bg-[#6366F1]/10 px-2 py-0.5 text-[10px] font-semibold text-[#6366F1]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 한 줄 소개 */}
            <p className="text-center text-xs leading-relaxed text-zinc-600">
              {member.description}
            </p>
          </div>

          {/* 오른쪽 — 인터뷰 */}
          <div className="flex-1 overflow-y-auto p-8 sm:max-h-[520px]">
            {isRecruiting || member.questions.length === 0 ? (
              /* 모집 중 안내 */
              <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#6366F1]/20 bg-[#6366F1]/10">
                  <span className="text-2xl">🦁</span>
                </div>
                <p className="text-base font-bold text-white">이 자리가 당신을 기다립니다</p>
                <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
                  경성대 멋쟁이사자처럼 14기에 지원하면 이 자리의 주인공이 될 수 있습니다.
                </p>
                <a
                  href="https://forms.gle/cuYPDcYcmB22nbDG8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 rounded-full bg-[#6366F1] px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all hover:bg-[#4f52d4] hover:shadow-[0_0_28px_rgba(99,102,241,0.5)]"
                >
                  지금 지원하기 →
                </a>
              </div>
            ) : (
              /* Q&A 인터뷰 */
              <div className="space-y-8">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">
                  Interview
                </p>
                {member.questions.map(({ q, a }, i) => (
                  <motion.div
                    key={i}
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.4, ease: "easeOut" }}
                  >
                    {/* 질문 */}
                    <p className="flex items-start gap-2 text-sm font-semibold text-[#6366F1]">
                      <span className="mt-0.5 shrink-0 text-[#6366F1]/50">Q.</span>
                      {q}
                    </p>
                    {/* 답변 */}
                    <p className="border-l-2 border-white/10 pl-4 text-sm leading-relaxed text-zinc-300">
                      {a}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── 멤버 카드 ────────────────────────────────────── */
function MemberCard({
  member,
  onClick,
}: {
  member: Member;
  onClick: () => void;
}) {
  const isRecruiting = member.name === "Next Lion";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        boxShadow: "0 0 25px 4px rgba(99,102,241,0.20)",
        borderColor: "rgba(99,102,241,0.30)",
      }}
      onClick={onClick}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111111] transition-colors duration-300"
    >
      {/* 원형 이미지 영역 */}
      <div className="flex flex-col items-center px-6 pb-2 pt-8">
        <div className="relative">
          {/* 원형 아바타 */}
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-white/10 bg-[#1a1a2e] transition-shadow duration-300 group-hover:border-[#6366F1]/40 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.30)]">
            {isRecruiting ? (
              <div className="flex h-full w-full items-center justify-center">
                <SilhouetteAvatar size="sm" />
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={member.image!}
                alt={member.name}
                className="h-full w-full object-cover"
              />
            )}
            {/* 호버 오버레이 */}
            <div className="absolute inset-0 rounded-full bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
          </div>
          {/* 이미지 위 모집 중 텍스트 제거 — 하단 카드 태그로 대체 */}
        </div>
      </div>

      {/* 텍스트 영역 */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap gap-1.5">
          {member.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#6366F1]/20 bg-[#6366F1]/10 px-2 py-0.5 text-[10px] font-semibold text-[#6366F1]"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-sm font-bold text-white">{member.name}</p>
        <p className="text-xs text-zinc-500">{member.role}</p>
        <p className="mt-auto text-xs leading-relaxed text-zinc-600">
          {member.description}
        </p>
      </div>
    </motion.div>
  );
}

/* ── 대표 인터뷰 블록 ─────────────────────────────── */
const LEAD_PHOTO = ""; // 강동우님 사진 URL을 여기에 입력하세요

function LeadInterview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111111] shadow-[0_0_40px_rgba(99,102,241,0.08)]"
    >
      {/* 상단 글로우 라인 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6366F1]/50 to-transparent"
      />
      {/* 배경 글로우 */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6366F1]/8 blur-3xl"
      />

      <div className="relative flex flex-col gap-8 p-8 sm:flex-row sm:items-center sm:gap-10 sm:p-10">
        {/* 프로필 — 모바일: 가로 배치 / sm+: 세로 중앙 */}
        <div className="flex flex-row items-center gap-5 sm:flex-col sm:items-center sm:gap-4 sm:text-center">
          {/* 사진 */}
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[#6366F1]/40 bg-[#1a1a2e] shadow-[0_0_20px_rgba(99,102,241,0.2)] sm:h-28 sm:w-28">
            {LEAD_PHOTO ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={LEAD_PHOTO} alt="강동우" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <SilhouetteAvatar size="md" />
              </div>
            )}
          </div>
          {/* 이름·직함 */}
          <div className="sm:flex sm:flex-col sm:items-center sm:gap-1">
            <p className="text-base font-bold text-white">강동우</p>
            <p className="text-xs text-zinc-500">경성대 멋쟁이사자처럼 14기 대표</p>
            <span className="mt-1 inline-block rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-2.5 py-0.5 text-[10px] font-semibold text-[#6366F1]">
              Lead
            </span>
          </div>
        </div>

        {/* 인터뷰 내용 */}
        <div className="flex flex-1 flex-col gap-4">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">
            Lead Interview
          </p>
          <h3 className="text-xl font-extrabold leading-snug tracking-tight text-white sm:text-2xl">
            "결과로 증명하는 14기의 여정,{" "}
            <span className="text-[#6366F1]">우리가 함께 만듭니다.</span>"
          </h3>
          <p className="border-l-2 border-[#6366F1]/30 pl-4 text-sm leading-relaxed text-zinc-300">
            경성대 멋사는 단순히 코딩을 배우는 곳이 아닙니다. 우리의 아이디어가 실제 서비스로
            런칭되어 유저를 만나는 순간, 그 짜릿한 '결과'를 경험하는 곳입니다. 14기 여러분이
            포기하지 않고 끝까지 실행할 수 있도록 최선을 다해 돕겠습니다. 우리와 함께 세상을
            조금 더 편리하게 바꿔볼까요?
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ── 메인 섹션 ────────────────────────────────────── */
export default function MembersSection() {
  const [active, setActive] = useState<FilterKey>("전체");
  const [selected, setSelected] = useState<Member | null>(null);

  const filtered =
    active === "전체"
      ? membersData
      : membersData.filter((m) => m.filter === active);

  return (
    <>
      <section className="mx-auto max-w-6xl space-y-10">
        {/* 헤더 */}
        <div className="space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-4 py-1.5 text-sm font-medium text-[#6366F1]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1]" />
            Members
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            함께 성장하는{" "}
            <span className="text-[#6366F1]">멤버들</span>
          </h1>
          <p className="text-base text-zinc-400">
            경성대 멋쟁이사자처럼 14기 — 아이디어를 현실로 만드는 사람들을 만나보세요.
          </p>
        </div>

        {/* 대표 인터뷰 */}
        <LeadInterview />

        {/* 필터 버튼 */}
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                active === f
                  ? "border-[#6366F1] bg-[#6366F1] text-white shadow-[0_0_16px_rgba(99,102,241,0.35)]"
                  : "border-white/10 bg-white/[0.04] text-zinc-400 hover:border-[#6366F1]/40 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* 그리드 */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={active}
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          >
            {filtered.map((member, i) => (
              <MemberCard
                key={`${member.name}-${member.filter}-${i}`}
                member={member}
                onClick={() => setSelected(member)}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* 인터뷰 모달 */}
      <AnimatePresence>
        {selected && (
          <InterviewModal member={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
