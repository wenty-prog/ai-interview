import Link from "next/link";
import { Logo } from "./SiteHeader";

const LINKS = [
  { href: "/interview", label: "開始練習" },
  { href: "/#features", label: "功能" },
  { href: "/#how", label: "使用流程" },
  { href: "/#faq", label: "常見問題" },
];

// 每一頁最下方的頁尾
export default function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div className="flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-sm leading-6 text-muted">依照真實職缺出題的 AI 模擬面試，讓你在正式上場前先練過一遍。</p>
        </div>

        <nav aria-label="頁尾導覽">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">產品</p>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-ink/80 transition hover:text-accent">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">說明</p>
          <p className="mt-4 text-sm leading-6 text-muted">
            題目、評分和示範回答由 OpenAI 的模型產生，結果僅供練習參考，不代表真實的錄取結果。
          </p>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto w-full max-w-6xl px-4 py-5 text-xs text-muted sm:px-6">© 2026 Interview Lab</p>
      </div>
    </footer>
  );
}
