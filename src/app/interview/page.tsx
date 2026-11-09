import type { Metadata } from "next";
import InterviewSimulator from "./InterviewSimulator";

export const metadata: Metadata = {
  title: "模擬面試",
  description: "貼上職缺描述並選好題數，開始和 AI 面試官練習。",
};

// 面試功能頁：上方是標題，下方是面試流程元件
export default function InterviewPage() {
  return (
    <main className="relative flex-1">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-80" />
      <div className="relative mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 pb-24 pt-12 sm:px-6 sm:pt-16">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">模擬面試</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">開始你的模擬面試</h1>
          <p className="mt-3 leading-7 text-muted">貼上職缺描述並選好題數，面試官會一題一題問你，答完後給你評分、建議和每題的示範回答。</p>
        </div>
        <InterviewSimulator />
      </div>
    </main>
  );
}
