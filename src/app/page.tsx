import Link from "next/link";

const eyebrow = "font-mono text-xs uppercase tracking-[0.18em] text-muted";

const FEATURES = [
  {
    title: "依職缺出題",
    body: "根據你貼上的工作內容和條件要求，挑出這個職缺最看重的能力來問，不是千篇一律的通用題庫。",
  },
  {
    title: "會追問的面試官",
    body: "回答太空泛時，它會像真人面試官一樣繼續追問細節，逼你把經驗講清楚、講具體。",
  },
  {
    title: "題數自己決定",
    body: "想快速暖身就問 1 題，想完整模擬就拉到 10 題。追問也算一題，時間好掌握。",
  },
  {
    title: "誠實的評分",
    body: "只看回答內容打分數，空泛或答非所問就是低分；錄取建議依分數決定，不會說好聽話。",
  },
  {
    title: "逐題示範回答",
    body: "每一題都附上示範回答，盡量用你自己的經歷改寫，缺少的細節用〔〕標出來讓你補上。",
  },
  {
    title: "不保存你的回答",
    body: "我們的伺服器不會儲存面試內容，重新整理就清空。回答會送到 OpenAI 產生題目和評分。",
  },
];

const STEPS = [
  { title: "貼上職缺描述", body: "把職缺的工作內容和條件要求貼進來，再選好想練幾題。" },
  { title: "一題一題回答", body: "面試官依職缺提問，看你的回答決定要追問還是換下一個主題。" },
  { title: "看評分與示範回答", body: "拿到總分、錄取建議、改進方向，以及每一題可以怎麼答得更好。" },
];

const FAQ = [
  { q: "需要註冊帳號嗎？", a: "不需要。打開練習頁面，貼上職缺描述就能直接開始。" },
  { q: "什麼職缺都可以練嗎？", a: "可以。只要貼上工作內容和條件要求，描述越完整，題目就越貼近這個職缺。" },
  {
    q: "示範回答可以直接背起來嗎？",
    a: "建議當成回答架構參考。AI 有時會加入你沒提過的細節，〔〕標出的地方也要換成你自己的經歷。面試時，請只說你真的做過的事。",
  },
  {
    q: "我的回答會被保存嗎？",
    a: "我們的伺服器不會儲存面試內容，重新整理頁面就會清空。不過為了出題和評分，職缺描述和回答會傳送到 OpenAI 處理。",
  },
  { q: "評分準確嗎？", a: "分數由 AI 依回答內容評估，適合用來找出自己的盲點，但不代表真實的錄取結果。" },
];

// 首頁右側的產品示意畫面，純裝飾用，內容都寫在左邊文字裡
function HeroPreview() {
  return (
    <div aria-hidden className="relative mx-auto w-full max-w-md lg:max-w-none">
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-accent-soft/60 blur-2xl" />
      <div className="rounded-3xl border border-line bg-surface shadow-[0_30px_60px_-30px_rgba(22,20,15,0.35)]">
        <div className="flex items-center gap-1.5 border-b border-line px-5 py-3.5">
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="size-2.5 rounded-full bg-line" />
          <span className="ml-auto font-mono text-[11px] text-muted">示意畫面</span>
        </div>
        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-muted">第 2 / 3 題</span>
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-xs font-semibold text-accent">追問</span>
          </div>
          <div className="h-1 rounded-full bg-line">
            <div className="h-1 w-1/3 rounded-full bg-accent" />
          </div>
          <p className="text-[15px] font-semibold leading-7">你提到用 Lighthouse 量測效能，當時發現了什麼瓶頸？又是怎麼處理的？</p>
          <div className="rounded-2xl bg-paper p-4 text-sm leading-6 text-muted">
            我把商品圖改成 lazy load，並動態載入大型套件，首頁 LCP 從 4.2 秒降到 2.1 秒……
          </div>
          <div className="self-start rounded-full bg-ink px-5 py-2 text-sm font-semibold text-paper">送出回答</div>
        </div>
      </div>

      <div className="absolute -bottom-10 -right-3 w-44 rounded-2xl border border-line bg-surface p-4 shadow-[0_20px_40px_-20px_rgba(22,20,15,0.4)] sm:-right-8">
        <p className="font-mono text-[11px] text-muted">面試總分</p>
        <p className="mt-1 text-4xl font-black tabular-nums text-accent">85</p>
        <p className="mt-1 text-sm font-semibold">建議錄取</p>
      </div>
    </div>
  );
}

