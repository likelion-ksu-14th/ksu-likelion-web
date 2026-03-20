"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  type Transition,
  type TargetAndTransition,
} from "framer-motion";

/* ── 아코디언 ─────────────────────────────────────────── */
const NOTICES = [
  {
    q: "활동 참여 관련",
    a: "모든 부원은 성실한 참여가 필수입니다. 무단 결석 3회 이상 시 수료가 어려울 수 있습니다.",
  },
  {
    q: "공통 세션 일정",
    a: "공통 세션은 매주 목요일 저녁에 진행됩니다. 입부 후 세부 시간은 공지를 통해 안내됩니다.",
  },
  {
    q: "회비 및 지원",
    a: "소정의 연회비가 있으며, 활동 지원을 위한 다양한 물품 및 교육 자료가 제공됩니다.",
  },
  {
    q: "면접 및 선발 과정",
    a: "14기는 면접 없이 서류 100% 선발로 진행됩니다. 지원서에 담긴 여러분의 열정과 의지만으로 평가합니다.",
  },
  {
    q: "프로젝트 팀 구성",
    a: "2학기부터 팀 프로젝트가 시작되며, 관심사와 역할에 따라 팀이 구성됩니다. 개발자·디자이너·기획자 모두 환영합니다.",
  },
];

/* isOpen/onToggle을 받아 Single-open 지원 */
function AccordionItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-white/10 last:border-none">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-base font-semibold text-white">{q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="ml-4 flex-shrink-0 text-xl font-light text-[#6366F1]"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-base leading-relaxed text-zinc-400">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── FaqItem — Single-open 지원 (isOpen/onToggle props) ── */
function FaqItem({ q, a, icon, isOpen, onToggle }: {
  q: string; a: string; icon: string; isOpen: boolean; onToggle: () => void;
}) {
  return (
    <div
      className={[
        "overflow-hidden rounded-2xl border transition-colors duration-200",
        isOpen
          ? "border-[#6366F1]/40 bg-[#6366F1]/5"
          : "border-white/10 bg-white/[0.03] hover:border-white/20",
      ].join(" ")}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-6 py-5 text-left"
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl">
          {icon}
        </span>
        <span className="flex-1 text-base font-semibold text-white">{q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.22 }}
          className="shrink-0 text-xl font-light text-[#6366F1]"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="border-t border-white/5 px-6 pb-6 pt-4 text-base leading-relaxed text-zinc-400">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── 14기 모집 FAQ ────────────────────────────────────── */
const RECRUIT_FAQ = [
  {
    q: "Q1. 경성대 학생만 지원 가능한가요?",
    a: "네, 경성대학교 재학생/휴학생이면 누구나 지원 가능합니다.",
    icon: "🎓",
  },
  {
    q: "Q2. 비전공자도 지원할 수 있나요? 코딩 실력이 중요한가요?",
    a: "완전 가능합니다! 우리는 기술 스택보다는 '상상을 실행으로 옮기는 열정'을 가장 중요하게 생각합니다. 코딩 실력과 전공 여부는 선발 기준이 아닙니다.",
    icon: "💡",
  },
  {
    q: "Q3. 14기 선발 방식이 어떻게 되나요? 면접이 있나요?",
    a: "14기는 '면접 없음·서류 100% 선발'로 진행됩니다. 오직 서류(지원서)에 담긴 여러분의 상상력과 실행력만 보고 선발합니다!",
    icon: "✅",
  },
  {
    q: "Q4. 활동 기간과 혜택이 궁금합니다.",
    a: "활동 기간은 1년이며, 커리큘럼 이수 시 수료증 발급, 다양한 프로젝트 협업 기회, 현업 멘토링, 멋쟁이사자처럼 중앙 행사 참여 등 다양한 혜택을 제공합니다.",
    icon: "🏆",
  },
];

/* ── 유의사항 FAQ ─────────────────────────────────────── */
const CAUTION_FAQ = [
  {
    q: "중복 지원이 가능한가요?",
    a: "동일 기수에 중복 지원은 불가합니다. 1인 1회 지원이 원칙이며, 중복 접수 시 모든 지원이 무효 처리될 수 있습니다.",
    icon: "⚠️",
  },
  {
    q: "허위 기재 시 어떻게 되나요?",
    a: "지원서에 허위 사실을 기재한 경우, 합격 이후라도 합격이 취소될 수 있습니다. 성실하고 정직한 지원을 부탁드립니다.",
    icon: "❌",
  },
  {
    q: "활동에 반드시 참여해야 하나요?",
    a: "네, 모든 부원은 정기 세션 및 활동에 성실한 참여가 필수입니다. 무단 결석이 3회 이상 누적될 경우 수료가 어려울 수 있습니다.",
    icon: "📌",
  },
  {
    q: "회비는 얼마인가요?",
    a: "소정의 연회비가 있으며, 최종 합격 후 입부 오리엔테이션에서 별도 안내드립니다. 회비는 활동 지원 및 행사 운영에 사용됩니다.",
    icon: "💰",
  },
];

/* ── 페이지 ────────────────────────────────────────────── */
const fadeUp = (
  delay = 0,
): { initial: TargetAndTransition; animate: TargetAndTransition; transition: Transition } => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, ease: "easeOut" as const, delay },
});

