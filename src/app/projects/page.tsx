"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

/* ── 타입 ───────────────────────────────────────────────── */
type Category = "전체" | "웹" | "AI" | "앱";

interface Project {
  id: number;
  title: string;
  subtitle: string;
  desc: string;
  tags: string[];
  category: Exclude<Category, "전체">[];
  emoji?: string;
  image?: string;
  gradient: string;
  placeholder?: boolean;
  generation?: 13 | 14;
}

/* ── 데이터 ─────────────────────────────────────────────── */
const PROJECTS: Project[] = [
  {
    id: 1,
    title: "YAM",
    subtitle: "따뜻한 아이스 아메리카노팀",
    desc: "붕어빵을 주제로 한 AR 카메라 기반 아이디어 서비스. AR 기술로 일상 속 재미를 선사합니다.",
    tags: ["#AR", "#Idea", "#13기"],
    category: ["앱"],
    image: "https://i.ibb.co/Pzf3sJxc/IMG-4987.png",
    gradient: "from-[#6366F1]/30 via-[#6366F1]/10 to-transparent",
    generation: 13,
  },
  {
    id: 2,
    title: "바아름",
    subtitle: "발음 교정 플랫폼",
    desc: "아름다운 발음을 위한 발음 교정 플랫폼. 사용자의 발음을 분석하고 맞춤 피드백을 제공합니다.",
    tags: ["#Platform", "#SpeechError", "#13기"],
    category: ["웹", "AI"],
    image: "https://i.ibb.co/r2WGXMBQ/IMG-4988.png",
    gradient: "from-[#8B5CF6]/30 via-[#8B5CF6]/10 to-transparent",
    generation: 13,
  },
  {
    id: 3,
    title: "Coming Soon",
    subtitle: "14기 웹 프로젝트",
    desc: "멋쟁이사자처럼 14기 부원들이 함께 빌드할 웹 서비스입니다. 곧 공개됩니다.",
    tags: ["React", "TailwindCSS"],
    category: ["웹"],
    emoji: "🌐",
    gradient: "from-white/5 to-transparent",
    placeholder: true,
    generation: 14,
  },
  {
    id: 4,
    title: "Coming Soon",
    subtitle: "14기 AI 프로젝트",
    desc: "AI·머신러닝 기술을 활용한 실험적 서비스입니다. 14기의 도전을 기대해주세요.",
    tags: ["Python", "OpenAI", "LangChain"],
    category: ["AI"],
    emoji: "🤖",
    gradient: "from-white/5 to-transparent",
    placeholder: true,
    generation: 14,
  },
  {
    id: 5,
    title: "Coming Soon",
    subtitle: "14기 앱 프로젝트",
    desc: "모바일 환경에 최적화된 앱 서비스를 개발합니다. 사용자의 일상을 바꿀 아이디어 준비 중.",
    tags: ["React Native", "Expo"],
    category: ["앱"],
    emoji: "📱",
    gradient: "from-white/5 to-transparent",
    placeholder: true,
    generation: 14,
  },
  {
    id: 6,
    title: "Coming Soon",
    subtitle: "14기 AI 앱 프로젝트",
    desc: "AI와 모바일의 결합. 14기가 새롭게 도전할 융합 프로젝트입니다.",
    tags: ["Flutter", "Python", "AI API"],
    category: ["앱", "AI"],
    emoji: "✨",
    gradient: "from-white/5 to-transparent",
    placeholder: true,
    generation: 14,
  },
];

const CATEGORIES: Category[] = ["전체", "웹", "AI", "앱"];

