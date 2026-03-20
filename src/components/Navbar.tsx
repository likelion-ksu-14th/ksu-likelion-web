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
    <header
      className={[
        "fixed left-0 top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-white/10 bg-black/50 backdrop-blur-md shadow-[0_1px_20px_rgba(0,0,0,0.4)]"
          : "border-b border-transparent bg-transparent",
      ].join(" ")}
    >
      <nav className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6">
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
            className="h-12 w-auto object-contain md:h-14"
            priority
            unoptimized
          />
        </a>

        {/* ── 중앙 메뉴 (데스크톱) ── */}
        <ul className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={[
                    "relative text-sm font-medium transition-colors duration-200",
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
            href="https://forms.gle/cuYPDcYcmB22nbDG8"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-[#6366F1] px-5 py-2 text-xs font-bold text-white transition-all hover:bg-[#4f52d4] hover:shadow-lg hover:shadow-[#6366F1]/30 md:inline-flex"
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
        <ul className="flex flex-col px-6 py-4">
          {NAV_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                onClick={() => setMenuOpen(false)}
                className={[
                  "block py-3 text-sm font-medium transition-colors duration-200 hover:text-white",
                  pathname === href ? "text-white" : "text-zinc-400",
                ].join(" ")}
              >
                {label}
              </Link>
            </li>
          ))}
          <li className="mt-4 pb-2">
            <a
              href="https://forms.gle/cuYPDcYcmB22nbDG8"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
              className="block rounded-full bg-[#6366F1] px-5 py-2.5 text-center text-sm font-bold text-white"
            >
              14기 지원하기
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
