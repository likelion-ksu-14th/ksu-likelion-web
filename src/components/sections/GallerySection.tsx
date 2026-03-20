"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/* ── 갤러리 데이터 — 사진 교체 시 이 배열만 수정하세요 ── */
export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  span?: "col" | "row" | "both"; // 데스크탑에서 큰 타일로 강조할 경우 사용
}

export const galleryData: GalleryItem[] = [
  { id: 1,  src: "", alt: "해커톤 현장" },
  { id: 2,  src: "", alt: "네트워킹 파티" },
  { id: 3,  src: "", alt: "프로젝트 발표" },
  { id: 4,  src: "", alt: "스터디 세션" },
  { id: 5,  src: "", alt: "OT 행사" },
  { id: 6,  src: "", alt: "팀 빌딩" },
  { id: 7,  src: "", alt: "코딩 세션" },
  { id: 8,  src: "", alt: "수료식" },
];

/* ── 이미지 플레이스홀더 ──────────────────────────── */
function PhotoPlaceholder({ alt }: { alt: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[#1a1a2e]">
      <span className="text-3xl opacity-30">📷</span>
      <span className="px-2 text-center text-[11px] text-zinc-600">{alt}</span>
    </div>
  );
}

/* ── 라이트박스 ───────────────────────────────────── */
function Lightbox({
  items,
  index,
  onClose,
}: {
  items: GalleryItem[];
  index: number;
  onClose: () => void;
}) {
  const [current, setCurrent] = useState(index);
  const item = items[current];

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + items.length) % items.length),
    [items.length]
  );
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % items.length),
    [items.length]
  );

  /* 키보드 네비게이션 */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, prev, next]);

  /* 스크롤 잠금 */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* 배경 */}
      <motion.div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* 이미지 패널 */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-[0_0_60px_rgba(0,0,0,0.8)]"
            style={{ aspectRatio: "16/10" }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {item.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.src}
                alt={item.alt}
                className="h-full w-full object-cover"
              />
            ) : (
              <PhotoPlaceholder alt={item.alt} />
            )}
            {/* 하단 캡션 */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-5 pt-10">
              <p className="text-sm font-semibold text-white">{item.alt}</p>
              <p className="text-xs text-zinc-500">{current + 1} / {items.length}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* 네비게이션 버튼 */}
        <div className="flex items-center gap-3">
          <button
            onClick={prev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:bg-white/15 hover:text-white"
            aria-label="이전 사진"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {/* 썸네일 인디케이터 */}
          <div className="flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === current
                    ? "w-6 bg-[#6366F1]"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                }`}
                aria-label={`${i + 1}번 사진`}
              />
            ))}
          </div>
          <button
            onClick={next}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:bg-white/15 hover:text-white"
            aria-label="다음 사진"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:bg-white/15 hover:text-white"
        aria-label="닫기"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

/* ── 갤러리 카드 ──────────────────────────────────── */
function GalleryCard({
  item,
  onClick,
}: {
  item: GalleryItem;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-sm"
      style={{ aspectRatio: "4/3" }}
    >
      {item.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt={item.alt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
        />
      ) : (
        <PhotoPlaceholder alt={item.alt} />
      )}

      {/* 호버 오버레이 */}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="w-full px-4 pb-4">
          <p className="text-sm font-semibold text-white">{item.alt}</p>
        </div>
      </div>

      {/* 확대 아이콘 힌트 */}
      <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
        <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </div>
    </motion.div>
  );
}

/* ── GallerySection ───────────────────────────────── */
export default function GallerySection() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <section className="mx-auto max-w-6xl space-y-10">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-3"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 px-4 py-1.5 text-sm font-medium text-[#6366F1]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#6366F1]" />
            Our Moments
          </span>
          <h2 className="text-4xl font-extrabold tracking-tight text-white md:text-5xl">
            우리가 함께 만든{" "}
            <span className="text-[#6366F1]">순간들</span>
          </h2>
          <p className="text-base text-zinc-400">
            열정적인 코딩부터 즐거운 네트워킹까지, 경성대 멋사의 일상을 확인해보세요.
          </p>
        </motion.div>

        {/* 모바일: 가로 스크롤 캐러셀 / sm+: 3~4열 그리드 */}
        <div>
          {/* 모바일 캐러셀 (sm 미만) */}
          <div className="flex gap-4 overflow-x-auto pb-3 sm:hidden" style={{ scrollSnapType: "x mandatory" }}>
            {galleryData.map((item, i) => (
              <div
                key={item.id}
                className="w-[70vw] shrink-0"
                style={{ scrollSnapAlign: "start" }}
              >
                <GalleryCard item={item} onClick={() => setLightboxIndex(i)} />
              </div>
            ))}
          </div>

          {/* 데스크탑 그리드 (sm 이상) */}
          <div className="hidden grid-cols-2 gap-4 sm:grid md:grid-cols-3 lg:grid-cols-4">
            {galleryData.map((item, i) => (
              <GalleryCard
                key={item.id}
                item={item}
                onClick={() => setLightboxIndex(i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 라이트박스 */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={galleryData}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