/* ── 이미지 모달 ─────────────────────────────────────────── */
function ImageModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 상단 바 */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
            <div>
              <p className="text-sm font-bold text-white">{project.title}</p>
              <p className="text-xs text-zinc-500">{project.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-zinc-500 transition hover:border-white/30 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 이미지 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.image}
            alt={project.title}
            className="max-h-[70vh] w-full object-contain"
          />

          {/* 하단 설명 */}
          <div className="border-t border-white/10 px-5 py-4">
            <p className="mb-2 text-sm text-zinc-300">{project.desc}</p>
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-2.5 py-0.5 text-xs font-medium text-[#6366F1]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── 프로젝트 카드 ──────────────────────────────────────── */
function ProjectCard({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={
        project.placeholder
          ? { scale: 1.01 }
          : { scale: 1.035, y: -6 }
      }
      onClick={!project.placeholder ? onOpen : undefined}
      className={[
        "group relative flex flex-col overflow-hidden rounded-2xl",
        "border border-white/10 bg-white/[0.03]",
        !project.placeholder ? "cursor-pointer" : "cursor-default",
      ].join(" ")}
      style={
        !project.placeholder
          ? {
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)",
            }
          : undefined
      }
    >
      {/* 썸네일 */}
      <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${project.gradient}`}>
        {project.image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* 13기 뱃지 */}
            <span className="absolute left-3 top-3 rounded-full border border-indigo-500/50 bg-black/70 px-3 py-1 text-[11px] font-bold tracking-widest text-white shadow-[0_0_8px_rgba(99,102,241,0.3)] backdrop-blur-sm">
              13기 결과물
            </span>
          </>
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-5xl">{project.emoji}</span>
          </div>
        )}

        {/* 호버 오버레이 */}
        <motion.div
          initial={false}
          animate={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 flex items-center justify-center bg-black/55 backdrop-blur-[2px]"
        >
          <span className="rounded-full border border-white/40 bg-white/10 px-5 py-2 text-sm font-semibold text-white">
            {project.placeholder ? "Coming Soon" : "크게 보기 →"}
          </span>
        </motion.div>
      </div>

      {/* 본문 */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2">
          <h3
            className={`text-lg font-extrabold ${
              project.placeholder ? "text-zinc-500" : "text-white"
            }`}
          >
            {project.title}
          </h3>
          <p
            className={`text-xs font-semibold tracking-wide ${
              project.placeholder ? "text-zinc-700" : "text-[#6366F1]"
            }`}
          >
            {project.subtitle}
          </p>
        </div>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-zinc-400">{project.desc}</p>

        <div className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                project.placeholder
                  ? "border border-white/5 text-zinc-700"
                  : "border border-[#6366F1]/30 bg-[#6366F1]/10 text-[#6366F1]"
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 호버 시 네온 테두리 + 글로우 */}
      {!project.placeholder && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-[#6366F1]/50 transition-all duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_30px_4px_rgba(99,102,241,0.18)]" />
      )}
    </motion.div>
  );
}

/* ── 필터 버튼 ─────────────────────────────────────────── */
function FilterButton({
  label,
  active,
  onClick,
}: {
  label: Category;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "relative rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200",
        active
          ? "bg-[#6366F1] text-white shadow-lg shadow-[#6366F1]/30"
          : "border border-white/10 text-zinc-400 hover:border-white/20 hover:text-white",
      ].join(" ")}
    >
      {label}
      {active && (
        <motion.span
          layoutId="filter-pill"
          className="absolute inset-0 rounded-full bg-[#6366F1]"
          style={{ zIndex: -1 }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </button>
  );
}

/* ── 페이지 ────────────────────────────────────────────── */
export default function ProjectsPage() {
  const [active, setActive] = useState<Category>("전체");
  const [modalProject, setModalProject] = useState<Project | null>(null);

  const filtered = PROJECTS.filter(
    (p) => active === "전체" || p.category.includes(active as Exclude<Category, "전체">),
  );

  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 pb-24 pt-40">
      <div className="mx-auto max-w-6xl">
        {/* 헤딩 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-14 text-center"
        >
          {/* 13기 예시 뱃지 */}
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-4 py-1.5 text-xs font-semibold text-[#6366F1]">
              Output Examples
            </span>
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#6366F1]">
            Projects
          </p>
          <h1 className="text-4xl font-extrabold text-white md:text-5xl">
            상상이 코드가 되고,{" "}
            <span className="text-[#6366F1]">세상에 나온 서비스들</span>
          </h1>
          <p className="mt-4 text-base text-zinc-500">
            경성대 멋쟁이사자처럼이 직접 기획하고 빌드한 프로젝트를 소개합니다.
          </p>
        </motion.div>

        {/* 필터 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-10 flex flex-wrap justify-center gap-2"
        >
          {CATEGORIES.map((cat) => (
            <FilterButton
              key={cat}
              label={cat}
              active={active === cat}
              onClick={() => setActive(cat)}
            />
          ))}
        </motion.div>

        {/* 카운트 */}
        <p className="mb-6 text-center text-xs text-zinc-600">{filtered.length}개의 프로젝트</p>

        {/* 그리드 */}
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={() => setModalProject(project)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* 모달 */}
      <AnimatePresence>
        {modalProject && (
          <ImageModal project={modalProject} onClose={() => setModalProject(null)} />
        )}
      </AnimatePresence>
    </main>
  );
}
