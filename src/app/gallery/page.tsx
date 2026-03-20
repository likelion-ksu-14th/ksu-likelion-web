import GallerySection from "@/components/sections/GallerySection";

export const metadata = {
  title: "Gallery | 경성대 멋쟁이사자처럼",
  description: "경성대 멋쟁이사자처럼의 활동 사진 갤러리",
};

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] pb-36 pt-40">
      {/* 배경 글로우 */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-[#6366F1]/8 blur-[140px]"
      />
      <div className="relative z-10">
        <GallerySection />
      </div>
    </main>
  );
}