export default function ApplyPage() {
  const [openNoticeId, setOpenNoticeId] = useState<string | null>(null);
  const [openFaqId,    setOpenFaqId]    = useState<string | null>(null);
  const [openCautionId, setOpenCautionId] = useState<string | null>(null);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0A0A]">
      {/* ── 배경 글로우 ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[#6366F1]/10 blur-[140px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-[#6366F1]/5 blur-[100px]"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-40">
        {/* ── 헤더 ── */}
        <motion.div {...fadeUp(0)} className="mb-20 text-center">
          {/* Recruiting Now 뱃지 */}
          <div className="mb-6 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-1.5 text-sm font-bold text-[#22C55E]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22C55E] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22C55E]" />
              </span>
              Recruiting Now
            </span>
          </div>

          <h1 className="mx-auto max-w-2xl text-4xl font-extrabold leading-tight text-white md:text-5xl">
            당신의 상상을 현실로,
            <br />
            <span className="text-[#6366F1]">14기 아기사자를 모집합니다</span>
          </h1>
          <p className="mt-5 text-base text-zinc-500">
            경성대학교 멋쟁이사자처럼과 함께 1년 간 코드로 세상을 바꿔보세요.
          </p>
        </motion.div>

        {/* ── 정보 카드 3단 그리드 ── */}
        <div className="mb-20 grid gap-5 md:grid-cols-3">
          {/* 모집 기간 */}
          <motion.div
            {...fadeUp(0.1)}
            className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center"
          >
            <p className="mb-5 text-xs font-bold uppercase tracking-widest text-[#6366F1]">
              모집 기간
            </p>
            <p className="text-4xl font-extrabold leading-tight text-white">2026.03.01</p>
            <p className="my-2 text-2xl font-bold text-zinc-600">–</p>
            <p className="text-4xl font-extrabold leading-tight text-white">2026.03.24</p>
            <p className="mt-5 text-base text-zinc-500">서류 마감 3월 24일 자정</p>
          </motion.div>

          {/* 지원 자격 */}
          <motion.div
            {...fadeUp(0.18)}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#6366F1]">
              지원 자격
            </p>
            <p className="mb-4 text-sm font-semibold leading-relaxed text-white">
              학과 무관, 열정만 있다면 누구나!
            </p>
            <ul className="space-y-2">
              {["경성대 재학생", "경성대 휴학생", "코딩 경험 무관"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-zinc-400">
                    <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#22C55E]" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </motion.div>

          {/* 선발 절차 */}
          <motion.div
            {...fadeUp(0.26)}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <p className="mb-4 text-xs font-bold uppercase tracking-widest text-[#6366F1]">
              선발 절차
            </p>
            {/* 면접 없음 강조 뱃지 */}
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#22C55E]/20 bg-[#22C55E]/10 px-3 py-2">
              <span className="text-base">✅</span>
              <span className="text-xs font-bold text-[#22C55E]">면접 없음 · 서류 100% 선발</span>
            </div>
            <div className="flex flex-col gap-3">
              {[
                { step: "01", label: "서류 접수", icon: "📝" },
                { step: "02", label: "서류 검토", icon: "🔍" },
                { step: "03", label: "최종 합격 발표", icon: "🎉" },
              ].map((s, i, arr) => (
                <div key={s.step}>
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#6366F1]/20 text-xs font-bold text-[#6366F1]">
                      {s.step}
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {s.icon} {s.label}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="ml-3.5 mt-1 h-3 w-px bg-white/10" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── 유의사항 아코디언 ── */}
        <motion.div
          {...fadeUp(0.3)}
          className="mb-24"
        >
          <h2 className="mb-6 text-2xl font-extrabold text-white">
            유의사항 <span className="text-[#6366F1]">FAQ</span>
          </h2>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6">
            {NOTICES.map((n) => (
              <AccordionItem
                key={n.q}
                q={n.q}
                a={n.a}
                isOpen={openNoticeId === n.q}
                onToggle={() => setOpenNoticeId(openNoticeId === n.q ? null : n.q)}
              />
            ))}
          </div>
        </motion.div>

        {/* ── 14기 모집 FAQ ── */}
        <motion.div id="faq" {...fadeUp(0.38)} className="mb-24 scroll-mt-24">
          {/* 섹션 헤더 */}
          <div className="mb-8 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-4 py-1.5 text-sm font-medium text-[#6366F1]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1]" />
              FAQ
            </span>
          </div>
          <h2 className="mb-8 text-2xl font-extrabold text-white">
            14기 모집 FAQ{" "}
            <span className="text-[#6366F1]">자주 묻는 질문</span>
          </h2>

          {/* 14기 모집 FAQ 아코디언 */}
          <div className="space-y-3">
            {RECRUIT_FAQ.map(({ q, a, icon }) => (
              <FaqItem
                key={q}
                q={q}
                a={a}
                icon={icon}
                isOpen={openFaqId === q}
                onToggle={() => setOpenFaqId(openFaqId === q ? null : q)}
              />
            ))}
          </div>
        </motion.div>

        {/* ── 유의사항 FAQ ── */}
        <motion.div {...fadeUp(0.44)} className="mb-24">
          <div className="mb-8 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-base font-medium text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              유의사항
            </span>
          </div>
          <h2 className="mb-8 text-2xl font-extrabold text-white">
            지원 전 꼭 확인하세요{" "}
            <span className="text-amber-400">유의사항 FAQ</span>
          </h2>
          <div className="space-y-3">
            {CAUTION_FAQ.map(({ q, a, icon }) => (
              <FaqItem
                key={q}
                q={q}
                a={a}
                icon={icon}
                isOpen={openCautionId === q}
                onToggle={() => setOpenCautionId(openCautionId === q ? null : q)}
              />
            ))}
          </div>
        </motion.div>

        {/* ── 대형 CTA 버튼 ── */}
        <motion.div {...fadeUp(0.4)} className="flex justify-center">
          <div className="relative">
            {/* 호버 시 퍼지는 안개 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1.3 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 rounded-full bg-[#6366F1]/30 blur-2xl"
            />
            <motion.a
              href="https://forms.gle/cuYPDcYcmB22nbDG8"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative block rounded-full bg-gradient-to-r from-[#6366F1] to-[#818CF8] px-12 py-5 text-lg font-extrabold text-white shadow-[0_0_40px_rgba(99,102,241,0.5)] transition-shadow duration-300 hover:shadow-[0_0_60px_rgba(99,102,241,0.7)]"
            >
              동의하고 지원서 작성하기 →
            </motion.a>
          </div>
        </motion.div>
        <p className="mt-4 text-center text-xs text-zinc-600">
          지원서 제출 후 검토까지 2–3일 소요됩니다.
        </p>
      </div>
    </main>
  );
}
