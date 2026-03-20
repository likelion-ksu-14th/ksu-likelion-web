"use client";

import { motion } from "framer-motion";
import { TrendingUp, Users, Rocket } from "lucide-react";

/* ── 등장 애니메이션 variant ─────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      delay,
    },
  }),
};

/* ── 핵심 가치 카드 데이터 ────────────────────────────── */
const VALUES = [
  {
    icon: TrendingUp,
    title: "성장",
    desc: "커리큘럼과 프로젝트를 통해 개발 역량을 빠르게 끌어올립니다.",
    color: "#6366F1",
  },
  {
    icon: Users,
    title: "네트워크",
    desc: "같은 꿈을 가진 동료들과 함께 성장하며 오래가는 관계를 만듭니다.",
    color: "#8B5CF6",
  },
  {
    icon: Rocket,
    title: "아웃풋",
    desc: "아이디어를 실제 서비스로 완성시키는 경험, 그게 멋사의 방식입니다.",
    color: "#A78BFA",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-28">
      <div className="mx-auto max-w-5xl space-y-20">

        {/* ── 1. 메인 그리드: 텍스트 6 / 이미지 4 ──────── */}
        <div className="grid items-center gap-12 md:grid-cols-5">

          {/* 텍스트 영역 (6/10 → md:col-span-3) */}
          <motion.div
            className="md:col-span-3 flex flex-col gap-6"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0}
          >
            {/* 뱃지 */}
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-4 py-1.5 text-sm font-medium text-[#6366F1]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1]" />
              About Us
            </span>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl">
              About{" "}
              <span className="text-[#6366F1]">멋쟁이사자처럼</span>{" "}
              <span className="text-white">KSU</span>
            </h1>

            <p className="text-lg leading-relaxed text-zinc-400">
              경성대학교 멋쟁이사자처럼은 아이디어를 현실로 만드는 개발 동아리입니다.
              우리는 기술을 넘어{" "}
              <span className="font-semibold text-white">&apos;가치&apos;를 만드는 법</span>
              을 배웁니다.
            </p>

            <p className="text-base leading-relaxed text-zinc-500">
              단순한 스터디 모임이 아닙니다. 직접 기획하고, 직접 개발하고, 직접 배포하는
              경험을 통해 진짜 개발자로 성장합니다. 14기와 함께 여러분의 첫 번째 서비스를
              세상에 내놓으세요.
            </p>
          </motion.div>

          {/* 이미지 영역 (4/10 → md:col-span-2) */}
          <motion.div
            className="md:col-span-2"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.15}
            whileHover="hovered"
          >
            <motion.div
              className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/5 bg-black"
              variants={{
                hovered: {
                  boxShadow: "0 0 30px 8px rgba(99,102,241,0.40)",
                  borderColor: "rgba(99,102,241,0.35)",
                },
              }}
              transition={{ duration: 0.35 }}
            >
              {/* 이미지 — 1:1, cover, scale 없음 */}
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: "url('https://i.ibb.co/1GYV5gw5/vh1gk-BVNsa1-HLq-Dfi9b70b-Rsu-BU.png')",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center center",
                  backgroundSize: "cover",
                }}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* ── 2. 핵심 가치 카드 ──────────────────────────── */}
        <div>
          <motion.p
            className="mb-8 text-xs font-bold uppercase tracking-widest text-zinc-600"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={0.25}
          >
            Core Values
          </motion.p>
          <div className="grid gap-4 sm:grid-cols-3">
            {VALUES.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={0.3 + i * 0.1}
                className="group rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition-colors duration-300 hover:border-[#6366F1]/20 hover:bg-white/[0.06]"
              >
                <div
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${color}18` }}
                >
                  <Icon className="h-5 w-5" style={{ color }} />
                </div>
                <h3 className="mb-2 text-base font-bold text-white">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── 3. 강조 배너 ────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          custom={0.55}
          className="relative overflow-hidden rounded-2xl border border-[#6366F1]/20 bg-[#6366F1]/[0.08] px-8 py-10 text-center"
        >
          {/* 배경 글로우 */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(99,102,241,0.12),transparent_70%)]"
          />

          <p className="relative text-sm font-medium uppercase tracking-widest text-[#6366F1]/60">
            선발 방식
          </p>
          <p className="relative mt-3 text-2xl font-extrabold text-white md:text-3xl">
            면접 없이 오직{" "}
            <span className="text-[#6366F1]">진심</span>
            으로만 선발합니다
          </p>
          <p className="relative mt-3 text-sm text-zinc-500">
            서류 100% 선발 · 심리적 부담 없이 도전하세요
          </p>

          <div className="relative mt-6">
            <a
              href="/apply"
              className="inline-block rounded-full bg-[#6366F1] px-7 py-3 text-sm font-bold text-white transition-all hover:bg-[#4f52d4] hover:shadow-lg hover:shadow-[#6366F1]/30"
            >
              지금 지원하기 →
            </a>
            <p className="mt-3 text-xs text-zinc-600">서류 마감 3월 24일</p>
          </div>
        </motion.div>

      </div>
    </main>
  );
}
