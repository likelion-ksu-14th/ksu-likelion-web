"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

/* ── 카테고리 타입 ────────────────────────────────── */
type Category = "전체" | "세션" | "해커톤" | "네트워킹";
const CATEGORIES: Category[] = ["전체", "세션", "해커톤", "네트워킹"];

/* ── 갤러리 데이터 — src에 URL만 채워 넣으면 자동 반영됩니다 ── */
export interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  category: Exclude<Category, "전체">;
}

export const galleryData: GalleryItem[] = [
  { id: 1,  src: "", alt: "해커톤 현장",    category: "해커톤"   },
  { id: 2,  src: "", alt: "네트워킹 파티",  category: "네트워킹" },
  { id: 3,  src: "", alt: "프로젝트 발표",  category: "세션"     },
  { id: 4,  src: "", alt: "스터디 세션",    category: "세션"     },
  { id: 5,  src: "", alt: "OT 행사",        category: "네트워킹" },
  { id: 6,  src: "", alt: "팀 빌딩",        category: "네트워킹" },
  { id: 7,  src: "", alt: "코딩 세션",      category: "세션"     },
  { id: 8,  src: "", alt: "수료식",         category: "네트워킹" },
];

/* ── 카테고리별 이모지 (플레이스홀더용) ─────────── */
const CATEGORY_EMOJI: Record<string, string> = {
  "해커톤 현장":   "💻",
  "네트워킹 파티": "🥂",
  "프로젝트 발표": "🎤",
  "스터디 세션":   "📚",
  "OT 행사":       "🦁",
  "팀 빌딩":       "🤝",
  "코딩 세션":     "⌨️",
  "수료식":        "🎓",
};

/* ── 플레이스홀더 ─────────────────────────────────── */
function Placeholder({ alt }: { alt: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#13131f] to-[#1a1a2e]">
      <span className="text-3xl">{CATEGORY_EMOJI[alt] ?? "📷"}</span>
      <span className="px-3 text-center text-[11px] font-medium text-zinc-600">{alt}</span>
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

  const prev = useCallback(() => setCurrent((c) => (c - 1 + items.length) % items.length), [items.length]);
  const next = useCallback(() => setCurrent((c) => (c + 1) % items.length), [items.length]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, prev, next]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="absolute inset-0 bg-black/92 backdrop-blur-md"
        onClick={onClose}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      />

      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111]"
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
                loading="eager"
                decoding="async"
                width={1200}
                height={750}
                className="h-full w-full object-cover"
              />
            ) : (
              <Placeholder alt={item.alt} />
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-5 pt-12">
              <p className="text-sm font-semibold text-white">{item.alt}</p>
              <p className="text-xs text-zinc-500">{current + 1} / {items.length}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <button onClick={prev} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:bg-white/15 hover:text-white" aria-label="이전">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-1.5">
            {items.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-200 ${i === current ? "w-6 bg-[#6366F1]" : "w-1.5 bg-white/20 hover:bg-white/40"}`}
                aria-label={`${i + 1}번`}
              />
            ))}
          </div>
          <button onClick={next} className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:bg-white/15 hover:text-white" aria-label="다음">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <button onClick={onClose}
        className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:bg-white/15 hover:text-white"
        aria-label="닫기"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

/* ── 마르키 카드 ──────────────────────────────────── */
function MarqueeCard({ item, onClick }: { item: GalleryItem; onClick: () => void }) {
  return (
    // w-72(288px) × h-52(208px) 고정 → CLS 방지
    <div
      onClick={onClick}
      className="group relative h-52 w-72 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#111]"
    >
      {item.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          width={288}
          height={208}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
        />
      ) : (
        <Placeholder alt={item.alt} />
      )}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="w-full px-4 pb-4 text-sm font-semibold text-white">{item.alt}</p>
      </div>
    </div>
  );
}

/* ── 인피니트 마르키 행 ───────────────────────────── */
function MarqueeRow({
  items,
  direction = "left",
  speed = 35,
  onCardClick,
}: {
  items: GalleryItem[];
  direction?: "left" | "right";
  speed?: number;
  onCardClick: (globalIndex: number) => void;
}) {
  // 아이템을 3배로 복제해 끊김 없이 루프
  const tripled = [...items, ...items, ...items];
  const totalWidth = items.length * (288 + 16); // w-72 + gap-4

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-4"
        style={{ width: `${tripled.length * (288 + 16)}px` }}
        animate={{ x: direction === "left" ? [-totalWidth, 0] : [0, -totalWidth] }}
        transition={{ duration: speed * items.length, ease: "linear", repeat: Infinity }}
      >
        {tripled.map((item, i) => (
          <MarqueeCard
            key={`${item.id}-${i}`}
            item={item}
            onClick={() => onCardClick(i % items.length)}
          />
        ))}
      </motion.div>
    </div>
  );
}

/* ── 그리드 카드 (필터 뷰) ───────────────────────── */
function GridCard({ item, onClick }: { item: GalleryItem; onClick: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-[#111]"
      style={{ aspectRatio: "4/3" }}
    >
      {item.src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          decoding="async"
          width={400}
          height={300}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale group-hover:grayscale-0"
        />
      ) : (
        <Placeholder alt={item.alt} />
      )}
      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <p className="w-full px-4 pb-4 text-sm font-semibold text-white">{item.alt}</p>
      </div>
    </motion.div>
  );
}

/* ── GallerySection ───────────────────────────────── */
export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<Category>("전체");
  const [lightboxItems, setLightboxItems] = useState<GalleryItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (items: GalleryItem[], index: number) => {
    setLightboxItems(items);
    setLightboxIndex(index);
  };

  const filteredItems =
    activeCategory === "전체"
      ? galleryData
      : galleryData.filter((item) => item.category === activeCategory);

  // 마르키용: 짝수/홀수 행으로 분할
  const rowA = galleryData.filter((_, i) => i % 2 === 0);
  const rowB = galleryData.filter((_, i) => i % 2 !== 0);

  return (
    <>
      <section className="space-y-10">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-6xl space-y-3 px-6"
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

        {/* 카테고리 필터 */}
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                  activeCategory === cat
                    ? "border-[#6366F1] bg-[#6366F1] text-white shadow-[0_0_16px_rgba(99,102,241,0.35)]"
                    : "border-white/10 bg-white/[0.04] text-zinc-400 hover:border-[#6366F1]/40 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 전체: 인피니트 마르키 두 줄 */}
        {activeCategory === "전체" && (
          <div className="space-y-4">
            <MarqueeRow
              items={rowA.length > 0 ? rowA : galleryData}
              direction="left"
              speed={8}
              onCardClick={(i) => openLightbox(rowA.length > 0 ? rowA : galleryData, i)}
            />
            <MarqueeRow
              items={rowB.length > 0 ? rowB : galleryData}
              direction="right"
              speed={10}
              onCardClick={(i) => openLightbox(rowB.length > 0 ? rowB : galleryData, i)}
            />
          </div>
        )}

        {/* 카테고리 선택 시: 그리드 */}
        {activeCategory !== "전체" && (
          <div className="mx-auto max-w-6xl px-6">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={activeCategory}
                className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
              >
                {filteredItems.length > 0 ? (
                  filteredItems.map((item, i) => (
                    <GridCard
                      key={item.id}
                      item={item}
                      onClick={() => openLightbox(filteredItems, i)}
                    />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full flex flex-col items-center gap-3 py-20 text-center"
                  >
                    <span className="text-4xl">📷</span>
                    <p className="text-zinc-500">곧 사진이 업로드될 예정입니다.</p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* 라이트박스 */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            items={lightboxItems}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
