import Link from "next/link";

// 品牌標誌：墨黑方塊加一個橙色圓點，和產品名稱
export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-ink">
      <span aria-hidden className="relative grid size-8 place-items-center rounded-lg bg-ink">
        <span className="size-2.5 rounded-full bg-accent" />
      </span>
      Interview Lab
    </Link>
  );
}

const NAV = [
  { href: "/#features", label: "功能" },
  { href: "/#how", label: "使用流程" },
  { href: "/#faq", label: "常見問題" },
];

// 每一頁最上方的導覽列，捲動時固定在頂端
export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        <Logo />
        <nav aria-label="主要導覽" className="hidden items-center gap-8 text-sm text-muted md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/interview"
          className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper transition hover:opacity-85"
        >
          開始練習
        </Link>
      </div>
    </header>
  );
}
