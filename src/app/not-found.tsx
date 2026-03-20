import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#0A0A0A] px-6 text-center">
      {/* 배경 글로우 */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#6366F1]/8 blur-[120px]"
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        <p className="text-8xl font-extrabold text-[#6366F1] opacity-30">404</p>
        <h1 className="text-3xl font-extrabold text-white md:text-4xl">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-zinc-500">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Link
          href="/"
          className="mt-2 rounded-full bg-[#6366F1] px-8 py-3 text-sm font-bold text-white transition-all hover:bg-[#4f52d4] hover:shadow-lg hover:shadow-[#6366F1]/30"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </main>
  );
}
