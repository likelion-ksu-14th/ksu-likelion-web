import Link from "next/link";

const QUICK_LINKS = [
  { href: "/about", label: "About" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/projects", label: "Projects" },
  { href: "/members", label: "Members" },
  { href: "/apply", label: "지원하기", external: false },
];

/* SVG 아이콘 모음 */
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-5 w-5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="h-5 w-5">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.6 2.72h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.3a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.72 18z" />
    </svg>
  );
}

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/likelion_ksu/",
    icon: <IconInstagram />,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/likelionksu/",
    icon: <IconFacebook />,
  },
  {
    label: "010-9510-1463",
    href: "tel:010-9510-1463",
    icon: <IconPhone />,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#0c0e1a]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          {/* ── 좌측: 로고 + 소개 ── */}
          <div className="flex flex-col gap-4">
            <a
              href="/"
              className="inline-block w-fit transition-[filter] duration-200 hover:brightness-125"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://i.ibb.co/1GYV5gw5/vh1gk-BVNsa1-HLq-Dfi9b70b-Rsu-BU.png"
                alt="경성대 멋쟁이사자처럼"
                className="h-28 w-28 rounded-full object-cover"
              />
            </a>
            <p className="text-sm font-semibold leading-relaxed text-slate-200">
              경성대학교 멋쟁이사자처럼 14기
            </p>
            <p className="text-sm leading-relaxed text-slate-400">
              상상을 실행으로, 결과로 증명하다.
            </p>
          </div>

          {/* ── 빠른 링크 ── */}
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-300">
              Quick Links
            </p>
            <ul className="flex flex-col gap-3">
              {QUICK_LINKS.map(({ href, label, external }) => (
                <li key={href}>
                  {external ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base text-slate-400 transition-colors duration-150 hover:text-white"
                    >
                      {label}
                    </a>
                  ) : (
                    <Link
                      href={href}
                      className="text-base text-slate-400 transition-colors duration-150 hover:text-white"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* ── 연락처 ── */}
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-300">
              Contact
            </p>
            <ul className="flex flex-col gap-4">
              {SOCIALS.map(({ label, href, icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="group flex items-center gap-3 text-slate-400 transition-colors duration-150 hover:text-white"
                  >
                    <span className="text-[#6366F1] transition-colors duration-150 group-hover:text-indigo-400">
                      {icon}
                    </span>
                    <span className="text-base">{label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── 모집 안내 ── */}
          <div>
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-300">
              모집 안내
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold text-slate-200">모집 대상</p>
                <p className="text-sm leading-relaxed text-slate-400">
                  경성대 재학생 · 휴학생 · 편입생 · 졸업유예생
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["기획", "디자인", "프론트엔드", "백엔드", "AI"].map((field) => (
                  <span
                    key={field}
                    className="rounded-full border border-[#6366F1]/40 bg-[#6366F1]/15 px-2.5 py-0.5 text-xs font-medium text-[#6366F1]"
                  >
                    {field}
                  </span>
                ))}
              </div>
              <div className="rounded-lg border border-[#22C55E]/20 bg-[#22C55E]/5 px-3 py-2">
                <p className="text-sm font-bold text-[#22C55E]">면접 없음 · 서류 100% 선발</p>
                <p className="mt-0.5 text-sm text-slate-400">부담 없이 지원하세요!</p>
              </div>
              <a
                href="/apply"
                className="inline-block rounded-full bg-[#6366F1] px-4 py-2 text-center text-sm font-bold text-white transition-all hover:bg-[#4f52d4]"
              >
                지금 지원하기 →
              </a>
            </div>
          </div>
        </div>

        {/* ── 하단 카피라이트 ── */}
        <div className="mt-12 border-t border-slate-800 pt-6 text-center">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} 경성대학교 멋쟁이사자처럼. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
