"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Send, X, MessageCircle } from "lucide-react";

/* ── 타입 ─────────────────────────────────────────── */
interface MessageButton {
  label: string;
  href: string;
  external?: boolean; // false 이면 같은 탭 이동 (기본값 true)
}

interface Message {
  id: number;
  from: "user" | "bot";
  text: string;
  buttons?: MessageButton[];
}

/* ── 상담 채널 버튼 (재사용) ────────────────────────── */
const CONTACT_BUTTONS: MessageButton[] = [
  { label: "📸 인스타그램 DM (@likelion_ksu)", href: "https://www.instagram.com/likelion_ksu/" },
  { label: "📞 전화 문의 (010-9510-1463)", href: "tel:010-9510-1463" },
];

const LOGO_URL =
  "https://i.ibb.co/1GYV5gw5/vh1gk-BVNsa1-HLq-Dfi9b70b-Rsu-BU.png";

/* ── 공통 플로팅 버튼 스타일 ────────────────────────── */
const floatBtn =
  "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-[#6366f1]/30 bg-[#6366f1] text-white shadow-[0_0_18px_rgba(99,102,241,0.45)] backdrop-blur-[10px] transition-all duration-200 hover:scale-110 hover:shadow-[0_0_28px_rgba(99,102,241,0.7)]";

/* ── 타이핑 인디케이터 ───────────────────────────────── */
function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.2 }}
      className="flex justify-start"
    >
      <img
        src={LOGO_URL}
        alt="bot"
        className="mr-2 mt-0.5 h-7 w-7 shrink-0 rounded-full border border-[#6366f1]/30 object-cover"
      />
      <div className="rounded-2xl rounded-bl-sm border border-white/10 bg-white/[0.06] px-4 py-3">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-zinc-400"
              animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
              transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18, ease: "easeInOut" }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ── 챗봇 메시지 말풍선 ──────────────────────────────── */
function Bubble({ msg }: { msg: Message }) {
  const isUser = msg.from === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <img
          src={LOGO_URL}
          alt="bot"
          className="mr-2 mt-0.5 h-7 w-7 shrink-0 rounded-full border border-[#6366f1]/30 object-cover"
        />
      )}
      <div className="flex max-w-[78%] flex-col gap-2">
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
            isUser
              ? "rounded-br-sm bg-[#6366f1] text-white"
              : "rounded-bl-sm border border-white/10 bg-white/[0.06] text-zinc-200"
          }`}
        >
          {msg.text}
        </div>
        {msg.buttons && msg.buttons.length > 0 && (
          <div className="flex flex-col gap-1.5 pl-0.5">
            {msg.buttons.map((btn) => (
              <a
                key={btn.href}
                href={btn.href}
                {...(btn.external !== false
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#6366f1]/40 bg-[#6366f1]/10 px-3.5 py-2 text-xs font-semibold text-[#6366f1] transition-colors hover:bg-[#6366f1]/20"
              >
                {btn.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ── 챗봇 창 ─────────────────────────────────────────── */
function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      from: "bot",
      text: "안녕하세요! 경성대 멋쟁이사자처럼의 성장을 돕는 AI 어드바이저입니다. 무엇을 도와드릴까요? 🦁",
      buttons: [
        { label: "❓ 자주 묻는 질문 확인하기", href: "/apply#faq", external: false },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  let nextId = useRef(2);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const send = () => {
    const text = input.trim();
    if (!text || isTyping) return;
    const userMsg: Message = { id: nextId.current++, from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    const delay = 1500 + Math.random() * 1000;
    setTimeout(() => {
      const botMsg: Message = {
        id: nextId.current++,
        from: "bot",
        text: "상세한 문의는 위 상담 채널을 이용해 주시면 감사하겠습니다! 👇",
        buttons: CONTACT_BUTTONS,
      };
      setIsTyping(false);
      setMessages((prev) => [...prev, botMsg]);
    }, delay);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="absolute bottom-16 left-0 z-50 flex w-80 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#111]/90 shadow-[0_0_50px_rgba(99,102,241,0.2)] backdrop-blur-[20px]"
      style={{ height: 420 }}
    >
      {/* 상단 글로우 라인 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6366f1]/60 to-transparent" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-24 w-48 -translate-x-1/2 rounded-full bg-[#6366f1]/10 blur-2xl" />

      {/* 헤더 */}
      <div className="relative flex items-center gap-3 border-b border-white/8 px-4 py-3">
        <img
          src={LOGO_URL}
          alt="logo"
          className="h-9 w-9 rounded-full border-2 border-[#6366f1]/40 object-cover shadow-[0_0_10px_rgba(99,102,241,0.4)]"
        />
        <div>
          <p className="text-sm font-bold text-white">경성대 멋쟁이사자처럼</p>
          <p className="flex items-center gap-1 text-[10px] text-zinc-500">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            온라인
          </p>
        </div>
        <button
          onClick={onClose}
          className="ml-auto flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-zinc-500 transition hover:border-white/20 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 scrollbar-hide">
        {messages.map((m) => <Bubble key={m.id} msg={m} />)}
        <AnimatePresence>
          {isTyping && <TypingIndicator />}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <div className="border-t border-white/8 px-3 py-3">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 focus-within:border-[#6366f1]/50">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="메시지를 입력하세요..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-zinc-600 focus:outline-none"
          />
          <button
            onClick={send}
            disabled={!input.trim() || isTyping}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#6366f1] text-white transition hover:bg-[#4f52d4] disabled:opacity-30"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ── 메인 컴포넌트 ───────────────────────────────────── */
export default function FloatingButtons() {
  const [chatOpen, setChatOpen] = useState(false);
  const [isTop, setIsTop] = useState(true);
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const check = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setIsTop(scrollY <= 4);
      setIsBottom(maxScroll > 0 && scrollY >= maxScroll - 4);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const scrollBottom = () =>
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

  return (
    <>
      {/* ── 우측 하단: 상하 네비게이션 ─────────────────── */}
      <div className="fixed bottom-8 right-6 z-50 flex flex-col gap-2">
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.93 }}
          onClick={scrollTop}
          className={floatBtn}
          style={{ opacity: isTop ? 0.35 : 1, transition: "opacity 0.3s" }}
          aria-label="페이지 맨 위로"
        >
          <ChevronUp className="h-5 w-5" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.12 }}
          whileTap={{ scale: 0.93 }}
          onClick={scrollBottom}
          className={floatBtn}
          style={{ opacity: isBottom ? 0.35 : 1, transition: "opacity 0.3s" }}
          aria-label="페이지 맨 아래로"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.button>
      </div>

      {/* ── 좌측 하단: 챗봇 ─────────────────────────────── */}
      <div className="fixed bottom-8 left-6 z-50">
        <AnimatePresence>
          {chatOpen && <ChatWindow onClose={() => setChatOpen(false)} />}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setChatOpen((v) => !v)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#6366f1]/50 bg-[#6366f1] shadow-[0_0_24px_rgba(99,102,241,0.5)] transition-shadow duration-300 hover:shadow-[0_0_36px_rgba(99,102,241,0.75)]"
          aria-label="챗봇 열기"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </motion.button>
      </div>
    </>
  );
}
