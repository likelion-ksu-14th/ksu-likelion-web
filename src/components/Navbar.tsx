"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/projects", label: "Projects" },
  { href: "/members", label: "Members" },
  { href: "/gallery", label: "Gallery" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    // 초기 상태도 즉시 반영
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
    {/* ── 모바일 메뉴 오버레이 — 터치 시 메뉴 닫기 ── */}
    {menuOpen && (
      <div
        aria-hidden
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        onClick={() => setMenuOpen(false)}
      />
    )}

    <header
      className={[
        "fixed left-0 top-0 z-50 w-full transition-all duration-500",
        scrolled
          ? "border-b border-white/10 bg-black/70 backdrop-blur-xl shadow-[0_2px_32px_rgba(0,0,0,0.5)]"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      {/*
        스크롤 전: py-5 md:py-7  → 넉넉한 여백, 로고가 숨쉬는 느낌
        스크롤 후: py-3 md:py-4  → 컴팩트하게 축소 (화면 공간 확보)
      */}
      <nav
        className={[
          "mx-auto flex max-w-6xl items-center justify-between px-6 transition-all duration-500",
          scrolled ? "py-3 md:py-4" : "py-5 md:py-7",
        ].join(" ")}
      >
        {/* ── 이미지 로고 ── */}
        <a
          href="/"
          onClick={(e) => { e.preventDefault(); window.location.href = "/"; }}
          className="flex items-center transition-opacity hover:opacity-80"
        >
          <Image
            src="https://i.ibb.co/xq5LMy14/001-18.png"
            alt="멋쟁이사자처럼 KSU 로고"
            width={180}
            height={54}
            className={[
              "w-auto object-contain transition-all duration-500",
              scrolled ? "h-10 md:h-11" : "h-12 md:h-14",
            ].join(" ")}
            priority
            unoptimized
          />
        </a>

        {/* ── 중앙 메뉴 (데스크톱) ── */}
        <ul className="hidden items-center gap-10 md:flex">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    "relative text-base font-medium transition-colors duration-200",
                    "after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full",
                    "after:origin-left after:scale-x-0 after:bg-[#6366F1]",
                    "after:transition-transform after:duration-200",
                    "hover:text-white hover:after:scale-x-100",
                    active ? "text-white after:scale-x-100" : "text-zinc-300",
                  ].join(" ")}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ── 오른쪽: CTA + 햄버거 ── */}
        <div className="flex items-center gap-4">
          <a
            href="/apply"
            className="hidden rounded-full bg-[#6366F1] px-5 py-2 text-sm font-bold text-white transition-all hover:bg-[#4f52d4] hover:shadow-lg hover:shadow-[#6366F1]/30 md:inline-flex"
          >
            14기 지원하기
          </a>

          {/* 햄버거 (모바일) */}
          <button
            aria-label="메뉴 열기"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span className={["h-px w-5 bg-white transition-transform duration-300", menuOpen ? "translate-y-[7px] rotate-45" : ""].join(" ")} />
            <span className={["h-px w-5 bg-white transition-opacity duration-300",   menuOpen ? "opacity-0" : ""].join(" ")} />
            <span className={["h-px w-5 bg-white transition-transform duration-300", menuOpen ? "-translate-y-[7px] -rotate-45" : ""].join(" ")} />
          </button>
        </div>
      </nav>

      {/* ── 모바일 드로어 ── */}
      <div
        className={[
          "overflow-hidden border-t border-white/10 bg-black/85 backdrop-blur-md transition-all duration-300 ease-in-out md:hidden",
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <ul className="flex flex-col px-6 py-5">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMenuOpen(false)}
                className={[
                  "block py-3 text-base font-medium transition-colors duration-200 hover:text-white",
                  pathname === href ? "text-white" : "text-zinc-400",
                ].join(" ")}
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="mt-4 pb-2">
            <a
              href="/apply"
              onClick={() => setMenuOpen(false)}
              className="block rounded-full bg-[#6366F1] px-5 py-2.5 text-center text-sm font-bold text-white"
            >
              14기 지원하기
            </a>
          </li>
        </ul>
      </div>
    </header>
    </>
  );
}
