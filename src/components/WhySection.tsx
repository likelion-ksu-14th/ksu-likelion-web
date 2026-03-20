"use client";

import { motion } from "framer-motion";

const cards = [
  {
    keyword: "Growth",
    label: "성장",
    description: "0에서 1을 만드는 실전 개발 역량 습득",
    icon: "⚡",
  },
  {
    keyword: "Network",
    label: "네트워크",
    description: "전국 단위 IT 커뮤니티 및 현업자 멘토링",
    icon: "🌐",
  },
  {
    keyword: "Output",
    label: "아웃풋",
    description: "1년 내 10개 이상의 서비스 출시 및 실제 사용자 유입 경험",
    icon: "🚀",
  },
];

export default function WhySection() {
  return (
    <section className="bg-[#0A0A0A] px-6 py-32">
      <div className="mx-auto max-w-5xl">
        {/* 섹션 헤딩 */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#6366F1]">
            Why Likelion KSU
          </p>
          <h2 className="text-3xl font-extrabold text-white md:text-5xl">
            우리를 선택해야 하는{" "}
            <span className="text-[#6366F1]">3가지 이유</span>
          </h2>
        </motion.div>

        {/* 카드 그리드 */}
        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.keyword}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.12 }}
              whileHover={{ scale: 1.03 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-8 transition-shadow duration-300 hover:shadow-[0_0_32px_4px_rgba(99,102,241,0.25)]"
            >
              {/* 호버 시 네온 배경 */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-[#6366F1]/60 transition-opacity duration-300 group-hover:opacity-100" />

              {/* 아이콘 */}
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#6366F1]/10 text-2xl transition-colors duration-300 group-hover:bg-[#6366F1]/20">
                {card.icon}
              </div>

              {/* 키워드 */}
              <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#6366F1]">
                {card.keyword}
              </p>

              {/* 라벨 */}
              <h3 className="mb-3 text-xl font-bold text-white">
                {card.label}
              </h3>

              {/* 설명 */}
              <p className="text-sm leading-relaxed text-zinc-400 transition-colors duration-300 group-hover:text-zinc-300">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