// Landing Page：介紹產品，並引導使用者進入 /interview 開始練習
export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="bg-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid w-full max-w-6xl items-center gap-16 px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[1.1fr_1fr] lg:pb-32">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 font-mono text-xs text-muted">
              <span className="size-1.5 rounded-full bg-accent" />
              AI 模擬面試・依職缺出題
            </p>
            <h1 className="mt-6 break-keep text-4xl font-bold leading-[1.15] tracking-tight sm:text-6xl sm:leading-[1.1]">
              下一場面試，
              <br />
              先在這裡
              <span className="relative whitespace-nowrap text-accent">
                練過一遍
                <svg aria-hidden viewBox="0 0 200 12" className="absolute -bottom-2 left-0 h-3 w-full" preserveAspectRatio="none">
                  <path d="M2 9 C 50 2, 150 2, 198 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
              。
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-8 text-muted">
              貼上職缺描述，AI 面試官會依照職位要求出題、針對你的回答追問，最後給你分數、具體建議，和每一題的示範回答。
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/interview"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 font-semibold text-paper transition hover:opacity-90"
              >
                開始模擬面試
                <span aria-hidden className="transition group-hover:translate-x-0.5">→</span>
              </Link>
              <Link href="#how" className="rounded-full border border-line bg-surface px-7 py-3.5 font-semibold transition hover:border-ink">
                看看怎麼運作
              </Link>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              {["不用註冊，打開就能練", "題數 1–10 題自訂", "伺服器不保存回答"].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span aria-hidden className="text-accent">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <HeroPreview />
        </div>
      </section>

      {/* 功能 */}
      <section id="features" className="scroll-mt-16 border-t border-line bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
          <div className="max-w-2xl">
            <p className={eyebrow}>功能</p>
            <h2 className="mt-4 break-keep text-3xl font-bold tracking-tight sm:text-4xl">不只是題庫，是一位會追問的面試官。</h2>
            <p className="mt-4 text-lg leading-8 text-muted">從出題、追問到評分，整個流程都依照你要應徵的職缺量身打造。</p>
          </div>
          <ul className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((feature, index) => (
              <li key={feature.title} className="flex flex-col gap-3 bg-surface p-8">
                <span className="font-mono text-sm text-accent">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="leading-7 text-muted">{feature.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 使用流程 */}
      <section id="how" className="scroll-mt-16 border-t border-line">
        <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
          <div className="max-w-2xl">
            <p className={eyebrow}>使用流程</p>
            <h2 className="mt-4 break-keep text-3xl font-bold tracking-tight sm:text-4xl">三個步驟，開始練習。</h2>
          </div>
          <ol className="mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, index) => (
              <li key={step.title} className="relative border-t-2 border-ink pt-6">
                <span className="font-mono text-sm text-muted">STEP {String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-3 leading-7 text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 你會拿到什麼 */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-16 px-4 py-24 sm:px-6 lg:grid-cols-2">
          <div>
            <p className={eyebrow}>面試報告</p>
            <h2 className="mt-4 break-keep text-3xl font-bold tracking-tight sm:text-4xl">練完馬上知道，下一次要怎麼答。</h2>
            <p className="mt-4 text-lg leading-8 text-muted">
              每場面試結束都有一份完整報告：總分和錄取建議、表現好的地方、改進方向，還有每一題的評論和示範回答。
            </p>
            <Link href="/interview" className="mt-8 inline-flex items-center gap-2 font-semibold text-accent hover:underline">
              現在就練一場 <span aria-hidden>→</span>
            </Link>
          </div>

          <div aria-hidden className="rounded-3xl border border-line bg-paper p-6 sm:p-8">
            <div className="flex items-end justify-between gap-4 border-b border-line pb-6">
              <div>
                <p className="font-mono text-xs text-muted">面試總分</p>
                <p className="mt-1 text-6xl font-black tabular-nums text-accent">78</p>
              </div>
              <span className="rounded-full border border-line bg-surface px-3 py-1 text-sm font-semibold">可以考慮</span>
            </div>
            <div className="grid gap-3 py-6 sm:grid-cols-2">
              <div className="rounded-2xl bg-ok-soft p-4 text-sm">
                <p className="font-semibold text-ok">表現好的地方</p>
                <p className="mt-2 leading-6 text-ink/80">有具體數據支持效能優化的成果</p>
              </div>
              <div className="rounded-2xl bg-accent-soft p-4 text-sm">
                <p className="font-semibold text-accent">改進建議</p>
                <p className="mt-2 leading-6 text-ink/80">補充跨團隊協作時遇到的困難</p>
              </div>
            </div>
            <div className="rounded-2xl border border-line bg-surface p-4 text-sm leading-7">
              <p className="font-mono text-xs text-muted">示範回答</p>
              <p className="mt-2 text-ink/85">
                在〔專案名稱〕中，我發現首頁圖片拖慢載入速度，於是把商品圖改成 lazy load，讓 LCP 從 4.2 秒降到 2.1 秒……
              </p>
            </div>
            <p className="mt-4 text-center font-mono text-[11px] text-muted">示意內容</p>
          </div>
        </div>
      </section>

      {/* 常見問題 */}
      <section id="faq" className="scroll-mt-16 border-t border-line">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <p className={eyebrow}>常見問題</p>
            <h2 className="mt-4 break-keep text-3xl font-bold tracking-tight sm:text-4xl">開始之前，你可能想知道。</h2>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {FAQ.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <span aria-hidden className="grid size-7 shrink-0 place-items-center rounded-full border border-line text-muted transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl leading-7 text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 結尾行動呼籲 */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="relative mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] bg-ink px-6 py-16 text-center text-paper sm:px-12 sm:py-20">
          <div aria-hidden className="absolute -right-24 -top-24 size-72 rounded-full bg-accent/30 blur-3xl" />
          <h2 className="relative break-keep text-3xl font-bold tracking-tight sm:text-5xl">準備好了嗎？</h2>
          <p className="relative mx-auto mt-5 max-w-xl text-lg leading-8 text-paper/70">
            貼上你想應徵的職缺、選好題數，馬上就能開始一場模擬面試。
          </p>
          <Link
            href="/interview"
            className="relative mt-10 inline-flex items-center gap-2 rounded-full bg-paper px-8 py-4 font-semibold text-ink transition hover:opacity-90"
          >
            開始模擬面試 <span aria-hidden>→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
